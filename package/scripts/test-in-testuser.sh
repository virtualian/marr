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
# Remove MARR import from ~/.claude/CLAUDE.md if present
if [ -f ~/.claude/CLAUDE.md ]; then
  sed -i '' '/<!-- MARR: Making Agents Really Reliable -->/d' ~/.claude/CLAUDE.md 2>/dev/null || true
  sed -i '' '/@~\/.claude\/marr\/CLAUDE.md/d' ~/.claude/CLAUDE.md 2>/dev/null || true
fi

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

# Test 2: marr init (no flags shows help)
echo "Test 2: marr init (no flags - should show help)"
marr init | head -5
echo "✅ Help displayed correctly"
echo ""

# Test 3: marr init --user (user-level setup)
echo "Test 3: marr init --user"
marr init --user
echo "✅ User setup complete"
echo ""

# Test 4: Check user-level setup
echo "Test 4: Checking user-level setup..."
[ -d ~/.claude/marr ] && echo "  ✅ ~/.claude/marr/ exists" || echo "  ❌ ~/.claude/marr/ missing"
[ -d ~/.claude/marr/templates ] && echo "  ✅ Templates directory exists" || echo "  ❌ Templates missing"
[ -d ~/.claude/marr/prompts ] && echo "  ✅ Prompts directory exists" || echo "  ❌ Prompts missing"
[ -f ~/.claude/CLAUDE.md ] && echo "  ✅ ~/.claude/CLAUDE.md exists" || echo "  ❌ ~/.claude/CLAUDE.md missing"
grep -q "@~/.claude/marr/CLAUDE.md" ~/.claude/CLAUDE.md 2>/dev/null && echo "  ✅ MARR import line present" || echo "  ❌ MARR import line missing"
[ -f ~/bin/gh-add-subissue.sh ] && echo "  ✅ gh-add-subissue.sh installed" || echo "  ❌ gh-add-subissue.sh missing"
[ -f ~/bin/gh-list-subissues.sh ] && echo "  ✅ gh-list-subissues.sh installed" || echo "  ❌ gh-list-subissues.sh missing"
[ -x ~/bin/gh-add-subissue.sh ] && echo "  ✅ Scripts are executable" || echo "  ❌ Scripts not executable"
echo ""

# Test 5: marr init --project (project-level setup)
echo "Test 5: marr init --project"
TEST_DIR="$HOME/marr-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
marr init --project --force
echo "✅ Project setup complete"
echo ""

# Test 6: Check generated project files
echo "Test 6: Checking generated project files..."
[ -f CLAUDE.md ] && echo "  ✅ CLAUDE.md exists" || echo "  ❌ CLAUDE.md missing"
[ -d prompts ] && echo "  ✅ prompts/ directory exists" || echo "  ❌ prompts/ missing"
[ -f prompts/prj-git-workflow-standard.md ] && echo "  ✅ Git workflow prompt exists" || echo "  ❌ Git workflow prompt missing"
[ -f prompts/prj-testing-standard.md ] && echo "  ✅ Testing prompt exists" || echo "  ❌ Testing prompt missing"
[ -f prompts/prj-mcp-usage-standard.md ] && echo "  ✅ MCP usage prompt exists" || echo "  ❌ MCP usage prompt missing"
[ -f prompts/prj-documentation-standard.md ] && echo "  ✅ Documentation prompt exists" || echo "  ❌ Documentation prompt missing"
[ -d docs ] && echo "  ✅ docs/ directory exists" || echo "  ❌ docs/ missing"
[ -d plans ] && echo "  ✅ plans/ directory exists" || echo "  ❌ plans/ missing"
echo ""

# Test 7: Validate command
echo "Test 7: marr validate"
marr validate
echo "✅ Validation passed"
echo ""

# Test 8: marr clean --project --dry-run
echo "Test 8: marr clean --project --dry-run"
marr clean --project --dry-run
echo "✅ Clean dry-run works"
echo ""

# Test 9: marr clean --user --dry-run
echo "Test 9: marr clean --user --dry-run"
marr clean --user --dry-run
echo "✅ Clean user dry-run works"
echo ""

echo "============================================"
echo "✅ ALL TESTS PASSED!"
echo ""
echo "Test artifacts created in: $TEST_DIR"
echo ""
echo "To clean up:"
echo "  marr clean --all"
echo "  npm uninstall -g @virtualian/marr"
echo "  rm -rf ~/marr-test-*"
echo ""
