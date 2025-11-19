#!/bin/bash
# Add a GitHub sub-issue to a parent issue
# Usage: ./scripts/gh-add-subissue.sh <parent-issue-number> <sub-issue-number>

set -e

# Color output for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -ne 2 ]; then
    echo -e "${RED}Error: Requires exactly 2 arguments${NC}"
    echo "Usage: $0 <parent-issue-number> <sub-issue-number>"
    echo ""
    echo "Example: $0 25 26"
    echo "  This adds issue #26 as a sub-issue of issue #25"
    exit 1
fi

PARENT_NUM=$1
SUB_NUM=$2

echo -e "${YELLOW}Adding issue #${SUB_NUM} as sub-issue of #${PARENT_NUM}...${NC}"

# Get parent issue ID
echo "Fetching parent issue #${PARENT_NUM}..."
PARENT_ID=$(gh issue view "${PARENT_NUM}" --json id --jq '.id')
if [ -z "$PARENT_ID" ]; then
    echo -e "${RED}Error: Could not find parent issue #${PARENT_NUM}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found parent issue #${PARENT_NUM}${NC}"

# Get sub-issue ID
echo "Fetching sub-issue #${SUB_NUM}..."
SUB_ID=$(gh issue view "${SUB_NUM}" --json id --jq '.id')
if [ -z "$SUB_ID" ]; then
    echo -e "${RED}Error: Could not find sub-issue #${SUB_NUM}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found sub-issue #${SUB_NUM}${NC}"

# Add sub-issue relationship using GraphQL API
echo "Creating sub-issue relationship..."
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

# Check if successful
if echo "$RESULT" | grep -q "\"number\""; then
    PARENT_TITLE=$(echo "$RESULT" | jq -r '.data.addSubIssue.issue.title')
    SUB_TITLE=$(echo "$RESULT" | jq -r '.data.addSubIssue.subIssue.title')

    echo ""
    echo -e "${GREEN}✓ Successfully linked sub-issue!${NC}"
    echo ""
    echo -e "Parent: #${PARENT_NUM} - ${PARENT_TITLE}"
    echo -e "Sub-issue: #${SUB_NUM} - ${SUB_TITLE}"
else
    echo -e "${RED}Error: Failed to create sub-issue relationship${NC}"
    echo "$RESULT"
    exit 1
fi
