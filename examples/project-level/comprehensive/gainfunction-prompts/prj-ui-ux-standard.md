# UI/UX Development Standards

> **AI Agent Instructions**: This document defines UI/UX development standards for this project. Follow these rules exactly for all component generation, design decisions, and user interface work. **Project-specific design system details (colors, typography, spacing values) belong in project documentation, not in this standards file.**
>
> **Quick Reference**: See `/docs/ui-ux-guide.md` for implementation patterns (when created).
>
> **IMPORTANT**: When this standard is updated, communicate changes to the team.

## Core Rules (NEVER VIOLATE)

1. **ALWAYS prioritize accessibility** because legal compliance and usability are non-negotiable
2. **ALWAYS use mobile-first design** because mobile traffic dominates modern web usage
3. **ALWAYS validate with MCP tools** because automated validation catches issues early
4. **ALWAYS maintain brand consistency** because professional appearance builds user trust
5. **ALWAYS optimize for conversion** because business goals require measurable outcomes

## Target Audience Requirements

**Refer to project documentation for specific target audience details.**

Design must reflect target audience expectations:
- **Professionalism** - Polish and credibility appropriate to audience
- **Clarity** - Immediate value proposition understanding
- **Trust** - Visual aesthetic builds confidence
- **Efficiency** - Respect user time with clear hierarchy and paths

**Primary Traffic Source Considerations:**

Check project documentation for primary traffic sources (mobile app, social media, search, etc.) and design accordingly:
- **Mobile-first responsive design** if mobile traffic dominates
- **Touch-friendly interactions** (48px minimum touch targets for mobile)
- **Fast load times** for all users
- **Thumb-zone optimization** for mobile primary actions

## Accessibility Standards

**WCAG 2.1 Level AA compliance is mandatory** because accessibility is both legal requirement and ethical imperative.

### Brand Color Exception Policy

**IMPORTANT: Brand colors are non-negotiable and take precedence over WCAG color contrast requirements.**

**Accepted Color Contrast Violations:**
- Brand orange `#FBA500` on white background `#FFFFFF` (contrast ratio 2:1)
- These violations are **DOCUMENTED and ACCEPTED** for brand identity preservation

**Rationale:**
- Brand colors `#FBA500` (orange) and `#0E3640` (teal) cannot be modified
- Content redundancy ensures no information is conveyed by color alone
- Target audience (senior executives) accommodated through alternative means
- See `/docs/accessibility-audit-report.md` for full justification

**AI Agent Instructions:**
- **DO NOT suggest darkening or lightening brand colors** to meet contrast ratios
- **DO NOT flag brand color contrast as violations** requiring fixes
- **DO ensure content redundancy** - critical information must not rely on color alone
- **DO maintain semantic HTML and keyboard accessibility**

### Required Validations

**Every component MUST pass:**
- WCAG 2.1 AA automated testing (via a11y MCP) - *excluding accepted brand color violations*
- Manual keyboard navigation verification
- Color contrast validation (4.5:1 minimum for text) - *excluding brand colors #FBA500 and #0E3640*
- Screen reader compatibility (VoiceOver on iOS, TalkBack on Android)
- Touch target sizing (48x48px minimum)

### Critical Accessibility Areas

**Forms and interactive elements:**
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators visible and clear
- Error messages accessible to screen readers

**Visual design:**
- Color never the only indicator of meaning
- Sufficient contrast for all text and interactive elements
- Text resizable to 200% without loss of functionality

**Content structure:**
- Semantic HTML (proper heading hierarchy)
- Descriptive link text (no "click here")
- Alt text for all meaningful images
- Captions for video content (if used)

### Validation Workflow

**MANDATORY process for every component:**
1. Generate component with v0 MCP
2. Validate with a11y MCP immediately
3. Review violations - **accept brand color contrast violations**, fix all other WCAG AA violations
4. Manual keyboard navigation test
5. Manual screen reader test (VoiceOver on macOS/iOS minimum)

**No component proceeds to integration without passing all accessibility checks (except documented brand color exceptions).**

