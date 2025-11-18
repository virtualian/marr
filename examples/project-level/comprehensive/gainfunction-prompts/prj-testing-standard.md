# Testing Standards - Project Configuration

> **AI Agent Instructions**: This document defines project-specific testing tools and thresholds. The testing philosophy is defined at user-level.
>
> **This file only contains project-specific tool configurations.**

---

## Testing Stack

**This project uses:**
- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Framework:** Next.js 14+ with React
- **Language:** TypeScript

**Rationale:** These tools align with the TypeScript/React stack and provide fast feedback (Vitest) plus comprehensive E2E coverage (Playwright).

---

## Coverage Thresholds

**Enforce minimum coverage thresholds:**

### Global Minimums
- **Statements:** 50%
- **Branches:** 40%
- **Functions:** 50%
- **Lines:** 50%

**Rationale:** Catches majority of logic errors without excessive burden.

### Component-Specific Thresholds

| Component Type | Threshold | Rationale |
|:---------------|:----------|:----------|
| **API Routes** | 70% | Security vulnerabilities have severe consequences |
| **Utilities** | 80% | Shared logic bugs propagate across application |
| **Components** | 40% | Only business logic needs testing (not rendering) |
| **Critical Paths** | 90% | Auth and validation failures are catastrophic |

---

## Testing Scope

### Unit Tests Must Cover

**Using Vitest:**
- Individual functions and methods
- Component business logic (data processing)
- API route handlers
- Utility functions

**Skip:**
- UI rendering (framework responsibility)
- Simple display components (no logic)
- Styling and layout

---

### E2E Tests Must Cover

**Using Playwright:**
- Authentication flows
- Admin operations (if applicable)
- Critical user paths (conversion funnel)
- Multi-step processes

**Skip:**
- Every UI interaction (covered by unit tests)
- Framework features (already tested)

---

## Framework-Specific Guidelines

### Next.js/React Testing

**Avoid testing:**
- Framework behavior (Next.js routing, React rendering)
- Third-party library internals
- Form interactions (use E2E for workflows)

**Focus on:**
- Business logic in components
- API route authorization and validation
- Server Actions (if used)
- Data transformation and state management

---

## Integration with Project Standards

**Testing integrates with:**
- **UI/UX Standard** (`prompts/prompt-ui-ux-standard.md`) - Accessibility validation required
- **Git Workflow** (user-level) - All tests must pass before committing

**All PRs must satisfy testing AND UI/UX requirements.**

---

## Project-Specific Anti-Patterns

❌ **Testing Next.js routing** - Framework already tested
❌ **Testing React rendering** - Use E2E for UI workflows
❌ **100% coverage on display components** - Wastes effort on non-logic code

---

**For complete testing philosophy, see user-level standard.**

**This file only defines tool choices and project-specific thresholds.**
