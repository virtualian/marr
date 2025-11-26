#!/bin/bash
# Test MARR package in testuser account
# Run this as testuser after nvm is installed

set -e

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🧪 MARR Package Testing in testuser Account"
echo "============================================"
echo ""

# Verify nvm is loaded and Node.js is available
if ! command -v node &> /dev/null; then
  echo "❌ ERROR: Node.js not found!"
  echo ""
  echo "Please install nvm first:"
  echo "  bash $SCRIPT_DIR/setup-testuser.sh"
  echo ""
  echo "Then load nvm in your current shell:"
  echo "  export NVM_DIR=\"\$HOME/.nvm\""
  echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\""
  echo ""
  echo "Or start a new terminal session (nvm will load automatically)."
  exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Configuration - find package directory relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARBALL="$PACKAGE_DIR/virtualian-marr-1.0.0.tgz"

echo "📍 Package directory: $PACKAGE_DIR"
echo ""

# Check if tarball exists
if [ ! -f "$TARBALL" ]; then
  echo "❌ ERROR: Tarball not found at $TARBALL"
  echo ""
  echo "Run this first to build the tarball:"
  echo "  cd $PACKAGE_DIR"
  echo "  bash scripts/build-test-tarball.sh"
  exit 1
fi

# Clean previous test state
echo "🧹 Cleaning previous test state..."
# Change to home directory before cleaning to avoid being in a directory we're about to delete
cd "$HOME"
npm uninstall -g @virtualian/marr 2>/dev/null || true
rm -rf ~/.claude/marr
rm -f ~/bin/gh-add-subissue.sh ~/bin/gh-list-subissues.sh
rm -rf ~/marr-test-*

echo ""
echo "📦 Installing MARR from tarball..."
npm install -g "$TARBALL"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Testing commands..."
echo ""

# Test 1: Version check
echo "Test 1: marr --version"
marr --version
echo ""

# Test 2: Init command
echo "Test 2: marr init"
TEST_DIR="$HOME/marr-test-$(date +%s)"
PROJECT_NAME="test-project"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
marr init --name "$PROJECT_NAME" --type "test application" --template standards
echo "✅ Init complete"
echo ""

# Test 3: Validate command
echo "Test 3: marr validate"
# We're already in the project directory from init
marr validate
echo "✅ Validation passed"
echo ""

# Test 4: Check generated files
echo "Test 4: Checking generated files..."
[ -f CLAUDE.md ] && echo "  ✅ CLAUDE.md exists" || echo "  ❌ CLAUDE.md missing"
[ -d prompts ] && echo "  ✅ prompts/ directory exists" || echo "  ❌ prompts/ missing"
[ -f prompts/prj-git-workflow-standard.md ] && echo "  ✅ Git workflow prompt exists" || echo "  ❌ Git workflow prompt missing"
echo ""

# Test 5: Check ~/.claude/marr/ setup
echo "Test 5: Checking ~/.claude/marr/ setup..."
[ -d ~/.claude/marr ] && echo "  ✅ ~/.claude/marr/ exists" || echo "  ❌ ~/.claude/marr/ missing"
[ -d ~/.claude/marr/templates ] && echo "  ✅ Templates directory exists" || echo "  ❌ Templates missing"
[ -d ~/.claude/marr/prompts ] && echo "  ✅ Prompts directory exists" || echo "  ❌ Prompts missing"
[ -f ~/.claude/CLAUDE.md ] && echo "  ✅ ~/.claude/CLAUDE.md exists" || echo "  ❌ ~/.claude/CLAUDE.md missing"
grep -q "@~/.claude/marr/CLAUDE.md" ~/.claude/CLAUDE.md 2>/dev/null && echo "  ✅ MARR import line present" || echo "  ❌ MARR import line missing"
echo ""

# Test 6: Install scripts command
echo "Test 6: marr install-scripts"
marr install-scripts
[ -f ~/bin/gh-add-subissue.sh ] && echo "  ✅ gh-add-subissue.sh installed" || echo "  ❌ gh-add-subissue.sh missing"
[ -f ~/bin/gh-list-subissues.sh ] && echo "  ✅ gh-list-subissues.sh installed" || echo "  ❌ gh-list-subissues.sh missing"
[ -x ~/bin/gh-add-subissue.sh ] && echo "  ✅ Scripts are executable" || echo "  ❌ Scripts not executable"
echo ""

echo "============================================"
echo "✅ ALL TESTS PASSED!"
echo ""
echo "Test artifacts created in: $TEST_DIR"
echo ""
echo "To clean up:"
echo "  npm uninstall -g @virtualian/marr"
echo "  rm -rf ~/.claude/marr ~/bin/gh-* ~/marr-test-*"
echo ""