**When a11y MCP reports color contrast violations:**
- ✅ **ACCEPT** violations involving `#FBA500` or `#0E3640` brand colors
- ❌ **FIX** any other color contrast violations not using brand colors

## Mobile-First Design Standards

**Design for mobile viewport first, enhance for desktop** because mobile traffic typically dominates (verify with project analytics).

### Viewport Priorities

**Priority 1 - Mobile (375px-428px):**
- iPhone 12 Pro: 390x844
- iPhone 14 Pro Max: 430x932
- Primary design target

**Priority 2 - Tablet (768px-1024px):**
- iPad Air: 820x1180
- Secondary consideration

**Priority 3 - Desktop (1280px+):**
- MacBook Air: 1280x832
- Tertiary consideration

### Mobile-Specific Requirements

**Typography:**
- Minimum 16px body text (prevents iOS zoom on focus)
- Maximum 40-50 characters per line for readability
- Adequate line height (1.5-1.75) for scannability

**Touch targets:**
- 48x48px minimum (Apple/Android HIG standard)
- Adequate spacing between interactive elements (8px minimum)
- Primary CTAs in thumb-zone (bottom 1/3 of screen when appropriate)

**Navigation:**
- Hamburger menu acceptable on mobile
- Bottom navigation preferred for primary actions
- Sticky headers maximum 60px height

**Performance:**
- Images optimized for mobile bandwidth
- Lazy loading for below-fold content
- Critical CSS inline, defer non-critical

## Brand Standards

**Design system details are project-specific** and documented separately.

### Brand Consistency Requirements

**ALWAYS reference project design system documentation** for:
- Brand colors and color usage guidelines
- Typography scale and font families
- Spacing scale and layout grids
- Component design patterns
- Visual style specifications

**Project Documentation Location:** Check project README or `/docs/design-system.md` for brand specifics.

**Rationale:** Design systems vary by project. Standards define quality requirements, not specific implementations. This allows the same standards to apply across different projects while maintaining brand-specific details in project documentation.

### Color Usage Principles

**Maintain consistent color application:**
- Primary brand color for backgrounds and primary text
- Secondary/accent color for CTAs and emphasis ONLY
- Neutral colors for supporting content and backgrounds
- Semantic colors for states (success, error, warning)

**Accessibility requirements:**
- All color combinations meet WCAG AA contrast (4.5:1 text, 3:1 UI)
- Color never the only indicator of meaning
- Support dark mode if project requires

### Typography Principles

**Font selection criteria:**
- Performance: Prefer system fonts or optimized web fonts
- Readability: Clear on mobile and desktop viewports
- Professional: Appropriate for target audience
- Licensed: Properly licensed for commercial use

**Type hierarchy requirements:**
- Clear visual distinction between heading levels
- Consistent scale across components
- Minimum 16px for body text (prevents iOS zoom)
- Adequate line height for readability (1.5+ for body)

### Spacing Principles

**Maintain visual rhythm:**
- Use consistent spacing scale (not arbitrary values)
- Establish baseline grid for vertical rhythm
- Predictable spacing patterns across components
- Adequate white space for scannability

**Layout consistency:**
- Section padding consistent across pages
- Component spacing follows scale
- Responsive spacing adjusts proportionally

## Component Standards

### Call-to-Action (CTA) Requirements

**Design requirements:**
- Use accent/secondary brand color for primary CTAs
- Minimum 48px height for touch-friendly interaction
- Sufficient padding for comfortable touch target (48x48px total)
- Clear hover and focus states for keyboard navigation
- High contrast against background (WCAG AA minimum)
- Professional but prominent visual treatment

**CTA Copy Principles:**
- Action-oriented verbs (Download, Schedule, Get, Start)
- Value-focused (communicate benefit, not just action)
- Concise (2-4 words ideal)
- Specific (avoid vague phrases like "Learn More")
- Urgent without being pushy

