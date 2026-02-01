#!/bin/bash

echo "🚀 Setting up Ashumi MVP with Expo 54..."

# Frontend setup
echo "📱 Setting up frontend..."
cd frontend
npm install

# Install Expo 54 specific packages
echo "📦 Installing Expo 54 packages..."
npx expo install react-native-gesture-handler@~2.14.0

echo "✅ Frontend dependencies installed"

# Backend setup
echo "☁️ Setting up backend..."
cd ../backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "1. Frontend (mock mode): cd frontend && npm start"
echo "2. Backend deployment: cd backend && npm run deploy"
echo ""
echo "📚 Expo 54 Features:"
echo "- React Native 0.76.3"
echo "- Enhanced performance"
echo "- Better TypeScript support"
echo ""
echo "For more details, see README.md"