# SpecVerse Testing Standards - AI Agent Directives

> **Implementation Guide**: See `docs/testing-guide.md` for commands, code patterns, and workflows
>
> **Quick Reference**: See `/TESTING.md` for developer quick reference
>
> **This Document**: WHAT testing standards must be followed and WHY

## Core Rules (NEVER VIOLATE)

1. **ALWAYS run tests before committing** because untested code introduces production risks
2. **Maintain realistic coverage thresholds** because comprehensive testing catches bugs early
3. **Write tests for business logic only** because testing implementation details creates brittle tests
4. **Test behavior, not implementation** because users care about outcomes, not internal mechanics
5. **Use appropriate test type** because different test layers serve different purposes

## Two-Layer Testing Strategy

Use two complementary testing approaches because each serves a distinct purpose:

1. **Unit Tests (Vitest)** - Test isolated business logic because fast feedback prevents regressions
2. **E2E Tests (Playwright)** - Test complete user workflows because integration issues require end-to-end validation

Both layers must be used together because neither alone provides sufficient quality assurance.

## Testing Philosophy

**Test behavior, not implementation** because:
- User-facing behavior is what matters in production
- Implementation details change frequently
- Behavior tests survive refactoring
- Implementation tests create maintenance burden

**Focus testing efforts on**:
- Business logic and data transformation because bugs here cause data corruption
- API security and authentication because security failures destroy trust
- Input validation and error handling because invalid input causes system failures
- Core utility functions because these are reused across the application

**Avoid testing**:
- UI rendering and component appearance because these are framework responsibilities
- Framework behavior (Next.js, React) because testing library code wastes effort
- Form interactions and user events because E2E tests cover these better
- Animation and visual effects because these don't affect business logic

## Coverage Requirements

Enforce minimum coverage thresholds because they ensure critical code is tested:

**Global Minimums** (50% statements, 40% branches, 50% functions, 50% lines) because this catches majority of logic errors without excessive burden

**Component-Specific Thresholds** because risk varies by component type:
- **API Routes: 70%** because security vulnerabilities have severe consequences
- **Utilities: 80%** because shared logic bugs propagate across the application
- **Components: 40%** because only business logic needs testing
- **Critical Paths: 90%** because auth and validation failures are catastrophic

## AI Agent Decision Tree

**When adding or changing business logic:**
- Write focused unit tests for behavior because business logic is core application value

**When adding or changing user workflows:**
- Consider E2E tests for auth flows, admin operations, and critical paths because integration issues appear in workflows

**When working on APIs, auth, or validation:**
- Write comprehensive unit tests (70-90% coverage) because these are security-critical

**When all tests pass:**
- Check coverage meets thresholds because incomplete coverage hides bugs

**When coverage is insufficient:**
- Add focused tests for business logic only because meaningful tests matter more than coverage numbers

## Testing Scope by Type

**Unit Tests must cover:**
- Individual functions and methods because isolation enables precise bug location
- Component business logic (data processing) because this is where value lives
- API route handlers because security depends on correct authorization
- Utility functions because shared code needs high confidence

**E2E Tests must cover:**
- Authentication flows because login failures block all user access
- Admin operations because privilege escalation is a security risk
- Critical user paths because revenue depends on core workflows
- Multi-step processes because integration failures happen between steps

**Skip testing for:**
- Simple display components because they contain no logic
- Styling and layout because visual testing is not unit testing
- Framework features because testing library code is pointless
- Pass-through components because they add no value

## Anti-Patterns (FORBIDDEN)

Never test implementation details because they make tests brittle and maintenance-heavy

Never over-test UI interactions because E2E tests cover this better

Never create complex mocks because they obscure real behavior and hide bugs

Never game coverage metrics because meaningless tests waste effort

Never test framework features because built-in behavior is already tested

Never ignore failing tests because broken tests indicate broken code

Never commit with test failures because CI exists to catch this

## Integration Requirements

**These testing standards work with Git Workflow standards** because code quality and process quality are inseparable

All code changes must satisfy both testing AND git workflow requirements because skipping either creates production risk

Reference git workflow at: `prompts/prompt-git-workflow-standard.md`

---

**MANDATORY COMPLIANCE**: All AI agents must follow these testing standards for every code change because consistency prevents bugs from reaching production
