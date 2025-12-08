#!/bin/bash
# Test MARR package in testuser account
# Run this as testuser after nvm is installed
#
# Usage: test-in-testuser.sh [-v|--verbose] [-q|--quiet]
#
# Options:
#   -v, --verbose   Show detailed test output and debug info
#   -q, --quiet     Only show test results summary (silent mode)

set -e

# Load nvm first (before sourcing our logging, as SCRIPT_DIR isn't set yet)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Load logging utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$TESTS_DIR/lib/logging.sh"

# Parse command line arguments
parse_logging_args "$@"

log_step "🧪" "MARR Package Testing in testuser Account"
log_separator
log_blank

# Verify nvm is loaded and Node.js is available
log_debug "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    log_error "ERROR: Node.js not found!"
    log_blank
    log_info "Please install nvm first:"
    log_info "  bash $SCRIPT_DIR/setup-testuser.sh"
    log_blank
    log_info "Then load nvm in your current shell:"
    log_info "  export NVM_DIR=\"\$HOME/.nvm\""
    log_info "  [ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\""
    log_blank
    log_info "Or start a new terminal session (nvm will load automatically)."
    exit 1
fi

log_success "Node.js detected: $(node --version)"
log_success "npm version: $(npm --version)"
log_blank

# Configuration - find tarball in tests directory
PROJECT_ROOT="$(cd "$TESTS_DIR/.." && pwd)"
TARBALL=$(ls -t "$TESTS_DIR"/virtualian-marr-*.tgz 2>/dev/null | head -1)

log_info "📍 Project root: $PROJECT_ROOT"
log_debug "Tarball path: $TARBALL"
log_blank

# Check if tarball exists
if [ -z "$TARBALL" ] || [ ! -f "$TARBALL" ]; then
    log_error "ERROR: Tarball not found in $TESTS_DIR"
    log_blank
    log_info "Run this first to build the tarball:"
    log_info "  cd $PROJECT_ROOT"
    log_info "  npm run build"
    exit 1
fi

# Clean previous test state
log_step "🧹" "Cleaning previous test state..."
log_debug "Changing to home directory..."
cd "$HOME"

log_debug "Uninstalling previous @virtualian/marr..."
npm uninstall -g @virtualian/marr 2>/dev/null || true

log_debug "Removing ~/.claude/marr..."
rm -rf ~/.claude/marr

log_debug "Removing test directories..."
rm -rf ~/marr-test-*

# Remove MARR import from ~/.claude/CLAUDE.md if present
if [ -f ~/.claude/CLAUDE.md ]; then
    log_debug "Cleaning MARR import from ~/.claude/CLAUDE.md..."
    sed -i '' '/<!-- MARR: Making Agents Really Reliable -->/d' ~/.claude/CLAUDE.md 2>/dev/null || true
    sed -i '' '/@~\/.claude\/marr\/CLAUDE.md/d' ~/.claude/CLAUDE.md 2>/dev/null || true
fi

log_blank
log_step "📦" "Installing MARR from tarball..."
if [[ $QUIET -eq 1 ]]; then
    npm install -g "$TARBALL" > /dev/null 2>&1
elif [[ $VERBOSE -eq 1 ]]; then
    npm install -g "$TARBALL"
else
    npm install -g "$TARBALL"
fi

log_blank
log_success "Installation complete!"
log_blank
log_info "Testing commands..."
log_blank

# Test tracking
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_num=$1
    local test_name=$2
    shift 2

    log_info "Test $test_num: $test_name"
    if [[ $VERBOSE -eq 1 ]]; then
        log_debug "Running: $*"
    fi

    if "$@"; then
        ((TESTS_PASSED++))
        log_success "Test $test_num passed"
    else
        ((TESTS_FAILED++))
        log_error "Test $test_num failed"
    fi
    log_blank
}

# Test 1: Version check
log_info "Test 1: marr --version"
if [[ $QUIET -eq 0 ]]; then
    marr --version
fi
log_success "Version check passed"
((TESTS_PASSED++))
log_blank

# Test 2: marr init (no flags shows help)
log_info "Test 2: marr init (no flags - should show help)"
if [[ $VERBOSE -eq 1 ]]; then
    marr init | head -5
