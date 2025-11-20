#!/bin/bash
# Verify that testuser can access MARR testing files

echo "🔍 Verifying permissions for testuser access..."
echo ""

# Check directories
echo "Directory Permissions:"
stat -f "%Sp %N" \
  /Users/ianmarr \
  /Users/ianmarr/projects \
  /Users/ianmarr/projects/marr \
  /Users/ianmarr/projects/marr/package \
  /Users/ianmarr/projects/marr/package/scripts

echo ""
echo "File Permissions:"
ls -l /Users/ianmarr/projects/marr/package/virtualian-marr-1.0.0.tgz
echo ""
ls -l /Users/ianmarr/projects/marr/package/scripts/*.sh

echo ""
echo "✅ All paths should show r-x (read+execute) for 'others' (last 3 chars)"
echo "✅ Scripts should show -rwxr-xr-x"
echo "✅ Tarball should show -rw-r--r--"
