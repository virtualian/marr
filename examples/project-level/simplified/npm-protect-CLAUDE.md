# npm-protect - Claude AI Development Notes

## Project Overview

This is a security toolkit designed to protect Node.js developers from PhantomRaven and similar npm supply chain attacks. The toolkit was developed with assistance from Claude AI and includes comprehensive auditing, validation, and monitoring tools.

## Recent Updates & Bug Fixes

### Session: 2025-11-02 (Issue #9 - Consolidation)

#### Major Refactoring
1. **Code Consolidation and Reuse** (Issue #9)
   - Created `npm-audit-lib.sh` shared library with common functions
   - Consolidated project scanning into `audit-installed-packages.sh` via `--project` mode
   - Deprecated `recursive-audit-script.sh` with migration guide
   - Added template rendering system for consistent reports
   - Eliminated significant code duplication across scripts

2. **Shared Library Functions** (npm-audit-lib.sh)
   - Cache management (lib_get_package_info, lib_is_cache_valid)
   - Maintainer parsing (lib_parse_maintainers, lib_output_maintainer_data)
   - Risk scoring (lib_calculate_risk_score, lib_get_risk_level)
   - Project scanning (lib_find_projects, lib_should_exclude, lib_shuffle_array)
   - Template rendering (lib_render_template, lib_get_template_path)
   - All functions exported for use across scripts

3. **Unified Tool** (audit-installed-packages.sh)
   - Added `--project` mode for scanning project directories
   - Maintains all features from recursive-audit-script.sh:
     - Configurable depth (`--max-depth`)
     - Exclusion patterns (`-e, --exclude`)
     - Parallel execution (`--parallel`)
     - Summary mode (`-s, --summary`)
     - Sampling options (`-n, --limit`, `-r, --random`)
   - Project-specific report generation
   - Cross-project maintainer analysis
   - Consistent report format across all scan types

4. **Report Templates**
   - Created template directory structure (templates/common/, templates/packages/, templates/projects/)
   - Template files with ${PLACEHOLDER} syntax
   - Template rendering functions in shared library
   - Foundation for consistent reporting across all tools

### Session: 2025-10-31

#### Bugs Fixed
1. **File Naming Inconsistency**
   - Changed all script filenames from underscores to hyphens
   - Updated internal references to match new naming convention
   - Files affected: All `.sh` and `.js` scripts

2. **AUDIT_SCRIPT_PATH Bug** (recursive-audit-script.sh:103)
   - Issue: Used relative path `$(dirname "$0")` which failed when script run from different directory
   - Fix: Changed to absolute path using `$(cd "$(dirname "$0")" && pwd)`
   - Impact: Script can now be run from any directory

3. **Subshell Variable Counting** (recursive-audit-script.sh:236-242)
   - Issue: Pipe to while loop created subshell, variables not updating in parent shell
   - Fix: Changed from `eval $FIND_CMD | while` to `while... done < <(eval $FIND_CMD)`
   - Impact: Project counts now display correctly (was showing 0, now shows actual count)

4. **Relative Path Bug in audit-installed-packages.sh** (audit-installed-packages.sh:72)
   - Issue: OUTPUT_DIR was relative path, became invalid after `cd "$package_dir"`
   - Error: `npm-audit-installed-*/global-*.txt: No such file or directory`
   - Fix: Convert to absolute path before creating directory: `OUTPUT_DIR="$(pwd)/$OUTPUT_DIR"`
   - Impact: Script now successfully creates individual report files for all packages
   - Scans @org scoped packages correctly with depth 5 recursion

5. **Relative Path Bug in recursive-audit-script.sh** (recursive-audit-script.sh:136-146)
   - Issue: OUTPUT_DIR was relative path, became invalid when script context changed
   - Error: `audit-results.txt: No such file or directory` at line 360
   - Fix: Convert to absolute path after timestamp is added but before directory creation
   - Uses case statement to detect and preserve already-absolute paths
   - Impact: Script now correctly creates all output files regardless of execution context
   - Handles both default output directory and custom `-o` paths (relative or absolute)

#### Features Added

1. **Summary Report Generation in audit-installed-packages.sh** (audit-installed-packages.sh:180-309)
   - Added automatic generation of `audit-results.txt` and `audit-results-detailed.txt`
   - Reports match format of recursive-audit-script.sh output
   - Includes aggregated findings:
     - Single-maintainer packages (informational)
     - Packages with lifecycle scripts
     - Recommendations
   - Lists all scanned packages with ✓ or ⚠ indicators
   - Creates individual report files per package: `global-{package}.txt` or `local-{package}.txt`

2. **NPM View Result Caching** (npm-security-audit.sh:117-142)
   - Added 24-hour cache for npm view results
   - Cache location: `$TMPDIR/.npm-audit-cache/`
   - Significantly improves performance for recursive scans
   - Cache file naming: Package names with `/` replaced by `_`
   - Performance: 10-50x faster on repeated scans

3. **Integrated Report Generation** (recursive-audit-script.sh:330-453)
   - Automatically generates 3 reports per scan:
     - `audit-results.txt` - Basic summary
     - `audit-results-detailed.txt` - Detailed with aggregated findings
     - `audit-results-full.log` - Complete output (if logging enabled)
   - Aggregated findings include:
     - Unique single-maintainer packages across all projects
     - Unique packages with lifecycle scripts
     - Total counts for each category
     - Cache statistics
   - Added `-l/--log` option for full output capture

4. **Enhanced Help Documentation**
   - Updated usage instructions
   - Added examples for all execution modes
   - Documented report generation

5. **Enhanced Single Maintainer Reporting** (npm-security-audit.sh:140-143, package-validator.js:125-136)
   - Now displays maintainer name and email when detected
   - Handles both npm registry maintainer formats (string and object)
   - Output formats:
     - Bash scripts: `package-name - username <email@example.com>`
     - Node.js: `username <email@example.com>` (package in header)
   - Updated aggregation scripts to capture full maintainer information
   - Provides better context for identifying suspicious patterns across packages

## Architecture

### Core Scripts

1. **audit-installed-packages.sh** (1100+ lines)
   - **Unified tool** for all scanning needs
   - **Project scanning mode** (`--project`): Recursively scans directory trees for Node.js projects
   - **Package scanning mode** (`--global`/`--local`): Scans globally or locally installed packages
   - Configurable depth, exclusions, parallel/serial execution
   - Integrated report generation with project/package-specific formats
   - Uses shared library functions for common operations

2. **npm-security-audit.sh** (201 lines)
   - Single project scanner (used internally)
   - Checks for HTTP dependencies, lifecycle scripts, package metadata
   - Uses caching for npm view calls via shared library
   - Output: Colored terminal output with findings

3. **npm-audit-lib.sh** (600+ lines)
   - **Shared library** with common functions used across all scripts
   - Cache management (24-hour TTL)
   - Maintainer data parsing and aggregation
   - Risk scoring calculation
   - Project scanning utilities
   - Template rendering functions
   - Eliminates code duplication

4. **recursive-audit-script.sh** (DEPRECATED)
   - **Deprecated**: Consolidated into audit-installed-packages.sh
   - Now shows migration notice pointing to new `--project` mode
   - All functionality preserved in unified tool

5. **package-validator.js** (387 lines)
   - Pre-installation risk analysis
   - Risk scoring algorithm (0-100+)
   - Typosquatting detection using Levenshtein distance

4. **npm-install-monitor.js** (227 lines)
   - Network monitoring during installation
   - Uses lsof to track connections
   - Logs to npm-install-log.json

5. **credential-rotation-script.sh** (280 lines)
   - Interactive post-compromise guide
   - Scans for exposed credentials
   - Provides step-by-step rotation instructions

6. **scheduled-audit-script.sh** (416 lines)
   - Automated scheduling wrapper
   - Email and Slack integration
   - Alert-on-change logic

7. **generate-summary-report.sh** (new)
   - Standalone report generator
   - Can process any audit log
   - Extracts aggregated findings

## Technical Details

### Caching Implementation
```bash
# Cache directory
CACHE_DIR="${TMPDIR:-/tmp}/.npm-audit-cache"

# Cache file format
cache_file="$CACHE_DIR/$(echo "$pkg" | sed 's/\//_/g').json"

# Cache validity: 24 hours
if [ -f "$cache_file" ] && [ $(($(date +%s) - $(stat -f %m "$cache_file"))) -lt 86400 ]; then
    # Use cached data
fi
```

### Process Substitution Fix
```bash
# OLD (broken - creates subshell):
eval $FIND_CMD | while IFS= read -r package_json; do
    audit_project "$package_json"
done

# NEW (fixed - no subshell):
while IFS= read -r package_json; do
    audit_project "$package_json"
done < <(eval $FIND_CMD)
```

### Absolute Path Resolution
```bash
# OLD (broken - relative path):
AUDIT_SCRIPT_PATH="$(dirname "$0")/npm-security-audit.sh"

# NEW (fixed - absolute path):
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_SCRIPT_PATH="$SCRIPT_DIR/npm-security-audit.sh"
```

## Execution Modes

### Default Mode
- Foreground execution
- Serial (one project at a time)
- Full verbose output
- Prints project names with decorative banners

### Summary Mode (`-s`)
- One-line status per project
- 3-5x faster than verbose
- Good for quick checks

### Parallel Mode (`-p`)
- Multiple projects concurrently
- 2-3x faster than serial
- Output may be interleaved

### Background Mode
- Use `nohup` or `&`
- Redirect output to log file
- Good for long-running scans

## Performance Characteristics

### Scan Times (72 projects, depth 5)
- First run (no cache): ~3 minutes
- Subsequent runs (with cache): ~30 seconds
- Summary mode: ~45 seconds
- Parallel mode: ~1.5 minutes

### Cache Statistics
- Typical cache size: 150-200 packages
- Cache hit rate: 80-95% on repeated scans
- Cache storage: ~10-50KB per package

## Testing Results

### Test Scan: /Volumes/Dev24/GitHub
- Projects found: 72
- Clean projects: 72
- Suspicious: 0
- Failed: 0
- Duration: 3m 2s
- Cache entries: 179 packages

### Findings
- Single-maintainer packages: 55 unique
- Lifecycle scripts: 13 unique packages
- No security threats detected

## Known Limitations

1. **MacOS Specific**
   - Uses `stat -f %m` for file modification time
   - Would need `stat -c %Y` for Linux

2. **Cache Invalidation**
   - 24-hour expiry only
   - No manual cache clear command (must delete directory)

3. **Report Aggregation**
   - Requires full output log for aggregated findings
   - Summary mode doesn't capture enough data

4. **Parallel Mode**
   - Output can be difficult to read
   - Not recommended for detailed analysis

## Future Enhancements

1. Cache management commands (clear, stats, validate)
2. JSON output format option
3. Configurable cache expiry
4. Progress bar for long scans
5. Email alerting built into recursive script
6. Database storage for scan history
7. Web dashboard for viewing results

## File Structure

```
npm-protect/
├── README.md                          # Main documentation
├── CLAUDE.md                          # This file
├── implementation_guide.md            # Complete setup guide
├── audit_setup_helper.md             # Automation setup
├── npm-audit-lib.sh                  # Shared library (NEW)
├── npm-security-audit.sh             # Core scanner (uses lib)
├── audit-installed-packages.sh       # Unified tool (project + package scanning)
├── recursive-audit-script.sh         # DEPRECATED (migration notice)
├── package-validator.js              # Pre-install validator
├── npm-install-monitor.js            # Network monitor
├── credential-rotation-script.sh     # Post-compromise guide
├── npmrc-security-config.sh          # Secure config
├── scheduled-audit-script.sh         # Automation wrapper
├── generate-summary-report.sh        # Report generator
├── templates/                        # Report templates (NEW)
│   ├── common/                       # Common templates
│   ├── packages/                     # Package scan templates
│   └── projects/                     # Project scan templates
├── deprecated/                        # Deprecated scripts
│   └── recursive-audit-script.sh     # DEPRECATED (migration notice)
├── reports/                           # Report output directory
│   ├── packages-YYYY-MM-DD-*/        # Package scan reports
│   └── projects-YYYY-MM-DD-*/        # Project scan reports
└── docs/                             # Documentation directory
```

## Development Commands

### Test Single Project
```bash
cd /path/to/project
/path/to/npm-security-audit.sh
```

### Test Recursive Scan
```bash
export TMPDIR="/tmp"
./recursive-audit-script.sh -d 2 /test/directory
```

### Generate Report from Log
```bash
./generate-summary-report.sh /tmp/audit.log output.txt
```

### Clear Cache
```bash
rm -rf /tmp/.npm-audit-cache/
```

### Check Cache Size
```bash
ls /tmp/.npm-audit-cache/ | wc -l
du -sh /tmp/.npm-audit-cache/
```

## Debugging Tips

1. **Script not finding audit script**
   - Check AUDIT_SCRIPT_PATH is absolute
   - Verify file exists and is executable

2. **Counts showing as 0**
   - Check for pipe-based subshells
   - Use process substitution instead

3. **Slow performance**
   - Ensure TMPDIR is set
   - Check cache directory exists and is writable
   - Use summary mode for quick scans

4. **No aggregated findings in report**
   - Must use logging: `2>&1 | tee log.txt`
   - Or use `-l` option
   - Summary mode doesn't capture details needed

## Command Reference

### Quick Commands
```bash
# Fast check
./recursive-audit-script.sh -s -d 3 ~/projects

# Standard scan with logging
export TMPDIR="/tmp"
./recursive-audit-script.sh ~/projects 2>&1 | tee audit.log

# Deep scan overnight
nohup ./recursive-audit-script.sh -d 10 /all/repos > scan.log 2>&1 &

# Monitor progress
tail -f scan.log | grep "Auditing:"
grep -c "No obvious threats" scan.log
```

## Integration Examples

### Pre-commit Hook
```bash
#!/bin/bash
if [ -f "package.json" ]; then
    /path/to/npm-security-audit.sh || exit 1
fi
```

### CI/CD Pipeline
```yaml
- name: NPM Security Audit
  run: |
    export TMPDIR="/tmp"
    ./recursive-audit-script.sh -s -p -d 4 . || exit 1
```

### Cron Job
```cron
0 2 * * 1 export TMPDIR="/tmp" && /path/to/recursive-audit-script.sh ~/projects > ~/audit-$(date +\%Y\%m\%d).log 2>&1
```

## Maintenance Notes

- Cache directory should be cleaned periodically (handled by 24h expiry)
- Check for script updates regularly
- Review aggregated findings for new patterns
- Update known malicious domains list as needed

## ⚠️ CRITICAL: Documentation Maintenance

**IMPORTANT:** The `docs/` directory contains 15 documentation files that MUST be kept in sync with the scripts.

### Documentation Structure

```
docs/
├── README.md                          # Navigation index
├── overview.md                        # System architecture
├── npm-security-audit.md             # Documents npm-security-audit.sh
├── audit-installed-packages.md       # Documents audit-installed-packages.sh
├── recursive-audit-script.md         # Documents recursive-audit-script.sh
├── scheduled-audit-script.md         # Documents scheduled-audit-script.sh
├── package-validator.md              # Documents package-validator.js
├── npm-install-monitor.md            # Documents npm-install-monitor.js
├── credential-rotation-script.md     # Documents credential-rotation-script.sh
├── generate-summary-report.md        # Documents generate-summary-report.sh
├── npmrc-security-config.md          # Documents npmrc-security-config.sh
├── security-indicators.md            # Security threat documentation
├── output-formats.md                 # Report format specifications
├── integration-guidelines.md         # CI/CD and tooling integration
└── appendix.md                       # Troubleshooting and best practices
```

### Mandatory Update Protocol

**WHENEVER YOU MODIFY A SCRIPT, YOU MUST:**

1. **Update the corresponding docs/ file** with the same changes
2. **Update docs/README.md** if new features affect navigation
3. **Update docs/overview.md** if architecture changes
4. **Test all cross-references** to ensure links still work
5. **Update version numbers** in both script headers and docs

### What Requires Documentation Updates

✅ **ALWAYS UPDATE DOCS FOR:**
- New command-line options or parameters
- Changed default behavior
- New output formats or report types
- Modified algorithms or detection methods
- New dependencies or requirements
- Changed file locations or names
- New error messages or exit codes
- Performance improvements with measurable impact
- New security indicators or threat types

⚠️ **CONSIDER UPDATING DOCS FOR:**
- Bug fixes that affect behavior
- Internal refactoring that changes how features work
- Optimization that affects performance characteristics

❌ **NO DOC UPDATE NEEDED FOR:**
- Code comments only
- Variable name changes (internal only)
- Pure refactoring with no behavioral changes

### How to Update Documentation

1. **Identify affected docs:**
   ```bash
   # Script changed: npm-security-audit.sh
   # Must update: docs/npm-security-audit.md
   # May update: docs/overview.md, docs/security-indicators.md
   ```

2. **Make parallel changes:**
   - Update code examples in docs to match new behavior
   - Update technical implementation sections
   - Update input/output examples
   - Update performance characteristics if changed

3. **Verify cross-references:**
   ```bash
   # Check all markdown links in docs/
   grep -r "\[.*\](.*.md)" docs/
   ```

4. **Test documentation:**
   - Read through modified sections
   - Verify examples are accurate
   - Check that navigation links work

### Documentation Quality Standards

Each script documentation file must include:
- **Purpose:** What the script does
- **Functionality:** How it works (technical details)
- **Input Parameters:** All command-line options
- **Output Format:** What the script produces
- **Performance Characteristics:** Speed, memory, scalability
- **Use Cases:** Real-world examples
- **Cross-references:** Links to related docs

### Pre-Commit Checklist

Before committing script changes:
- [ ] Corresponding docs/ file(s) updated
- [ ] Code examples in docs tested
- [ ] Cross-references verified
- [ ] Performance characteristics updated if changed
- [ ] README.md updated if navigation changed
- [ ] Git commit message mentions doc updates

### Example Commit Message

```
Fix OUTPUT_DIR bug in audit-installed-packages.sh

- Convert OUTPUT_DIR to absolute path before cd
- Fixes "No such file or directory" errors
- Update docs/audit-installed-packages.md:
  - Add troubleshooting section
  - Update performance characteristics
  - Add example for custom output directory

Fixes #123
```

### Finding What Needs Documentation

```bash
# Find scripts without recent doc updates
for script in *.sh *.js; do
  doc="docs/$(basename "$script" .sh).md"
  doc="${doc%.js.md}.md"
  if [ -f "$doc" ]; then
    script_time=$(stat -f %m "$script" 2>/dev/null || stat -c %Y "$script")
    doc_time=$(stat -f %m "$doc" 2>/dev/null || stat -c %Y "$doc")
    if [ "$script_time" -gt "$doc_time" ]; then
      echo "⚠️  $script modified after $doc"
    fi
  fi
done
```

### Consequences of Outdated Documentation

- Users follow incorrect instructions → broken workflows
- Wrong parameters documented → errors and confusion
- Outdated examples → frustration and time waste
- Missing features → underutilization of tools
- Incorrect performance info → wrong architecture decisions

**TREAT DOCUMENTATION AS FIRST-CLASS CODE: If it's not documented, it doesn't exist.**

## Version History

- 2025-10-31: Bug fixes, caching, integrated reporting
- Initial version: Core security scanning tools

## Contact

For issues, suggestions, or contributions, please refer to the main repository.
