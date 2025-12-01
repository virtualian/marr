#!/bin/bash
# Build a test tarball for testing in testuser account
#
# Usage: ./tests/build-test-tarball.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

echo "🔨 Building test tarball..."

# Build (includes npm pack to tests/)
npm run build

# Get the created tarball name dynamically
TARBALL=$(ls -t tests/virtualian-marr-*.tgz 2>/dev/null | head -1)

echo ""
echo "✅ Test tarball created: $TARBALL"
echo ""
echo "To test in testuser account:"
echo "  sudo su - testuser"
echo "  bash $PROJECT_ROOT/tests/testuser/test-in-testuser.sh"
