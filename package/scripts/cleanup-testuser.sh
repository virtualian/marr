#!/bin/bash
# Clean up MARR installation from testuser account
# This resets testuser to a clean state for testing first-run experience

# Don't exit on errors - we want to clean up as much as possible
set +e

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🧹 Cleaning MARR from testuser Account"
echo "======================================="
echo ""

# Change to home directory to avoid being in a directory we're about to delete
cd "$HOME"

# Track what was cleaned
CLEANED=()

# Uninstall MARR package
if command -v npm &> /dev/null && npm list -g @virtualian/marr &> /dev/null; then
  echo "📦 Uninstalling @virtualian/marr..."
  npm uninstall -g @virtualian/marr
  CLEANED+=("npm package")
else
  echo "ℹ️  No MARR package installed"
fi

# Remove ~/.claude/marr/ directory
if [ -d "$HOME/.claude/marr" ]; then
  echo "🗑️  Removing ~/.claude/marr/ directory..."
  rm -rf "$HOME/.claude/marr"
  CLEANED+=("~/.claude/marr/ directory")
else
  echo "ℹ️  No ~/.claude/marr/ directory found"
fi

# Remove MARR import from ~/.claude/CLAUDE.md (if it exists)
if [ -f "$HOME/.claude/CLAUDE.md" ]; then
  if grep -q "@~/.claude/marr/CLAUDE.md" "$HOME/.claude/CLAUDE.md"; then
    echo "🗑️  Removing MARR import from ~/.claude/CLAUDE.md..."
    # Remove the MARR import block
    sed -i '' '/<!-- MARR: Making Agents Really Reliable -->/d' "$HOME/.claude/CLAUDE.md"
    sed -i '' '/@~\/.claude\/marr\/CLAUDE.md/d' "$HOME/.claude/CLAUDE.md"
    CLEANED+=("MARR import from ~/.claude/CLAUDE.md")
  fi
fi

# Remove helper scripts from ~/bin/
REMOVED_SCRIPTS=()
if [ -f "$HOME/bin/gh-add-subissue.sh" ]; then
  rm -f "$HOME/bin/gh-add-subissue.sh"
  REMOVED_SCRIPTS+=("gh-add-subissue.sh")
fi

if [ -f "$HOME/bin/gh-list-subissues.sh" ]; then
  rm -f "$HOME/bin/gh-list-subissues.sh"
  REMOVED_SCRIPTS+=("gh-list-subissues.sh")
fi

if [ ${#REMOVED_SCRIPTS[@]} -gt 0 ]; then
  echo "🗑️  Removed helper scripts: ${REMOVED_SCRIPTS[*]}"
  CLEANED+=("helper scripts")
else
  echo "ℹ️  No helper scripts found in ~/bin/"
fi

# Remove test project directories
TEST_DIRS=$(find "$HOME" -maxdepth 1 -type d -name "marr-test-*" 2>/dev/null)
if [ -n "$TEST_DIRS" ]; then
  echo "🗑️  Removing test project directories..."
  echo "$TEST_DIRS" | xargs rm -rf
  CLEANED+=("test project directories")
else
  echo "ℹ️  No test project directories found"
fi

echo ""
echo "======================================="

if [ ${#CLEANED[@]} -gt 0 ]; then
  echo "✅ Cleanup complete! Removed:"
  for item in "${CLEANED[@]}"; do
    echo "   - $item"
  done
else
  echo "✅ Nothing to clean - testuser already in clean state"
fi

echo ""
echo "Testuser is now ready for fresh MARR testing!"
echo ""
echo "To test again:"
echo "  bash $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/test-in-testuser.sh"