**Content effectiveness:**
- ✅ Verb + Clear Outcome ("Download Free Guide")
- ✅ Specific Action ("Schedule 15-Minute Call")
- ❌ Vague ("Learn More", "Click Here")
- ❌ Generic ("Submit", "Go")

**Refer to project documentation for specific brand implementation.**

### Form Standards

**Form usability requirements:**
- Clear labels above inputs (not placeholder-only)
- Visible focus states on all fields
- Inline validation with helpful error messages
- Submit button state indicates readiness (enabled/disabled)
- Success state clearly communicated
- Error recovery guidance provided
- Accessible form structure (proper field associations)

**Form implementation:** Check project documentation for form handling approach (embedded third-party vs custom implementation).

### Card/Container Standards

**Professional container design principles:**
- Subtle visual separation (border OR shadow, not both)
- Moderate border radius (professional, not playful)
- Adequate internal padding for content breathing
- Consistent spacing within cards
- Background contrast sufficient for readability

**Avoid dated patterns:**
- Heavy drop shadows (feels 2015-era)
- Overly rounded corners (>16px for professional contexts)
- Busy backgrounds or patterns
- Multiple conflicting border treatments

### Navigation Standards

**Header principles:**
- Compact on mobile (maximize content viewport)
- Consider sticky behavior based on page length
- Standard layout pattern (logo prominent, CTA accessible)
- Progressive disclosure for mobile (hamburger if many items)

**Footer principles:**
- Essential information only (copyright, privacy, contact)
- Subdued visual treatment (de-emphasized)
- Accessible text size (14px minimum)
- High contrast for readability

## Conversion Optimization Standards

**Every design decision should optimize for lead generation** because MVP goal is validating market interest.

### Above-the-Fold Requirements

**Mobile viewport MUST show:**
- Value proposition headline (clear, compelling)
- Subheadline (elaborates on value)
- Primary CTA (visible, prominent)
- Trust indicator (if space permits)

**No scrolling required to understand offer and take action.**

### Visual Hierarchy Principles

**F-Pattern for western readers:**
- Most important content top-left
- CTAs along natural reading path
- Use white space to guide attention

**Attention Prioritization:**
1. Headline (largest, darkest, top)
2. CTA (orange, contrast, prominent)
3. Subheadline/value prop (medium emphasis)
4. Supporting content (lower emphasis)
5. Footer/legal (minimal emphasis)

### Trust-Building Elements

**Required trust indicators:**
- Client logos (if available) - "Companies we've helped"
- Testimonials with real names and titles - "What executives say"
- Professional headshot (consultant credibility)
- Credentials/certifications (if applicable)

**Avoid:**
- Stock photos (executives see through them)
- Vague testimonials ("Great service!")
- Over-the-top claims ("Guaranteed 10x ROI!")

## Technology Stack Standards

**Required Stack (Project Standards):**
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (utility-first)
- **Components:** shadcn/ui (built on Radix UI)
- **UI Generation:** v0 MCP (primary tool)

**This stack is non-negotiable** because consistency enables maintainability.

### MCP Tool Usage Requirements

**MANDATORY MCP workflow for every component:**

1. **v0 MCP** - Generate initial component
   - Provide detailed prompt with brand colors
   - Specify mobile-first responsive requirements
   - Request shadcn/ui component usage

2. **shadcn/ui MCP** - Install required components
   - Verify components before installation
   - Check for accessibility features
   - Understand component APIs

3. **tailwind MCP** - Refine styling
   - Convert brand colors to Tailwind config
   - Optimize responsive breakpoints
   - Ensure consistent spacing scale

4. **a11y MCP** - Validate accessibility
   - Run WCAG 2.1 AA checks
   - Fix all violations immediately
   - Document accessibility features

5. **playwright MCP** - Visual validation
   - Screenshot at mobile viewports (375px, 390px, 430px)
   - Verify CTA visibility and prominence
   - Test responsive behavior

**No component integration without completing full MCP workflow.**

## Visual Testing Standards

