# Ashumi MVP

A full-stack family contribution tracking application built with React Native (Expo 54) and AWS CDK.

## Project Structure

```
ashumi/
├── frontend/          # React Native + Expo 54 app
└── backend/           # AWS CDK infrastructure
```

## Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm start
```

**New in Expo 54**: Enhanced performance, React Native 0.76, and improved development experience.

### Backend Deployment
```bash
cd backend
npm install
npm run build
npx cdk bootstrap  # First time only
npx cdk deploy --all
```

## Expo 54 Upgrade

This project has been upgraded to Expo 54 with the following improvements:
- React Native 0.76.3
- React Navigation v7
- Enhanced TypeScript support
- Better Metro bundler configuration
- Improved gesture handling

To upgrade an existing installation:
```bash
./upgrade-expo.sh
```

## Service Layer Architecture

The frontend uses a service layer pattern that allows switching between mock and AWS implementations:

- **Mock Mode**: Services return hardcoded data for development
- **AWS Mode**: Services connect to deployed AWS infrastructure

To switch modes:
1. Deploy the backend infrastructure
2. Copy the API URL and Cognito details from CDK outputs
3. Create `frontend/.env` from `frontend/.env.example`
4. Update `USE_AWS_SERVICES` to `true` in `frontend/services/index.ts`
5. Uncomment AWS service imports in the same file

## Deployment Guide

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed: `npm install -g aws-cdk`

### Backend Deployment
```bash
cd backend
npm install
npm run build

# Bootstrap CDK (first time only)
npx cdk bootstrap

# Deploy to dev environment
npx cdk deploy --all

# Deploy to production
npx cdk deploy --all --context environment=prod
```

### Frontend Setup
```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with values from CDK outputs
# Then update services/index.ts to use AWS services

npm start
```

## Architecture Overview

### Backend (AWS CDK)
- **Authentication**: Cognito User Pool with JWT authorization
- **API**: REST API Gateway with Lambda functions
- **Database**: Single DynamoDB table with composite keys
- **AI**: Bedrock integration for educational chat responses
- **Security**: Least-privilege IAM policies, CORS enabled

### Frontend (React Native + Expo)
- **Navigation**: React Navigation with stack and tab navigators
- **State**: Context API for authentication, local state for UI
- **Services**: Abstracted service layer for easy AWS/mock switching
- **UI**: Consistent theme system with reusable components

### Data Model (DynamoDB Single Table)
```
PK: USER#<userId>  SK: PROFILE           # User profile
PK: USER#<userId>  SK: MEMBER#<memberId> # Family members
PK: USER#<userId>  SK: PLAN#<planId>     # Contribution plans
```

## Environment Configuration

The backend supports multiple environments (dev/prod) through CDK stages:

```bash
# Development (default)
npx cdk deploy --all

# Production
npx cdk deploy --all --context environment=prod
```