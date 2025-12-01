#!/bin/bash
#
# Release script for MARR package
#
# Usage: ./scripts/release.sh [major|minor|patch]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check we're at repo root
if [ ! -f "CLAUDE.md" ] || [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Run this script from the repository root${NC}"
    echo "  cd /path/to/marr && ./scripts/release.sh patch"
    exit 1
fi

# Check argument
VERSION_TYPE=${1:-patch}
if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo -e "${RED}Error: Invalid version type '$VERSION_TYPE'${NC}"
    echo "Usage: ./scripts/release.sh [major|minor|patch]"
    exit 1
fi

# Check for uncommitted changes
if ! git diff --quiet HEAD; then
    echo -e "${RED}Error: You have uncommitted changes${NC}"
    echo "Commit or stash your changes before releasing."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}Current version: $CURRENT_VERSION${NC}"

# Calculate new version
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

# Confirm
read -p "Release v$NEW_VERSION? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Update package.json version (without npm's git integration)
npm version "$NEW_VERSION" --no-git-tag-version
echo -e "${GREEN}Updated package.json to $NEW_VERSION${NC}"

# Build to ensure everything compiles
echo "Building..."
npm run build
echo -e "${GREEN}Build successful${NC}"

# Stage and commit
git add package.json
git commit -m "$NEW_VERSION"
echo -e "${GREEN}Created commit: $NEW_VERSION${NC}"

# Create tag
git tag "v$NEW_VERSION"
echo -e "${GREEN}Created tag: v$NEW_VERSION${NC}"

# Summary
echo ""
echo -e "${GREEN}Release prepared successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review: git log --oneline -3"
echo "  2. Push:   git push origin main --tags"
echo "  3. Publish: npm publish --access public"
echo ""
echo "Or to undo: git reset --hard HEAD~1 && git tag -d v$NEW_VERSION"
