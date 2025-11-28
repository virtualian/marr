#!/bin/bash
# Setup script for testuser account
# Run this as testuser: bash /path/to/package/scripts/setup-testuser.sh
#
# Usage: setup-testuser.sh [-v|--verbose] [-q|--quiet]
#
# Options:
#   -v, --verbose   Show detailed installation output
#   -q, --quiet     Suppress non-essential output (silent mode)

set -e

# Find script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load logging utilities
source "$SCRIPT_DIR/lib/logging.sh"

# Parse command line arguments
parse_logging_args "$@"

log_step "🔧" "Setting up testuser environment for MARR testing..."
log_debug "Script directory: $SCRIPT_DIR"
log_debug "Package directory: $PACKAGE_DIR"

# Install nvm if not already installed
if [ ! -d "$HOME/.nvm" ]; then
    log_step "📦" "Installing nvm..."
    log_debug "Downloading nvm installer..."
    if [[ $QUIET -eq 1 ]]; then
        curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash > /dev/null 2>&1
    else
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi

    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    log_success "nvm already installed"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node.js 18 (LTS)
log_step "📦" "Installing Node.js 18..."
log_debug "Running nvm install 18..."
if [[ $QUIET -eq 1 ]]; then
    nvm install 18 > /dev/null 2>&1
    nvm use 18 > /dev/null 2>&1
    nvm alias default 18 > /dev/null 2>&1
else
    nvm install 18
    nvm use 18
    nvm alias default 18
fi

# Verify installation
log_blank
log_success "Setup complete!"
log_info "Node version: $(node --version)"
log_info "npm version: $(npm --version)"
log_blank
log_info "To use Node.js in new terminal sessions, add this to ~/.zshrc or ~/.bash_profile:"
log_info '  export NVM_DIR="$HOME/.nvm"'
log_info '  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
log_blank
log_info "Now you can run the test suite:"
log_info "  bash $SCRIPT_DIR/test-in-testuser.sh"
