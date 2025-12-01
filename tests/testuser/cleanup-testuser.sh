#!/bin/bash
# Clean up MARR installation from testuser account
# This resets testuser to a clean state for testing first-run experience
#
# Usage: cleanup-testuser.sh [-v|--verbose] [-q|--quiet]
#
# Options:
#   -v, --verbose   Show detailed cleanup information
#   -q, --quiet     Only show summary (silent mode)

# Don't exit on errors - we want to clean up as much as possible
set +e

# Load logging utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$TESTS_DIR/lib/logging.sh"

# Parse command line arguments
parse_logging_args "$@"

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

log_step "🧹" "Cleaning MARR from testuser Account"
log_separator
log_blank

# Change to home directory to avoid being in a directory we're about to delete
cd "$HOME"

# Track what was cleaned
CLEANED=()

# Uninstall MARR package
log_debug "Checking for @virtualian/marr npm package..."
if command -v npm &> /dev/null && npm list -g @virtualian/marr &> /dev/null; then
    log_step "📦" "Uninstalling @virtualian/marr..."
    if [[ $QUIET -eq 1 ]]; then
        npm uninstall -g @virtualian/marr > /dev/null 2>&1
    else
        npm uninstall -g @virtualian/marr
    fi
    CLEANED+=("npm package")
else
    log_info "ℹ️  No MARR package installed"
fi

# Remove ~/.claude/marr/ directory
log_debug "Checking for ~/.claude/marr/ directory..."
if [ -d "$HOME/.claude/marr" ]; then
    log_step "🗑️" "Removing ~/.claude/marr/ directory..."
    rm -rf "$HOME/.claude/marr"
    CLEANED+=("~/.claude/marr/ directory")
else
    log_info "ℹ️  No ~/.claude/marr/ directory found"
fi

# Remove MARR import from ~/.claude/CLAUDE.md (if it exists)
log_debug "Checking for MARR import in ~/.claude/CLAUDE.md..."
if [ -f "$HOME/.claude/CLAUDE.md" ]; then
    if grep -q "@~/.claude/marr/MARR-USER-CLAUDE.md" "$HOME/.claude/CLAUDE.md"; then
        log_step "🗑️" "Removing MARR import from ~/.claude/CLAUDE.md..."
        # Remove the MARR import block
        sed -i '' '/<!-- MARR: Making Agents Really Reliable -->/d' "$HOME/.claude/CLAUDE.md"
        sed -i '' '/@~\/.claude\/marr\/MARR-USER-CLAUDE.md/d' "$HOME/.claude/CLAUDE.md"
        CLEANED+=("MARR import from ~/.claude/CLAUDE.md")
    fi
fi

# Remove helper scripts from ~/bin/
log_debug "Checking for helper scripts in ~/bin/..."
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
    log_step "🗑️" "Removed helper scripts: ${REMOVED_SCRIPTS[*]}"
    CLEANED+=("helper scripts")
else
    log_info "ℹ️  No helper scripts found in ~/bin/"
fi

# Remove test project directories
log_debug "Checking for test project directories..."
TEST_DIRS=$(find "$HOME" -maxdepth 1 -type d -name "marr-test-*" 2>/dev/null)
if [ -n "$TEST_DIRS" ]; then
    log_step "🗑️" "Removing test project directories..."
    if [[ $VERBOSE -eq 1 ]]; then
        echo "$TEST_DIRS" | while read -r dir; do
            log_debug "  Removing: $dir"
        done
    fi
    echo "$TEST_DIRS" | xargs rm -rf
    CLEANED+=("test project directories")
else
    log_info "ℹ️  No test project directories found"
fi

log_blank
log_separator

if [ ${#CLEANED[@]} -gt 0 ]; then
    log_success "Cleanup complete! Removed:"
    for item in "${CLEANED[@]}"; do
        log_info "   - $item"
    done
else
    log_success "Nothing to clean - testuser already in clean state"
fi

log_blank
log_info "Testuser is now ready for fresh MARR testing!"
log_blank
log_info "To test again:"
log_info "  bash $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/test-in-testuser.sh"
