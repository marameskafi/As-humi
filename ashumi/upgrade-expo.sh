#!/bin/bash

echo "🚀 Upgrading Ashumi to Expo 54..."

cd frontend

# Clean existing installation
echo "🧹 Cleaning existing installation..."
rm -rf node_modules package-lock.json .expo

# Install new dependencies
echo "📦 Installing Expo 54 dependencies..."
npm install

# Install additional required packages
echo "📦 Installing additional packages..."
npx expo install react-native-gesture-handler@~2.14.0

# Verify installation
echo "✅ Verifying installation..."
npx expo doctor

echo ""
echo "🎉 Expo 54 upgrade complete!"
echo ""
echo "To start the app:"
echo "  npm start"
echo ""
echo "Note: You may need to clear Metro cache if you encounter issues:"
echo "  npm start -- --clear"