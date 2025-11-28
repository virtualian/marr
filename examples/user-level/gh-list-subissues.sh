#!/bin/bash
# List all sub-issues of a parent GitHub issue
#
# Usage: gh-list-subissues.sh [-v|--verbose] [-q|--quiet] <parent-issue-number>
#
# Options:
#   -v, --verbose   Show detailed API output
#   -q, --quiet     Only list sub-issue numbers (silent mode)

set -e

# Color output for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
            echo "List all sub-issues of a parent GitHub issue"
            echo ""
            echo "Usage: $0 [-v|--verbose] [-q|--quiet] <parent-issue-number>"
            echo ""
            echo "Options:"
            echo "  -v, --verbose   Show detailed API output"
            echo "  -q, --quiet     Only list sub-issue numbers (silent mode)"
            echo "  -h, --help      Show this help message"
            echo ""
            echo "Example: $0 25"
            echo "  This lists all sub-issues of issue #25"
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
if [ ${#ARGS[@]} -ne 1 ]; then
    log_error "Requires exactly 1 argument"
    echo "Usage: $0 [-v|--verbose] [-q|--quiet] <parent-issue-number>"
    echo ""
    echo "Example: $0 25"
    echo "  This lists all sub-issues of issue #25"
    exit 1
fi

PARENT_NUM="${ARGS[0]}"

log_info "${YELLOW}Fetching sub-issues for issue #${PARENT_NUM}...${NC}"
log_info ""

# Get parent issue ID
log_debug "Running: gh issue view ${PARENT_NUM} --json id --jq '.id'"
PARENT_ID=$(gh issue view "${PARENT_NUM}" --json id --jq '.id')
if [ -z "$PARENT_ID" ]; then
    log_error "Could not find issue #${PARENT_NUM}"
    exit 1
fi
log_debug "Parent ID: $PARENT_ID"

# Query for sub-issues using GraphQL API
log_debug "Querying GraphQL API for sub-issues..."
RESULT=$(gh api graphql \
    -H "GraphQL-Features: sub_issues" \
    -f query="query {
        node(id: \"${PARENT_ID}\") {
            ... on Issue {
                number
                title
                state
                subIssues(first: 100) {
                    totalCount
                    nodes {
                        number
                        title
                        state
                        url
                    }
                }
            }
        }
    }")

log_debug "API Response: $RESULT"

# Parse and display results
PARENT_TITLE=$(echo "$RESULT" | jq -r '.data.node.title')
PARENT_STATE=$(echo "$RESULT" | jq -r '.data.node.state')
TOTAL_COUNT=$(echo "$RESULT" | jq -r '.data.node.subIssues.totalCount')

if [[ $QUIET -eq 1 ]]; then
    # In quiet mode, just output the sub-issue numbers
    if [ "$TOTAL_COUNT" -gt 0 ]; then
        echo "$RESULT" | jq -r '.data.node.subIssues.nodes[].number'
    fi
    exit 0
fi

log_info "${GREEN}Parent Issue:${NC} #${PARENT_NUM} - ${PARENT_TITLE} [${PARENT_STATE}]"
log_info ""

if [ "$TOTAL_COUNT" -eq 0 ]; then
    log_info "${YELLOW}No sub-issues found.${NC}"
    exit 0
fi

log_info "${BLUE}Sub-issues (${TOTAL_COUNT}):${NC}"
log_info ""

# Display each sub-issue
if [[ $VERBOSE -eq 1 ]]; then
    # Verbose mode shows URLs too
    echo "$RESULT" | jq -r '.data.node.subIssues.nodes[] | "  #\(.number) - \(.title) [\(.state)]\n    URL: \(.url)"'
else
    echo "$RESULT" | jq -r '.data.node.subIssues.nodes[] | "  #\(.number) - \(.title) [\(.state)]"'
fi

log_info ""
log_success "Found ${TOTAL_COUNT} sub-issue(s)"
