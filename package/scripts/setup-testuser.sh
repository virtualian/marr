#!/bin/bash
# Setup script for testuser account
# Run this as testuser: bash /path/to/package/scripts/setup-testuser.sh

set -e

# Find script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔧 Setting up testuser environment for MARR testing..."

# Install nvm if not already installed
if [ ! -d "$HOME/.nvm" ]; then
  echo "📦 Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

  # Load nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
  echo "✅ nvm already installed"
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node.js 18 (LTS)
echo "📦 Installing Node.js 18..."
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
echo ""
echo "✅ Setup complete!"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""
echo "To use Node.js in new terminal sessions, add this to ~/.zshrc or ~/.bash_profile:"
echo '  export NVM_DIR="$HOME/.nvm"'
echo '  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
echo ""
echo "Now you can run the test suite:"
echo "  bash $SCRIPT_DIR/test-in-testuser.sh"