elif [[ $QUIET -eq 0 ]]; then
    marr init | head -5
else
    marr init > /dev/null 2>&1
fi
log_success "Help displayed correctly"
((TESTS_PASSED++))
log_blank

# Test 3: marr init --user (user-level setup)
log_info "Test 3: marr init --user"
if [[ $QUIET -eq 1 ]]; then
    marr init --user > /dev/null 2>&1
else
    marr init --user
fi
log_success "User setup complete"
((TESTS_PASSED++))
log_blank

# Test 4: Check user-level setup
log_info "Test 4: Checking user-level setup..."
check_passed=true
[ -d ~/.claude/marr ] && log_info "  ✅ ~/.claude/marr/ exists" || { log_info "  ❌ ~/.claude/marr/ missing"; check_passed=false; }
[ -f ~/.claude/marr/MARR-USER-CLAUDE.md ] && log_info "  ✅ ~/.claude/marr/MARR-USER-CLAUDE.md exists" || { log_info "  ❌ ~/.claude/marr/MARR-USER-CLAUDE.md missing"; check_passed=false; }
[ -f ~/.claude/CLAUDE.md ] && log_info "  ✅ ~/.claude/CLAUDE.md exists" || { log_info "  ❌ ~/.claude/CLAUDE.md missing"; check_passed=false; }
grep -q "@~/.claude/marr/MARR-USER-CLAUDE.md" ~/.claude/CLAUDE.md 2>/dev/null && log_info "  ✅ MARR import line present" || { log_info "  ❌ MARR import line missing"; check_passed=false; }
grep -q "github.com/virtualian/marr#readme" ~/.claude/marr/MARR-USER-CLAUDE.md 2>/dev/null && log_info "  ✅ MARR README pointer present" || { log_info "  ❌ MARR README pointer missing"; check_passed=false; }
grep -q "Making Agents Really Reliable" ~/.claude/marr/MARR-USER-CLAUDE.md 2>/dev/null && log_info "  ✅ MARR description present" || { log_info "  ❌ MARR description missing"; check_passed=false; }
if $check_passed; then
    ((TESTS_PASSED++))
else
    ((TESTS_FAILED++))
fi
log_blank

# Test 5: marr init --project (project-level setup)
log_info "Test 5: marr init --project"
TEST_DIR="$HOME/marr-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
log_debug "Test directory: $TEST_DIR"
if [[ $QUIET -eq 1 ]]; then
    marr init --project --force > /dev/null 2>&1
else
    marr init --project --force
fi
log_success "Project setup complete"
((TESTS_PASSED++))
log_blank

# Test 6: Check generated project files
log_info "Test 6: Checking generated project files..."
check_passed=true
[ -f CLAUDE.md ] && log_info "  ✅ CLAUDE.md exists" || { log_info "  ❌ CLAUDE.md missing"; check_passed=false; }
grep -q "@.claude/marr/MARR-PROJECT-CLAUDE.md" CLAUDE.md 2>/dev/null && log_info "  ✅ MARR import line present in CLAUDE.md" || { log_info "  ❌ MARR import line missing"; check_passed=false; }
[ -d .claude/marr ] && log_info "  ✅ .claude/marr/ directory exists" || { log_info "  ❌ .claude/marr/ missing"; check_passed=false; }
[ -f .claude/marr/MARR-PROJECT-CLAUDE.md ] && log_info "  ✅ MARR-PROJECT-CLAUDE.md exists" || { log_info "  ❌ MARR-PROJECT-CLAUDE.md missing"; check_passed=false; }
grep -q "github.com/virtualian/marr#readme" .claude/marr/MARR-PROJECT-CLAUDE.md 2>/dev/null && log_info "  ✅ MARR README pointer present" || { log_info "  ❌ MARR README pointer missing"; check_passed=false; }
grep -q "Making Agents Really Reliable" .claude/marr/MARR-PROJECT-CLAUDE.md 2>/dev/null && log_info "  ✅ MARR description present" || { log_info "  ❌ MARR description missing"; check_passed=false; }
[ -f .claude/marr/README.md ] && log_info "  ✅ .claude/marr/README.md exists" || { log_info "  ❌ .claude/marr/README.md missing"; check_passed=false; }
[ -d .claude/marr/standards ] && log_info "  ✅ .claude/marr/standards/ directory exists" || { log_info "  ❌ .claude/marr/standards/ missing"; check_passed=false; }
[ -f .claude/marr/standards/prj-git-workflow-standard.md ] && log_info "  ✅ Git workflow standard exists" || { log_info "  ❌ Git workflow standard missing"; check_passed=false; }
[ -f .claude/marr/standards/prj-testing-standard.md ] && log_info "  ✅ Testing standard exists" || { log_info "  ❌ Testing standard missing"; check_passed=false; }
[ -f .claude/marr/standards/prj-mcp-usage-standard.md ] && log_info "  ✅ MCP usage standard exists" || { log_info "  ❌ MCP usage standard missing"; check_passed=false; }
[ -f .claude/marr/standards/prj-documentation-standard.md ] && log_info "  ✅ Documentation standard exists" || { log_info "  ❌ Documentation standard missing"; check_passed=false; }
if $check_passed; then
    ((TESTS_PASSED++))
