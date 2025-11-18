# Prompt Rationalization Notes

> Created during Phase 1 STEP02 - Quick consistency review
> For comprehensive rationalization in Phase 2

## Naming Conventions

✅ **CORRECT:**
- All user-level prompts use `user-*` prefix
- All project-level prompts use `prj-*` prefix

## Format Review

### User-Level Prompts
- `user-git-workflow-standard.md` (12,072 bytes) - Comprehensive git workflow
- `user-mcp-usage-standard.md` (13,669 bytes) - MCP tool usage patterns
- `user-testing-standard.md` (7,901 bytes) - Testing philosophy
- `user-documentation-standard.md` (19,334 bytes) - **LARGEST** - Diataxis/role-first framework
- `user-standard-for-standards.md` (1,267 bytes) - **SMALLEST** - Meta standard

### Project-Level Prompts
- `prj-git-workflow-standard.md` (2,485 bytes) - Project git workflow
- `prj-testing-standard.md` (2,701 bytes) - Project testing approach
- `prj-mcp-usage-standard.md` (2,099 bytes) - Project MCP usage
- `prj-documentation-standard.md` (8,351 bytes) - Project doc organization

## Observations for Phase 2

### Size Discrepancies
- User-level standards are significantly larger than project-level (expected - more comprehensive)
- Documentation standards are largest (user: 19KB, project: 8KB)
- user-standard-for-standards is very small (1.2KB) - may need expansion

### Structural Consistency
- ✅ All files use markdown format
- ✅ All start with title and scope declaration
- ✅ All use imperative directives (MUST, NEVER, ALWAYS)
- ✅ All include rationale for rules

### Content Gaps (Potential)
- **user-standard-for-standards.md** is very brief - may need more guidance
- Project-level standards assume familiarity with user-level - ensure clear references
- No explicit version indicators in prompt files (consider for Phase 2)

### Format Uniformity
- ✅ Consistent use of Core Rules sections
- ✅ Consistent use of Anti-Patterns sections
- ✅ Consistent voice (imperative, directive)
- ⚠️ Some variation in section organization (acceptable, reflects content differences)

## Recommendations for Phase 2

1. **Expand user-standard-for-standards.md** - Currently minimal, could provide more guidance on creating new standards
2. **Add version indicators** - Consider adding version/date metadata to prompt files
3. **Cross-reference validation** - Ensure project-level prompts correctly reference user-level counterparts
4. **Consistency audit** - Deep dive on section naming, heading hierarchy, formatting patterns
5. **Content completeness** - Verify each standard covers all necessary topics for its domain

## No Blockers for Phase 1

All templates are usable as-is. Issues noted above are refinements, not critical flaws.

---

**Status:** Phase 1 quick review complete ✅
**Next:** Comprehensive rationalization in Phase 2
