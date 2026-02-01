import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './stacks/auth-stack';
import { DataStack } from './stacks/data-stack';
import { ApiStack } from './stacks/api-stack';
import { AiStack } from './stacks/ai-stack';

export interface AshumiStageProps extends cdk.StageProps {
  environment: string;
}

export class AshumiStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AshumiStageProps) {
    super(scope, id, props);

    const { environment } = props;

    // Data layer - DynamoDB table
    const dataStack = new DataStack(this, 'DataStack', {
      environment,
    });

    // Authentication - Cognito User Pool
    const authStack = new AuthStack(this, 'AuthStack', {
      environment,
    });

    // AI services - Bedrock chat
    const aiStack = new AiStack(this, 'AiStack', {
      environment,
    });

    // API layer - API Gateway + Lambda functions
    const apiStack = new ApiStack(this, 'ApiStack', {
      environment,
      table: dataStack.table,
      userPool: authStack.userPool,
      userPoolClient: authStack.userPoolClient,
      bedrockChatFunction: aiStack.chatFunction,
    });

    // Add dependencies
    apiStack.addDependency(dataStack);
    apiStack.addDependency(authStack);
    apiStack.addDependency(aiStack);
  }
}