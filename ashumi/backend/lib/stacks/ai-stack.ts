import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface AiStackProps extends cdk.StackProps {
  environment: string;
}

export class AiStack extends cdk.Stack {
  public readonly chatFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: AiStackProps) {
    super(scope, id, props);

    const { environment } = props;

    // Store Bedrock model ID in Parameter Store
    const bedrockModelParameter = new ssm.StringParameter(this, 'BedrockModelId', {
      parameterName: `/ashumi/${environment}/bedrock/model-id`,
      stringValue: 'anthropic.claude-3-haiku-20240307-v1:0',
      description: 'Bedrock model ID for chat functionality',
    });

    // Lambda function for Bedrock chat
    this.chatFunction = new lambda.Function(this, 'BedrockChatFunction', {
      functionName: `ashumi-bedrock-chat-${environment}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const ssmClient = new SSMClient({ region: process.env.AWS_REGION });

const SYSTEM_PROMPT = "You are a helpful financial education assistant for families. Provide educational information about family financial planning, savings, and contribution strategies. Always remind users that this is educational information only and not financial advice. Keep responses concise and family-friendly. Never provide specific investment recommendations or market predictions.";

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const { message } = JSON.parse(event.body);
    
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Message is required',
        }),
      };
    }

    // Get model ID from Parameter Store
    const modelIdParam = await ssmClient.send(new GetParameterCommand({
      Name: process.env.MODEL_ID_PARAMETER,
    }));
    
    const modelId = modelIdParam.Parameter.Value;

    // Prepare the request for Claude
    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    };

    // Invoke Bedrock
    const command = new InvokeModelCommand({
      modelId: modelId,
      body: JSON.stringify(requestBody),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    const aiResponse = responseBody.content[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: Date.now().toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return safe fallback response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: Date.now().toString(),
          text: "I'm sorry, I'm having trouble processing your request right now. For family financial planning, consider starting with a simple budget and involving all family members in age-appropriate financial discussions. Remember, this is educational information only.",
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      }),
    };
  }
};
      `),
      environment: {
        MODEL_ID_PARAMETER: bedrockModelParameter.parameterName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant permissions to invoke Bedrock
    this.chatFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: [
        `arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0`,
        `arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
      ],
    }));

    // Grant permission to read from Parameter Store
    bedrockModelParameter.grantRead(this.chatFunction);

    // Outputs
    new cdk.CfnOutput(this, 'ChatFunctionArn', {
      value: this.chatFunction.functionArn,
      exportName: `${id}-ChatFunctionArn`,
    });
  }
}