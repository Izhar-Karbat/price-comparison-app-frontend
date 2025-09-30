#!/bin/bash

# PharmMate Development Startup Script
# This script ensures proper Node version and starts Expo reliably

set -e

echo "🔧 PharmMate Development Setup"
echo "=============================="

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ NVM not found. Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

echo "📱 Switching to Node version from .nvmrc..."
nvm use

echo "🧹 Cleaning up any existing processes..."
pkill -f "expo\|metro" 2>/dev/null || true

echo "🔍 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting Expo development server..."
echo "   📍 Port: 9000"
echo "   🧽 Cache: Cleared"
echo "   ⌨️  Press Ctrl+C to stop"
echo ""

npm run dev