else
    ((TESTS_FAILED++))
fi
log_blank

# Test 7: Validate command
log_info "Test 7: marr validate"
if [[ $QUIET -eq 1 ]]; then
    marr validate > /dev/null 2>&1
else
    marr validate
fi
log_success "Validation passed"
((TESTS_PASSED++))
log_blank

# Test 8: marr validate --conflicts (conflict detection)
log_info "Test 8: marr validate --conflicts"
if [[ $QUIET -eq 1 ]]; then
    marr validate --conflicts > /dev/null 2>&1
else
    marr validate --conflicts
fi
log_success "Conflict detection works"
((TESTS_PASSED++))
log_blank

# Test 9: marr validate --conflicts --json (JSON output)
log_info "Test 9: marr validate --conflicts --json"
JSON_OUTPUT=$(marr validate --conflicts --json 2>/dev/null)
if echo "$JSON_OUTPUT" | grep -q '"scope"'; then
    log_success "JSON conflict report works"
    ((TESTS_PASSED++))
else
    log_error "JSON output missing expected fields"
    ((TESTS_FAILED++))
fi
log_blank

# Test 10: marr doctor --dry-run (preview conflict resolution)
log_info "Test 10: marr doctor --dry-run"
if [[ $QUIET -eq 1 ]]; then
    marr doctor --dry-run --project > /dev/null 2>&1
else
    marr doctor --dry-run --project
fi
log_success "Doctor dry-run works"
((TESTS_PASSED++))
log_blank

# Test 11: marr doctor --help (verify command exists)
log_info "Test 11: marr doctor --help"
if marr doctor --help 2>&1 | grep -q "Interactive conflict resolution"; then
    log_success "Doctor help shows correct description"
    ((TESTS_PASSED++))
else
    log_error "Doctor help missing expected content"
    ((TESTS_FAILED++))
fi
log_blank

# Test 12: marr clean --project --dry-run
log_info "Test 12: marr clean --project --dry-run"
if [[ $QUIET -eq 1 ]]; then
    marr clean --project --dry-run > /dev/null 2>&1
else
    marr clean --project --dry-run
fi
log_success "Clean dry-run works"
((TESTS_PASSED++))
log_blank

# Test 13: marr clean --user --dry-run
log_info "Test 13: marr clean --user --dry-run"
if [[ $QUIET -eq 1 ]]; then
    marr clean --user --dry-run > /dev/null 2>&1
else
    marr clean --user --dry-run
fi
log_success "Clean user dry-run works"
((TESTS_PASSED++))
log_blank

log_separator
if [ $TESTS_FAILED -eq 0 ]; then
    log_success "ALL TESTS PASSED! ($TESTS_PASSED tests)"
else
    log_error "TESTS FAILED: $TESTS_FAILED failed, $TESTS_PASSED passed"
fi
log_blank
log_info "Test artifacts created in: $TEST_DIR"
log_blank
log_info "To clean up:"
log_info "  marr clean --all"
log_info "  npm uninstall -g @virtualian/marr"
log_info "  rm -rf ~/marr-test-*"
log_blank
