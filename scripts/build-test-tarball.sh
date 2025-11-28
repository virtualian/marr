#!/bin/bash
# Build a test tarball for testing in testuser account
#
# Usage: build-test-tarball.sh [-v|--verbose] [-q|--quiet]
#
# Options:
#   -v, --verbose   Show detailed build output
#   -q, --quiet     Suppress non-essential output (silent mode)

set -e

# Load logging utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/logging.sh"

# Parse command line arguments
parse_logging_args "$@"

cd "$SCRIPT_DIR/.."

log_step "🔨" "Building test tarball..."
log_debug "Working directory: $(pwd)"

# Build and pack
log_debug "Running npm build..."
if [[ $VERBOSE -eq 1 ]]; then
    npm run build
elif [[ $QUIET -eq 1 ]]; then
    npm run build > /dev/null 2>&1
else
    npm run build
fi

log_debug "Running npm pack..."
if [[ $VERBOSE -eq 1 ]]; then
    npm pack
elif [[ $QUIET -eq 1 ]]; then
    npm pack > /dev/null 2>&1
else
    npm pack
fi

log_blank
log_success "Test tarball created: $(pwd)/virtualian-marr-1.0.0.tgz"
log_blank
log_info "To test in testuser account:"
log_info "  sudo su - testuser"
log_info "  bash /Users/ianmarr/projects/marr/package/scripts/test-in-testuser.sh"
