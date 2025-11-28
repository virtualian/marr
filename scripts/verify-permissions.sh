#!/bin/bash
# Verify that testuser can access MARR testing files
#
# Usage: verify-permissions.sh [-v|--verbose] [-q|--quiet]
#
# Options:
#   -v, --verbose   Show detailed permission information
#   -q, --quiet     Only show errors (silent mode)

# Load logging utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/logging.sh"

# Parse command line arguments
parse_logging_args "$@"

log_step "🔍" "Verifying permissions for testuser access..."
log_blank

# Check directories
log_info "Directory Permissions:"
if [[ $VERBOSE -eq 1 ]]; then
    stat -f "%Sp %N" \
        /Users/ianmarr \
        /Users/ianmarr/projects \
        /Users/ianmarr/projects/marr \
        /Users/ianmarr/projects/marr/package \
        /Users/ianmarr/projects/marr/package/scripts
elif [[ $QUIET -eq 0 ]]; then
    stat -f "%Sp %N" \
        /Users/ianmarr \
        /Users/ianmarr/projects \
        /Users/ianmarr/projects/marr \
        /Users/ianmarr/projects/marr/package \
        /Users/ianmarr/projects/marr/package/scripts
fi

log_blank
log_info "File Permissions:"
if [[ $QUIET -eq 0 ]]; then
    ls -l /Users/ianmarr/projects/marr/package/virtualian-marr-1.0.0.tgz 2>/dev/null || log_warn "Tarball not found"
    log_blank
    ls -l /Users/ianmarr/projects/marr/package/scripts/*.sh
fi

log_blank

# Verbose mode shows detailed analysis
if [[ $VERBOSE -eq 1 ]]; then
    log_debug "Checking read permissions for 'others' on each path..."

    PATHS=(
        "/Users/ianmarr"
        "/Users/ianmarr/projects"
        "/Users/ianmarr/projects/marr"
        "/Users/ianmarr/projects/marr/package"
        "/Users/ianmarr/projects/marr/package/scripts"
    )

    for path in "${PATHS[@]}"; do
        perms=$(stat -f "%Sp" "$path")
        other_perms="${perms: -3}"
        if [[ "$other_perms" == *"r"* ]]; then
            log_debug "  $path: $perms (readable by others)"
        else
            log_warn "  $path: $perms (NOT readable by others)"
        fi
    done
fi

log_success "All paths should show r-x (read+execute) for 'others' (last 3 chars)"
log_success "Scripts should show -rwxr-xr-x"
log_success "Tarball should show -rw-r--r--"
