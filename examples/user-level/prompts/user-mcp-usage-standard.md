# MCP Tool Usage Standards

> **AI Agent Instructions**: This document defines how to effectively use Model Context Protocol (MCP) tools. Follow these directives exactly to avoid tool confusion, conflicts, and performance issues.
>
> **Scope**: User-level standard (applies across all projects)
>
> **Rationale**: MCPs are powerful but can cause confusion if used incorrectly. Clear usage patterns ensure efficient, predictable tool invocation.

---

## Core Principles (MANDATORY)

1. **ALWAYS be specific in tool requests** because ambiguous requests cause wrong tool selection
2. **ALWAYS use explicit tool names when unclear** because Claude Code cannot read your mind
3. **ALWAYS follow sequential workflows** because chaining tools requires clear order
4. **NEVER assume tool capabilities** because each MCP has specific, limited functionality
5. **NEVER use vague commands** because "check this" could mean 5 different things

---

## Requesting Tool Usage

### Be Specific in Requests

**Ambiguous requests cause wrong tool selection.**

❌ **Ambiguous (DO NOT USE):**
```
"Check this component"
"Test the button"
"Fix the hero"
"Validate this code"
"Screenshot this"
"Generate a form"
```

**Problem:** Claude Code must guess which tool you want. Could mean accessibility check, visual test, code review, linting, or something else entirely.

✅ **Specific (ALWAYS USE):**
```
"Check WCAG accessibility for this component using a11y MCP"
"Take a screenshot of the button at 390px mobile viewport using playwright"
"Regenerate the hero section with v0 using dark background and orange CTA"
"Validate TypeScript types and check for linting errors"
"Screenshot this component at mobile, tablet, and desktop sizes"
"Generate a contact form with v0 using shadcn/ui components"
```

**Why this works:** Clear tool selection, clear action, clear parameters.

---

### Use Explicit Tool Names When Needed

**When request could apply to multiple tools, specify the tool.**

**Examples:**

```
"Use a11y MCP to check accessibility compliance"
"Use playwright to screenshot at iPhone 14 Pro viewport"
"Use v0 to generate a new CTA button component"
"Use tailwind MCP to convert this CSS to Tailwind utilities"
"Use shadcn-ui MCP to show available Button component props"
```

**When to use explicit names:**
- Ambiguous requests (could apply to 2+ tools)
- First time using a tool in conversation
- After tool produced unexpected results
- When chaining multiple tools in sequence

**When explicit names are optional:**
- Context is clear from previous messages
- Only one tool can perform the action
- Continuing previous tool usage

---

### Chain Tools Explicitly

**For multi-step workflows, specify the complete sequence.**

❌ **Unclear chain:**
```
"Generate a hero, check it, and test it"
```

**Problem:** What does "check" mean? What does "test" mean? Accessibility? Visual? Performance?

✅ **Explicit chain:**
```
"Generate a hero section with v0 using brand colors,
then check WCAG accessibility with a11y MCP,
then screenshot with playwright at mobile viewport (390px),
then show me the results"
```

**Why this works:** Each step is clear, tools are specified, order is explicit.

**Common UI/UX workflow:**
```
1. Generate component with v0 MCP
2. Install dependencies with shadcn-ui MCP
3. Refine styling with tailwind MCP
4. Validate accessibility with a11y MCP
5. Screenshot with playwright MCP at mobile viewport
```

---

## Tool-Specific Usage Guidelines

### v0 MCP (UI Generation)

**When to use:**
- Generating new UI components
- Converting designs to code
- Iteratively refining component designs

**How to request:**
```
✅ "Generate a hero section with v0:
   - Dark background with light text
   - Orange CTA button
   - Mobile-first responsive
   - Professional appearance
   - Uses shadcn/ui components"

❌ "Create a hero"  (too vague)
❌ "Make a nice homepage component"  (no specifics)
```

**Best practices:**
- Include brand colors/styles in prompt
- Specify mobile-first if needed
- Mention target audience (professional, casual, etc.)
- Request shadcn/ui component usage
- Specify responsive requirements

---

### shadcn-ui MCP (Component Library)

**When to use:**
- Checking available components
- Understanding component APIs
- Installing components
- Viewing component documentation

**How to request:**
```
✅ "Show me shadcn-ui Button component API and available variants"
✅ "List all available shadcn-ui form components"
✅ "Install Card and Badge components from shadcn-ui"

❌ "Show me buttons"  (which library?)
❌ "Add a card"  (install from where?)
```

