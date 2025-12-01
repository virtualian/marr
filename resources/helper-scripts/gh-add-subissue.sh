#!/bin/bash
# Add a GitHub sub-issue to a parent issue
#
# Usage: gh-add-subissue.sh [-v|--verbose] [-q|--quiet] <parent-issue-number> <sub-issue-number>
#
# Options:
#   -v, --verbose   Show detailed API output
#   -q, --quiet     Only show result or errors (silent mode)

set -e

# Color output for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Logging levels
VERBOSE=0
QUIET=0

# Parse logging arguments
ARGS=()
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
        -h|--help)
            echo "Add a GitHub sub-issue to a parent issue"
            echo ""
            echo "Usage: $0 [-v|--verbose] [-q|--quiet] <parent-issue-number> <sub-issue-number>"
            echo ""
            echo "Options:"
            echo "  -v, --verbose   Show detailed API output"
            echo "  -q, --quiet     Only show result or errors (silent mode)"
            echo "  -h, --help      Show this help message"
            echo ""
            echo "Example: $0 25 26"
            echo "  This adds issue #26 as a sub-issue of issue #25"
            exit 0
            ;;
        *)
            ARGS+=("$1")
            shift
            ;;
    esac
done

# Logging functions
log_debug() {
    if [[ $VERBOSE -eq 1 ]]; then
        echo -e "${GRAY}[DEBUG] $*${NC}" >&2
    fi
}

log_info() {
    if [[ $QUIET -eq 0 ]]; then
        echo -e "$*"
    fi
}

log_success() {
    if [[ $QUIET -eq 0 ]]; then
        echo -e "${GREEN}✓ $*${NC}"
    fi
}

log_error() {
    echo -e "${RED}Error: $*${NC}" >&2
}

# Check arguments
if [ ${#ARGS[@]} -ne 2 ]; then
    log_error "Requires exactly 2 arguments"
    echo "Usage: $0 [-v|--verbose] [-q|--quiet] <parent-issue-number> <sub-issue-number>"
    echo ""
    echo "Example: $0 25 26"
    echo "  This adds issue #26 as a sub-issue of issue #25"
    exit 1
fi

PARENT_NUM="${ARGS[0]}"
SUB_NUM="${ARGS[1]}"

log_info "${YELLOW}Adding issue #${SUB_NUM} as sub-issue of #${PARENT_NUM}...${NC}"

# Get parent issue ID
log_info "Fetching parent issue #${PARENT_NUM}..."
log_debug "Running: gh issue view ${PARENT_NUM} --json id --jq '.id'"
PARENT_ID=$(gh issue view "${PARENT_NUM}" --json id --jq '.id')
if [ -z "$PARENT_ID" ]; then
    log_error "Could not find parent issue #${PARENT_NUM}"
    exit 1
fi
log_debug "Parent ID: $PARENT_ID"
log_success "Found parent issue #${PARENT_NUM}"

# Get sub-issue ID
log_info "Fetching sub-issue #${SUB_NUM}..."
log_debug "Running: gh issue view ${SUB_NUM} --json id --jq '.id'"
SUB_ID=$(gh issue view "${SUB_NUM}" --json id --jq '.id')
if [ -z "$SUB_ID" ]; then
    log_error "Could not find sub-issue #${SUB_NUM}"
    exit 1
fi
log_debug "Sub-issue ID: $SUB_ID"
log_success "Found sub-issue #${SUB_NUM}"

# Add sub-issue relationship using GraphQL API
log_info "Creating sub-issue relationship..."
log_debug "Calling GraphQL API with addSubIssue mutation..."
RESULT=$(gh api graphql \
    -H "GraphQL-Features: sub_issues" \
    -f query="mutation {
        addSubIssue(input: {
            issueId: \"${PARENT_ID}\",
            subIssueId: \"${SUB_ID}\"
        }) {
            issue {
                number
                title
            }
            subIssue {
                number
                title
            }
        }
    }")

log_debug "API Response: $RESULT"

# Check if successful
if echo "$RESULT" | grep -q "\"number\""; then
    PARENT_TITLE=$(echo "$RESULT" | jq -r '.data.addSubIssue.issue.title')
    SUB_TITLE=$(echo "$RESULT" | jq -r '.data.addSubIssue.subIssue.title')

    if [[ $QUIET -eq 0 ]]; then
        echo ""
        log_success "Successfully linked sub-issue!"
        echo ""
        echo -e "Parent: #${PARENT_NUM} - ${PARENT_TITLE}"
        echo -e "Sub-issue: #${SUB_NUM} - ${SUB_TITLE}"
    fi
else
    log_error "Failed to create sub-issue relationship"
    echo "$RESULT" >&2
    exit 1
fi
