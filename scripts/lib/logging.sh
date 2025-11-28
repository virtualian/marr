#!/bin/bash
# Shared logging utilities for MARR scripts
# Source this file in your scripts: source "$(dirname "$0")/lib/logging.sh"
#
# Usage:
#   --verbose, -v   Enable verbose output (debug messages)
#   --quiet, -q     Suppress non-essential output (silent mode)
#   --silent        Same as --quiet
#
# Functions:
#   log_debug "message"   - Only shown in verbose mode
#   log_info "message"    - Standard output, hidden in quiet mode
#   log_success "message" - Success messages with ✅, hidden in quiet mode
#   log_warn "message"    - Warnings with ⚠️, always shown
#   log_error "message"   - Errors with ❌, always shown
#   log_step "message"    - Step indicators with emoji, hidden in quiet mode
#   run_cmd "command"     - Run command, show output based on verbosity
#   parse_logging_args    - Parse -v/-q/--verbose/--quiet from args

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Logging levels (can be overridden before sourcing)
VERBOSE=${VERBOSE:-0}
QUIET=${QUIET:-0}

# Parse logging arguments from command line
# Call this function passing "$@" to extract -v/-q flags
# Returns remaining arguments via REMAINING_ARGS array
parse_logging_args() {
    REMAINING_ARGS=()
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--verbose)
                VERBOSE=1
                shift
                ;;
            -q|--quiet|--silent)
                QUIET=1
                shift
                ;;
            *)
                REMAINING_ARGS+=("$1")
                shift
                ;;
        esac
    done
}

# Debug messages - only shown in verbose mode
log_debug() {
    if [[ $VERBOSE -eq 1 ]]; then
        echo -e "${GRAY}[DEBUG] $*${NC}" >&2
    fi
}

# Info messages - hidden in quiet mode
log_info() {
    if [[ $QUIET -eq 0 ]]; then
        echo -e "$*"
    fi
}

# Success messages with checkmark - hidden in quiet mode
log_success() {
    if [[ $QUIET -eq 0 ]]; then
        echo -e "${GREEN}✅ $*${NC}"
    fi
}

# Warning messages - always shown
log_warn() {
    echo -e "${YELLOW}⚠️  $*${NC}" >&2
}

# Error messages - always shown
log_error() {
    echo -e "${RED}❌ $*${NC}" >&2
}

# Step indicators with emoji - hidden in quiet mode
log_step() {
    local emoji="${1}"
    shift
    if [[ $QUIET -eq 0 ]]; then
        echo -e "${emoji} $*"
    fi
}

# Run a command with appropriate output handling
# In quiet mode: suppress stdout, show stderr only on error
# In verbose mode: show everything
# Normal mode: show stdout and stderr
run_cmd() {
    local cmd="$*"
    log_debug "Running: $cmd"

    if [[ $QUIET -eq 1 ]]; then
        # In quiet mode, capture output and only show on error
        local output
        local exit_code
        output=$("$@" 2>&1)
        exit_code=$?
        if [[ $exit_code -ne 0 ]]; then
            log_error "Command failed: $cmd"
            echo "$output" >&2
        fi
        return $exit_code
    elif [[ $VERBOSE -eq 1 ]]; then
        # In verbose mode, show command being run
        echo -e "${GRAY}$ $cmd${NC}"
        "$@"
    else
        # Normal mode
        "$@"
    fi
}

# Print a separator line - hidden in quiet mode
log_separator() {
    if [[ $QUIET -eq 0 ]]; then
        echo "============================================"
    fi
}

# Print blank line - hidden in quiet mode
log_blank() {
    if [[ $QUIET -eq 0 ]]; then
        echo ""
    fi
}

# Show usage hint for logging options
show_logging_help() {
    echo "Logging options:"
    echo "  -v, --verbose    Show detailed debug output"
    echo "  -q, --quiet      Suppress non-essential output (silent mode)"
    echo "      --silent     Same as --quiet"
}