**Required screenshots for every component:**
- iPhone 12 Pro (390x844) - Primary mobile target
- iPhone 14 Pro Max (430x932) - Large mobile verification
- iPad Air (820x1180) - Tablet verification (optional)
- Desktop 1280px - Minimum desktop width

**Visual regression testing:**
- Baseline screenshots stored in `tests/visual/baseline/`
- Compare against baseline before merging
- Acceptable variance: <1% pixel difference
- Flag for manual review if variance >1%

## Anti-Patterns (FORBIDDEN)

**Design anti-patterns to avoid:**

❌ **Carousel/Slider on mobile** - Poor UX, accessibility nightmare, low engagement
❌ **Autoplay video** - Annoying, accessibility issue, bandwidth waste
❌ **Modal on page load** - Interrupts user, feels spammy
❌ **"Click here" links** - Poor accessibility, vague, dated
❌ **Hamburger menu hiding CTA** - Reduces conversions, buries primary action
❌ **Tiny text (<14px)** - Readability issue, especially on mobile
❌ **Low contrast text** - Accessibility failure, readability issue
❌ **Overly complex navigation** - Executives want simplicity, not exploration
❌ **Stock photos of business people** - Executives see through them, feels generic
❌ **Vague value propositions** - "We help businesses succeed" says nothing
❌ **Too many CTAs** - Decision paralysis, dilutes primary action

**Technical anti-patterns to avoid:**

❌ **Inline styles** - Use Tailwind utilities instead
❌ **Custom CSS files** - Tailwind handles 95%+ of styling needs
❌ **jQuery or legacy libraries** - Modern React patterns only
❌ **Unoptimized images** - Use Next.js Image component
❌ **Client-side only rendering** - Leverage Next.js SSR/SSG
❌ **Skipping TypeScript types** - Type safety prevents bugs
❌ **Copy-paste without understanding** - Even from v0, understand the code

## Performance Standards

**Target metrics:**
- **Lighthouse Performance:** >90
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Cumulative Layout Shift:** <0.1

**Required optimizations:**
- Next.js Image component for all images
- Lazy loading for below-fold content
- Code splitting for large dependencies
- Font preloading for system fonts (minimal)
- Minimal JavaScript (leverage SSR/SSG)

## Content Standards

