import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  environment: string;
  table: dynamodb.Table;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
  bedrockChatFunction: lambda.Function;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { environment, table, userPool, userPoolClient, bedrockChatFunction } = props;

    // Create API Gateway
    this.api = new apigateway.RestApi(this, 'AshumiApi', {
      restApiName: `ashumi-api-${environment}`,
      description: 'Ashumi Family Contribution Tracker API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'AshumiAuthorizer', {
      cognitoUserPools: [userPool],
      authorizerName: `ashumi-authorizer-${environment}`,
    });

    // Lambda function for members API
    const membersFunction = new lambda.Function(this, 'MembersFunction', {
      functionName: `ashumi-members-${environment}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const httpMethod = event.httpMethod;
    const pathParameters = event.pathParameters || {};
    
    switch (httpMethod) {
      case 'GET':
        return await getMembers(userId);
      case 'POST':
        return await createMember(userId, JSON.parse(event.body));
      case 'PUT':
        return await updateMember(userId, pathParameters.id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteMember(userId, pathParameters.id);
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Internal server error' }),
    };
  }
};

async function getMembers(userId) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': \`USER#\${userId}\`,
      ':sk': 'MEMBER#',
    },
  };

  const result = await docClient.send(new QueryCommand(params));
  
  const members = result.Items.map(item => ({
    id: item.sk.replace('MEMBER#', ''),
    name: item.name,
    contributionAmount: item.contributionAmount,
    userId: userId,
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: members }),
  };
}

async function createMember(userId, body) {
  const { name, contributionAmount } = body;
  const memberId = Date.now().toString();
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: \`USER#\${userId}\`,
      sk: \`MEMBER#\${memberId}\`,
      name,
      contributionAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  await docClient.send(new PutCommand(params));

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: {
        id: memberId,
        name,
        contributionAmount,
        userId,
      },
    }),
  };
}

async function updateMember(userId, memberId, body) {
  const { name, contributionAmount } = body;
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pk: \`USER#\${userId}\`,
      sk: \`MEMBER#\${memberId}\`,
    },
    UpdateExpression: 'SET #name = :name, contributionAmount = :contributionAmount, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':contributionAmount': contributionAmount,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await docClient.send(new UpdateCommand(params));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: {
        id: memberId,
        name: result.Attributes.name,
        contributionAmount: result.Attributes.contributionAmount,
        userId,
      },
    }),
  };
}

async function deleteMember(userId, memberId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pk: \`USER#\${userId}\`,
      sk: \`MEMBER#\${memberId}\`,
    },
  };

  await docClient.send(new DeleteCommand(params));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: null }),
  };
}
      `),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Lambda function for plans API
    const plansFunction = new lambda.Function(this, 'PlansFunction', {
      functionName: `ashumi-plans-${environment}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const httpMethod = event.httpMethod;
    const pathParameters = event.pathParameters || {};
    
    switch (httpMethod) {
      case 'GET':
        return await getPlans(userId);
      case 'POST':
        return await createPlan(userId, JSON.parse(event.body));
      case 'PUT':
        return await updatePlan(userId, pathParameters.id, JSON.parse(event.body));
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Internal server error' }),
    };
  }
};

async function getPlans(userId) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': \`USER#\${userId}\`,
      ':sk': 'PLAN#',
    },
  };

  const result = await docClient.send(new QueryCommand(params));
  
  const plans = result.Items.map(item => ({
    id: item.sk.replace('PLAN#', ''),
    name: item.name,
    totalAmount: item.totalAmount,
    frequency: item.frequency,
    userId: userId,
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: plans }),
  };
}

async function createPlan(userId, body) {
  const { name, totalAmount, frequency } = body;
  const planId = Date.now().toString();
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: \`USER#\${userId}\`,
      sk: \`PLAN#\${planId}\`,
      name,
      totalAmount,
      frequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  await docClient.send(new PutCommand(params));

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: {
        id: planId,
        name,
        totalAmount,
        frequency,
        userId,
      },
    }),
  };
}

async function updatePlan(userId, planId, body) {
  const { name, totalAmount, frequency } = body;
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pk: \`USER#\${userId}\`,
      sk: \`PLAN#\${planId}\`,
    },
    UpdateExpression: 'SET #name = :name, totalAmount = :totalAmount, frequency = :frequency, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':totalAmount': totalAmount,
      ':frequency': frequency,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await docClient.send(new UpdateCommand(params));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: {
        id: planId,
        name: result.Attributes.name,
        totalAmount: result.Attributes.totalAmount,
        frequency: result.Attributes.frequency,
        userId,
      },
    }),
  };
}
      `),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant DynamoDB permissions
    table.grantReadWriteData(membersFunction);
    table.grantReadWriteData(plansFunction);

    // API Gateway resources and methods
    const membersResource = this.api.root.addResource('members');
    const memberResource = membersResource.addResource('{id}');
    const plansResource = this.api.root.addResource('plans');
    const planResource = plansResource.addResource('{id}');
    const chatResource = this.api.root.addResource('chat');

    // Members endpoints
    membersResource.addMethod('GET', new apigateway.LambdaIntegration(membersFunction), {
      authorizer,
    });
    membersResource.addMethod('POST', new apigateway.LambdaIntegration(membersFunction), {
      authorizer,
    });
    memberResource.addMethod('PUT', new apigateway.LambdaIntegration(membersFunction), {
      authorizer,
    });
    memberResource.addMethod('DELETE', new apigateway.LambdaIntegration(membersFunction), {
      authorizer,
    });

    // Plans endpoints
    plansResource.addMethod('GET', new apigateway.LambdaIntegration(plansFunction), {
      authorizer,
    });
    plansResource.addMethod('POST', new apigateway.LambdaIntegration(plansFunction), {
      authorizer,
    });
    planResource.addMethod('PUT', new apigateway.LambdaIntegration(plansFunction), {
      authorizer,
    });

    // Chat endpoint
    chatResource.addMethod('POST', new apigateway.LambdaIntegration(bedrockChatFunction), {
      authorizer,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      exportName: `${this.stackName}-ApiUrl`,
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: this.api.restApiId,
      exportName: `${this.stackName}-ApiId`,
    });
  }
}