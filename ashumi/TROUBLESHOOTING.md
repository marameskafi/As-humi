# Troubleshooting Guide

## Common Issues and Solutions

### Frontend Issues

#### TypeScript/JSX Errors
If you see JSX or TypeScript compilation errors:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Expo Start Issues
If `npm start` fails:
```bash
npx expo install --fix
npm start -- --clear
```

#### Navigation Errors
If you see navigation-related errors, ensure all dependencies are installed:
```bash
npx expo install react-native-screens react-native-safe-area-context
```

### Backend Issues

#### CDK Bootstrap Required
If deployment fails with bootstrap error:
```bash
npx cdk bootstrap
```

#### Permission Errors
Ensure your AWS CLI is configured:
```bash
aws configure
aws sts get-caller-identity
```

#### Bedrock Access
If Bedrock chat fails, ensure your AWS account has access to Claude models:
1. Go to AWS Bedrock console
2. Request access to Anthropic Claude models
3. Wait for approval (usually instant)

### Service Switching Issues

#### Environment Variables
When switching to AWS services:
1. Copy `.env.example` to `.env`
2. Fill in values from CDK outputs
3. Update `USE_AWS_SERVICES` flag in `services/index.ts`

#### CORS Issues
If you get CORS errors:
- Ensure API Gateway has CORS enabled (it should be by default)
- Check that your API URL is correct in `.env`

## Getting Help

1. Check the console logs in both frontend and backend
2. Verify AWS CloudWatch logs for Lambda functions
3. Ensure all dependencies are installed with correct versions
4. Try clearing caches: `npm start -- --clear` for frontend