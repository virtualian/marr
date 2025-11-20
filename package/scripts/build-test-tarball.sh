#!/bin/bash
# Build a test tarball for testing in testuser account

set -e

cd "$(dirname "$0")/.."

echo "🔨 Building test tarball..."

# Build and pack
npm run build
npm pack

echo ""
echo "✅ Test tarball created: $(pwd)/virtualian-marr-1.0.0.tgz"
echo ""
echo "To test in testuser account:"
echo "  sudo su - testuser"
echo "  bash /Users/ianmarr/projects/marr/package/scripts/test-in-testuser.sh"
