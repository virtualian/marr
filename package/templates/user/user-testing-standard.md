# Testing Standards - Philosophy

> **AI Agent Instructions**: This document defines testing philosophy and principles. Follow these rules for all code changes across all projects, regardless of language or framework.
>
> **Scope**: User-level standard (applies universally)
>
> **Rationale**: Consistent testing philosophy ensures code quality, prevents regressions, and enables confident refactoring.

---

## Core Rules (NEVER VIOLATE)

1. **ALWAYS run tests before committing** because untested code introduces production risks
2. **ALWAYS maintain realistic coverage** because comprehensive testing catches bugs early
3. **ALWAYS test behavior, not implementation** because users care about outcomes, not internals
4. **ALWAYS use appropriate test layers** because different test types serve different purposes
5. **ALWAYS focus on business logic** because testing implementation details creates brittle tests

---

## Testing Philosophy

### Test Behavior, Not Implementation

**Focus on WHAT the code does, not HOW it does it:**

**Why this matters:**
- User-facing behavior is what matters in production
- Implementation details change frequently
- Behavior tests survive refactoring
- Implementation tests create maintenance burden

**Example:**
- ✅ Test: "When user submits form with invalid email, show error message"
- ❌ Test: "When validateEmail() returns false, setError() is called with 'invalid'"

---

### Two-Layer Testing Strategy

**Use complementary testing approaches:**

1. **Unit Tests** - Test isolated business logic
   - Fast feedback prevents regressions
   - Precise bug location
   - Run frequently during development

2. **Integration/E2E Tests** - Test complete workflows
   - Integration issues require end-to-end validation
   - Real user scenarios
   - Run before commits and in CI

**Both layers required** because neither alone provides sufficient quality assurance.

**Rationale:** Unit tests catch logic errors fast. Integration tests catch interaction errors. You need both.

---

## Testing Priorities

### Focus Testing Efforts On

**High-Value Testing (ALWAYS test):**
- Business logic and data transformation (bugs here cause data corruption)
- Security-critical code (authentication, authorization, validation)
- Input validation and error handling (invalid input causes system failures)
- Core utility functions (reused across application)
- Critical user workflows (revenue-generating paths)

**Rationale:** Focus testing where bugs have highest impact.

---

### Avoid Testing

**Low-Value Testing (SKIP these):**
- UI rendering and component appearance (framework responsibility)
- Framework behavior (testing library code wastes effort)
- Simple pass-through functions (no logic to test)
- Animation and visual effects (don't affect business logic)
- Third-party library internals (already tested by authors)

**Rationale:** Test your code, not the framework or libraries.

---

## Coverage Philosophy

### Realistic Thresholds

**Coverage metrics are indicators, not goals:**

- Coverage thresholds should reflect risk, not arbitrary targets
- Higher coverage for security-critical code
- Lower coverage acceptable for simple display logic
- 100% coverage is rarely worth the cost

**Decision Framework:**
- Security-critical (auth, validation) → High coverage (70-90%)
- Shared utilities (reused everywhere) → High coverage (70-80%)
- Business logic → Moderate coverage (50-70%)
- Simple components → Lower coverage (30-50%)

**Rationale:** Focus testing effort where bugs have highest impact, not chasing coverage numbers.

---

### Meaningful Tests Over Metrics

**Quality over quantity:**

**Focus on:**
- ✅ Tests that catch real bugs
- ✅ Tests that document behavior
- ✅ Tests that enable confident refactoring

**Avoid:**
- ❌ Tests just to hit coverage numbers
- ❌ Tests that test framework features
- ❌ Tests that duplicate other test coverage

**Rationale:** Meaningful tests matter more than coverage percentages.

---

## Anti-Patterns (FORBIDDEN)

### Never Test Implementation Details

❌ **Don't test internal state, private methods, or implementation specifics**

**Why forbidden:** Implementation tests break when you refactor, even if behavior stays correct.

**Example:**
- ❌ `expect(component.state.isLoading).toBe(true)`
- ✅ `expect(screen.getByText('Loading...')).toBeInTheDocument()`

---

### Never Over-Test UI Interactions

❌ **Don't write unit tests for every button click and form input**

**Why forbidden:** E2E tests cover user interactions better than unit tests.

**Use integration tests for UI workflows, unit tests for business logic.**

---

### Never Create Complex Mocks

❌ **Don't mock everything, especially when testing integrations**

**Why forbidden:** Over-mocking obscures real behavior and hides integration bugs.

**Prefer real implementations when practical, mock only external dependencies.**

---

### Never Game Coverage Metrics

❌ **Don't write meaningless tests just to hit coverage targets**

**Why forbidden:** Coverage is a tool, not a goal. Meaningless tests waste effort.

**Focus on meaningful tests, let coverage be the byproduct.**

---

### Never Ignore Failing Tests

❌ **Don't skip, comment out, or ignore failing tests**

**Why forbidden:** Failing tests indicate broken code or broken assumptions.

**Fix the code or fix the test. Never ignore.**

---

### Never Commit With Test Failures

❌ **Don't bypass failing tests to "fix it later"**

**Why forbidden:** Broken tests in main branch break everyone's workflow.

**Fix before committing. Always.**

---

## AI Agent Decision Tree

**When adding or changing business logic:**
- Write focused unit tests for behavior
- Test edge cases and error handling
- Verify test fails before implementation (TDD when practical)

**When adding or changing user workflows:**
- Write integration/E2E tests for critical paths
- Test happy path and common error scenarios
- Verify end-to-end functionality

**When working on security-critical code:**
- Write comprehensive tests (aim for high coverage)
- Test authentication, authorization, validation thoroughly
- Include security-specific test cases (injection, escalation, etc.)

**When all tests pass:**
- Check coverage meets reasonable thresholds
- Verify tests are meaningful, not just hitting numbers
- Confirm critical paths are covered

**When coverage is insufficient:**
- Add tests for business logic and critical paths
- Skip tests for framework features and simple pass-through code
- Focus on meaningful tests, not coverage percentages

---

## Integration with Other Standards

**Testing works with:**
- **Git Workflow** - All tests must pass before committing
- **Code Review** - Tests reviewed alongside code changes
- **CI/CD** - Automated test execution on every PR

**All code changes must satisfy testing standards** because untested code creates production risk.

---

## Summary: Quick Reference

### Test Priorities
1. ✅ Business logic (always)
2. ✅ Security-critical code (always)
3. ✅ Critical user workflows (always)
4. ❌ Framework features (skip)
5. ❌ UI rendering details (skip)

### Test Layers
- **Unit** - Fast, isolated, business logic
- **Integration/E2E** - Real scenarios, full workflows

### Coverage Approach
- Security-critical → High (70-90%)
- Shared utilities → High (70-80%)
- Business logic → Moderate (50-70%)
- Simple components → Lower (30-50%)

### Anti-Patterns to Avoid
- ❌ Testing implementation details
- ❌ Over-testing UI interactions
- ❌ Complex mocks everywhere
- ❌ Gaming coverage metrics
- ❌ Ignoring failing tests
- ❌ Committing with failures

---

**This testing philosophy ensures high-quality, maintainable code across all projects, regardless of language or framework.**

**Project-specific details (tools, exact thresholds, frameworks) are defined at project level.**