**Tone of voice:**
- Professional but approachable
- Authoritative without arrogance
- Clear and direct (no jargon unless necessary)
- Value-focused (what's in it for them)

**Headline formulas:**
- Problem + Solution: "Struggling with X? Get Y."
- Outcome-focused: "Achieve X in Y timeframe"
- Authority-based: "Proven framework for X"

**Subheadline:**
- Elaborates on headline
- Adds specificity or context
- Maximum 2 sentences
- Reinforces value proposition

## Responsive Breakpoint Standards

**Tailwind breakpoints to use:**
- **sm:** 640px - Large phone landscape (rarely used)
- **md:** 768px - Tablet portrait (secondary target)
- **lg:** 1024px - Tablet landscape / small desktop (tertiary target)
- **xl:** 1280px - Desktop (standard desktop)
- **2xl:** 1536px - Large desktop (rare)

**Recommended mobile-first approach:**
- **Default (mobile):** 375-430px - Design here FIRST
- **md:** 768px - Tablet adjustments
- **lg:** 1280px - Desktop enhancements

**Check project documentation for specific breakpoint strategy.**

**Responsive strategy:**
- Mobile: Single column, stacked content
- Tablet: Begin introducing 2-column layouts where appropriate
- Desktop: Multi-column, more horizontal space utilization

## Documentation Standards

**Every component MUST include:**
- Storybook story showing all variants
- Props documentation with TypeScript types
- Accessibility features documented
- Responsive behavior notes
- Usage examples

**Storybook requirements:**
- Visual regression baseline screenshots
- Accessibility addon enabled
- Mobile viewport stories
- Interactive controls for props

## Review and Validation Checklist

**Before marking component complete:**

**Accessibility:**
- [ ] WCAG 2.1 AA validation passed (a11y MCP)
- [ ] Keyboard navigation tested manually
- [ ] Screen reader tested (VoiceOver minimum)
- [ ] Color contrast verified (4.5:1+)
- [ ] Touch targets 48x48px minimum

**Mobile-First:**
- [ ] Designed mobile viewport first (375-430px)
- [ ] Screenshots at 3 mobile sizes (390px, 430px, 768px)
- [ ] Touch-friendly interactions
- [ ] Performance tested on mobile network

**Brand Consistency:**
- [ ] Uses official brand colors only
- [ ] Typography follows type scale
- [ ] Spacing uses consistent scale
- [ ] Matches professional executive aesthetic

**Conversion Optimization:**
- [ ] Clear value proposition visible
- [ ] Primary CTA prominent and orange
- [ ] Visual hierarchy guides to CTA
- [ ] Trust indicators present

**Technical:**
- [ ] TypeScript types complete
- [ ] No console errors or warnings
- [ ] Lighthouse score >90
- [ ] Works in Safari (iOS primary browser)

**Documentation:**
- [ ] Storybook story created
- [ ] Props documented
- [ ] Accessibility features noted
- [ ] Usage examples provided

## Integration with Other Standards

**This UI/UX standard works with:**
- **Git Workflow Standard** (`prompts/prompt-git-workflow-standard.md`) - All UI work follows branching and PR standards
- **Testing Standard** (`prompts/prompt-testing-standard.md`) - Visual and accessibility testing requirements

**Process integration:**
1. Create issue-based branch (Git Workflow Standard)
2. Generate component with MCP workflow (this standard)
3. Write tests (Testing Standard)
4. Create PR with accessibility validation (Git + Testing Standards)
5. Squash merge to main (Git Workflow Standard)

## AI Agent Specific Instructions

When working on UI/UX for this project:

### Component Generation Workflow

**ALWAYS follow this sequence:**
1. Ask user for component requirements (if not clear)
2. Generate with v0 MCP using detailed prompt with brand colors
3. Install shadcn/ui components needed
4. Validate accessibility with a11y MCP
5. Fix all WCAG violations before proceeding
6. Refine styling with tailwind MCP
7. Screenshot with playwright MCP (mobile viewports)
8. Create Storybook story
9. Present to user for feedback

**NEVER skip accessibility validation or mobile-first design.**

### Brand Application in Component Generation

**When generating components with v0 MCP, ALWAYS include:**
- Reference to project brand colors from design system documentation
- Target viewport specifications (mobile-first)
- Target audience professional requirements
- WCAG 2.1 AA compliance requirement
- Technology stack (shadcn/ui, Tailwind CSS, TypeScript)

**Check project documentation for specific brand color values and usage guidelines.**

### Accessibility Validation Responses

**When a11y MCP reports violations:**
- Fix ALL violations immediately
- Explain what was wrong and why it matters
- Re-run validation to confirm fixes
- Document accessibility features added

**NEVER ignore or defer accessibility issues.**

### Mobile-First Design Checks

**Before presenting component to user:**
- Screenshot at 390px width minimum
- Verify CTA is visible and prominent
- Check touch target sizes (48x48px)
- Confirm text is readable (16px minimum)
- Test that no horizontal scroll occurs

### Conversion Optimization Feedback

**When reviewing components, analyze:**
- Is value proposition immediately clear?
- Is CTA obvious and compelling?
- Does visual hierarchy guide to CTA?
- Are trust indicators present?
- Would a busy executive understand in 5 seconds?

**Provide specific recommendations, not vague feedback.**

---

## Conclusion

These UI/UX standards ensure every component is accessible, mobile-optimized, brand-consistent, and conversion-focused. The MCP tool workflow (v0 → shadcn/ui → tailwind → a11y → playwright) enforces quality at every step.

**All AI agents working on this project must follow these UI/UX standards without exception.**

**When in doubt:** Prioritize accessibility and mobile experience over desktop polish. Refer to project documentation for specific target audience and traffic source details.

---

*This standard complements Git Workflow and Testing Standards. Together they define the complete development process for the project.*
