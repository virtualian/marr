# Testing Standard

> **AI Agent Instructions**: This document defines testing philosophy and practices for this project. Follow these rules for code quality.
>
> **Scope**: Project-level standard (applies to this project only)
>
> **Rationale**: Testing ensures configuration system works correctly and prevents regressions.

---

## Core Rules (NEVER VIOLATE)

1. **Test behavior, not implementation** because users care about outcomes
2. **Focus on critical paths** because that's where bugs have highest impact
3. **Meaningful tests over metrics** because quality trumps quantity
4. **Never commit with test failures** because broken tests break everyone's workflow

---

## Testing Priorities for This Project

### High-Value Testing (ALWAYS test)

1. **Configuration Validation**
   - CLAUDE.md files parse correctly
   - Prompt references resolve correctly
   - Required sections present

2. **Template Generation**
   - Templates produce valid configuration files
   - Variable substitution works correctly
   - Generated files pass validation

3. **Initialization Logic**
   - Directory structure created correctly
   - Files copied to correct locations
   - Permissions set appropriately

### Low-Value Testing (SKIP these)

- Markdown rendering appearance
- File system operations (framework responsibility)
- Git operations (tested by Git itself)

---

## Testing Approach

### For Configuration Validation
- Read example configurations
- Verify required sections exist
- Check prompt file references valid
- Confirm naming conventions followed

### For Template System
- Generate from template with test data
- Validate output structure
- Verify substitutions correct
- Check for edge cases

### For Initialization Tools
- Create test directory
- Run initialization
- Verify expected files exist
- Check file contents correct
- Clean up after test

---

## Coverage Philosophy

**Realistic thresholds for this project:**
- Configuration validation: High coverage (70-80%)
- Template generation: Moderate coverage (50-70%)
- Helper scripts: Lower coverage (30-50%)

**Focus on meaningful tests, not coverage numbers.**

---

## Anti-Patterns (FORBIDDEN)

❌ **Don't test framework features** - Don't test Git, file I/O, etc.
❌ **Don't test examples** - Examples are reference, not code to test
❌ **Don't test documentation** - Focus on functional code

---

## This Project Specifics

- **Testing approach**: Validation scripts for configurations
- **No automated tests yet**: In scaffold/planning phase
- **Future**: Validation tools will need comprehensive tests

---

**This testing philosophy ensures high-quality configuration system without wasting effort on low-value tests.**
