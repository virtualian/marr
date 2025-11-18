#!/bin/bash
# List all sub-issues of a parent GitHub issue
# Usage: ./scripts/gh-list-subissues.sh <parent-issue-number>

set -e

# Color output for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -ne 1 ]; then
    echo -e "${RED}Error: Requires exactly 1 argument${NC}"
    echo "Usage: $0 <parent-issue-number>"
    echo ""
    echo "Example: $0 25"
    echo "  This lists all sub-issues of issue #25"
    exit 1
fi

PARENT_NUM=$1

echo -e "${YELLOW}Fetching sub-issues for issue #${PARENT_NUM}...${NC}"
echo ""

# Get parent issue ID
PARENT_ID=$(gh issue view "${PARENT_NUM}" --json id --jq '.id')
if [ -z "$PARENT_ID" ]; then
    echo -e "${RED}Error: Could not find issue #${PARENT_NUM}${NC}"
    exit 1
fi

# Query for sub-issues using GraphQL API
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

# Parse and display results
PARENT_TITLE=$(echo "$RESULT" | jq -r '.data.node.title')
PARENT_STATE=$(echo "$RESULT" | jq -r '.data.node.state')
TOTAL_COUNT=$(echo "$RESULT" | jq -r '.data.node.subIssues.totalCount')

echo -e "${GREEN}Parent Issue:${NC} #${PARENT_NUM} - ${PARENT_TITLE} [${PARENT_STATE}]"
echo ""

if [ "$TOTAL_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}No sub-issues found.${NC}"
    exit 0
fi

echo -e "${BLUE}Sub-issues (${TOTAL_COUNT}):${NC}"
echo ""

# Display each sub-issue
echo "$RESULT" | jq -r '.data.node.subIssues.nodes[] | "  #\(.number) - \(.title) [\(.state)]"'

echo ""
echo -e "${GREEN}✓ Found ${TOTAL_COUNT} sub-issue(s)${NC}"