**Best practices:**
- Specify "shadcn-ui" explicitly when ambiguous
- Ask about component APIs before using
- Install components as needed (don't bulk install)

---

### tailwind MCP (CSS Utilities)

**When to use:**
- Converting CSS to Tailwind classes
- Generating Tailwind config from brand colors
- Finding Tailwind utility classes
- Optimizing Tailwind usage

**How to request:**
```
✅ "Convert this CSS to Tailwind utilities:
   background: #0E3640;
   padding: 4rem 2rem;
   border-radius: 8px;"

✅ "Generate Tailwind config for brand colors:
   Primary: #0E3640
   Accent: #FBA500"

❌ "Make this Tailwind"  (make what?)
❌ "Fix the CSS"  (fix how?)
```

**Best practices:**
- Provide exact CSS when converting
- Include hex codes when generating configs
- Ask for explanations of Tailwind patterns

---

### a11y MCP (Accessibility Testing)

**When to use:**
- WCAG compliance checking
- Accessibility validation
- Color contrast verification
- Screen reader compatibility testing

**How to request:**
```
✅ "Check WCAG 2.1 AA compliance for this hero component using a11y MCP"
✅ "Verify color contrast between #FBA500 and #0E3640"
✅ "Test keyboard navigation accessibility for this form"

❌ "Check accessibility"  (which standard? which component?)
❌ "Is this accessible?"  (too vague)
```

**Best practices:**
- Specify WCAG level (AA is standard)
- Mention specific components to test
- Ask about specific accessibility concerns
- Request remediation guidance when violations found

---

### playwright MCP (Visual Testing)

**When to use:**
- Taking screenshots at specific viewports
- Visual regression testing
- Cross-device validation
- Component rendering verification

**How to request:**
```
✅ "Screenshot this hero component at these viewports:
   - iPhone 14 Pro (390x844)
   - iPad Air (820x1180)
   - Desktop (1280x800)"

✅ "Test if the CTA button is visible above fold at 390px mobile viewport"

❌ "Screenshot this"  (at what size?)
❌ "Test on mobile"  (which device? which viewport?)
```

**Best practices:**
- Always specify viewport dimensions
- List multiple viewports if needed
- Mention specific elements to verify
- Request comparison if doing regression testing

---

## Common Workflow Patterns

### UI Component Generation Workflow

**Full quality workflow for new components:**

```
"I need a professional hero section. Please:

1. Generate with v0 using these specs:
   - Dark teal background (#0E3640)
   - White text with clear hierarchy
   - Orange CTA button (#FBA500)
   - Mobile-first responsive design
   - Suitable for executive audience

2. Check what shadcn-ui components it uses and install them

3. Validate WCAG 2.1 AA accessibility with a11y MCP

4. Screenshot at 390px and 1280px viewports with playwright

5. Show me the code, screenshots, and any accessibility issues found"
```

**Why this works:** Complete workflow, clear sequence, all tools specified, no ambiguity.

---

### Design Refinement Workflow

**Iterating on existing component:**

```
"For this CTA button component:

1. Use a11y MCP to check current accessibility status
2. Use tailwind MCP to suggest color contrast improvements
3. Use v0 to regenerate with accessibility fixes
4. Screenshot the improved version at mobile viewport"
```

---

### Accessibility Validation Workflow

**Deep accessibility check:**

```
"Comprehensive accessibility validation:

1. Use a11y MCP to run full WCAG 2.1 AA audit
2. List all violations with severity
3. For each critical violation:
   - Explain the issue
   - Show the problematic code
   - Provide specific fix
4. After I apply fixes, re-run validation"
```

---

## Anti-Patterns (FORBIDDEN)

### Vague Tool Requests

❌ **DO NOT:**
```
"Check this"
"Test it"
"Fix the component"
"Make it better"
"Validate"
```

**Why forbidden:** Forces Claude Code to guess your intent, often incorrectly.

---

### Assuming Tool Capabilities

❌ **DO NOT:**
```
"Use v0 to test accessibility"  (v0 generates, doesn't test)
"Use a11y to generate components"  (a11y tests, doesn't generate)
"Use playwright to fix CSS"  (playwright screenshots, doesn't edit)
```

**Why forbidden:** Each MCP has specific capabilities. Using wrong tool wastes time.

---

### Skipping Tool Specification

❌ **DO NOT:**
```
"Screenshot at mobile size"  (which tool? which mobile size?)
"Check the colors"  (check for what? contrast? brand compliance?)
"Generate a form"  (which tool? what kind of form?)
```

**Why forbidden:** Ambiguity causes wrong tool selection or missing context.

---

### Chaining Without Order

❌ **DO NOT:**
```
"Generate, test, and screenshot this component"
```

**Why forbidden:** Unclear sequence. Does testing happen before or after generation? What kind of testing?

✅ **DO:**
```
"Generate component with v0, then test accessibility with a11y, then screenshot with playwright"
```

---

## Performance Considerations

### Tool Invocation Overhead

**Each MCP tool has startup and execution time:**
- v0 generation: ~5-15 seconds (depends on complexity)
- a11y testing: ~3-8 seconds (depends on component size)
- playwright screenshots: ~2-5 seconds per viewport
- shadcn-ui queries: ~1-2 seconds
- tailwind conversion: ~1-3 seconds

**Best practice:** Batch requests when possible.

❌ **Inefficient:**
```
"Screenshot at 390px"
[wait for result]
"Now screenshot at 768px"
[wait for result]
"Now screenshot at 1280px"
```

✅ **Efficient:**
```
"Screenshot at 390px, 768px, and 1280px viewports"
```

---

### Avoiding Redundant Tool Calls

**Don't repeat validation unnecessarily.**

❌ **Redundant:**
```
"Check accessibility"
[fixes applied]
"Check accessibility again"
[more fixes]
"Check accessibility one more time"
```

✅ **Efficient:**
```
"Check accessibility, then after I apply your suggested fixes, re-validate to confirm"
```

---

## Troubleshooting Tool Issues

### When Tool Produces Unexpected Results

**If MCP tool doesn't do what you expected:**

1. **Check if you used the right tool:**
   - v0 generates components
   - a11y tests accessibility
   - playwright screenshots
   - shadcn-ui provides component info
   - tailwind converts CSS

2. **Verify your request was specific enough:**
   - Did you specify viewport size?
   - Did you mention which component?
   - Did you provide necessary context?

3. **Try rephrasing with explicit tool name:**
   ```
   "Use [tool name] to [specific action] for [specific target]"
   ```

4. **Ask Claude Code what went wrong:**
   ```
   "That result wasn't what I expected. I wanted to [goal]. Which tool should I use?"
   ```

---

### When Multiple Tools Could Apply

**If you're unsure which tool to use, ask:**

```
"I want to verify that this button is accessible and looks good on mobile. Which MCPs should I use and in what order?"
```

**Claude Code will recommend:**
```
"Use a11y MCP for accessibility verification, then playwright MCP for mobile screenshot"
```

---

## Summary: Quick Reference

### Tool Selection Guide

| Goal | Tool | Example Request |
|:-----|:-----|:----------------|
| Generate UI | v0 | "Generate hero with v0 using dark background" |
| Component info | shadcn-ui | "Show Button API from shadcn-ui" |
| CSS conversion | tailwind | "Convert this CSS to Tailwind utilities" |
| Accessibility | a11y | "Check WCAG AA compliance with a11y" |
| Screenshots | playwright | "Screenshot at 390px with playwright" |

---

### Request Quality Checklist

Before requesting MCP tool usage, verify:

- [ ] **Specific action** - Not vague ("check" vs "check WCAG compliance")
- [ ] **Tool specified** - When ambiguous, name the tool explicitly
- [ ] **Clear parameters** - Viewport size, colors, component name, etc.
- [ ] **Sequential order** - For chains, specify step-by-step sequence
- [ ] **Expected outcome** - What result do you want to see?

---

### Common Workflow Templates

**Component Generation:**
```
"Generate [component type] with v0:
 - [visual specs]
 - [responsive requirements]
 - [accessibility requirements]
Then validate with a11y and screenshot at [viewports]"
```

**Accessibility Fix:**
```
"Check [component] with a11y for WCAG AA compliance,
list violations with severity,
suggest specific fixes"
```

**Visual Validation:**
```
"Screenshot [component] with playwright at:
 - 390px (iPhone 14 Pro)
 - 768px (iPad)
 - 1280px (Desktop)"
```

---

## AI Agent Compliance

**When user requests are ambiguous, AI agents MUST:**

1. **Clarify before acting** - Ask which tool user wants
2. **Suggest specific phrasing** - Provide example of clear request
3. **Explain tool capabilities** - Help user understand what each MCP does
4. **Recommend workflow** - Suggest proper tool sequence

**NEVER:**
- Guess which tool user wants when ambiguous
- Use wrong tool because request was vague
- Skip asking for clarification when unclear
- Proceed without necessary parameters (viewport size, colors, etc.)

---

**This MCP usage standard ensures efficient, predictable, and correct tool invocation across all projects and AI agent interactions.**
