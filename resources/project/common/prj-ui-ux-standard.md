---
marr: standard
version: 1
title: UI/UX Development Standard
scope: All UI/UX development including component generation and design decisions

triggers:
  - WHEN creating or modifying UI components or layouts
  - WHEN making visual design or styling decisions
  - WHEN implementing user interactions, forms, or navigation
  - WHEN evaluating accessibility or usability
---

# UI/UX Development Standard

> **AI Agent Instructions**: This document defines UI/UX development standards. Follow these rules for all component generation, design decisions, and user interface work.

---

## Core Rules (NEVER VIOLATE)

1. **Always prioritize accessibility** because legal compliance and usability are non-negotiable
2. **Always use mobile-first design** because mobile traffic dominates modern web usage
3. **Always validate with accessibility tools** because automated validation catches issues early
4. **Always maintain brand consistency** because professional appearance builds user trust
5. **Always optimize for conversion** because business goals require measurable outcomes

---

## Accessibility Standards

**WCAG 2.1 Level AA compliance is mandatory.**

### Required Validations

Every component MUST pass:
- WCAG 2.1 AA automated testing
- Manual keyboard navigation verification
- Colour contrast validation (4.5:1 minimum for text)
- Screen reader compatibility testing
- Touch target sizing (48x48px minimum)

### Critical Accessibility Areas

**Forms and interactive elements:**
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators visible and clear
- Error messages accessible to screen readers

**Visual design:**
- Colour never the only indicator of meaning
- Sufficient contrast for all text and interactive elements
- Text resizable to 200% without loss of functionality

**Content structure:**
- Semantic HTML (proper heading hierarchy)
- Descriptive link text (no "click here")
- Alt text for all meaningful images

---

## Mobile-First Design Standards

**Design for mobile viewport first, enhance for desktop.**

### Viewport Priorities

1. **Mobile (375px-430px)** — Primary design target
2. **Tablet (768px-1024px)** — Secondary consideration
3. **Desktop (1280px+)** — Tertiary consideration

### Mobile-Specific Requirements

**Typography:**
- Minimum 16px body text (prevents iOS zoom on focus)
- Maximum 40-50 characters per line for readability
- Adequate line height (1.5-1.75) for scannability

**Touch targets:**
- 48x48px minimum (Apple/Android HIG standard)
- Adequate spacing between interactive elements (8px minimum)
- Primary CTAs in thumb-zone when appropriate

**Navigation:**
- Hamburger menu acceptable on mobile
- Bottom navigation preferred for primary actions
- Sticky headers maximum 60px height

---

## Component Standards

### Call-to-Action (CTA) Requirements

**Design requirements:**
- Minimum 48px height for touch-friendly interaction
- Clear hover and focus states for keyboard navigation
- High contrast against background (WCAG AA minimum)
- Professional but prominent visual treatment

**CTA Copy Principles:**
- Action-oriented verbs (Download, Schedule, Get, Start)
- Value-focused (communicate benefit, not just action)
- Concise (2-4 words ideal)
- Specific (avoid vague phrases like "Learn More")

### Form Standards

**Form usability requirements:**
- Clear labels above inputs (not placeholder-only)
- Visible focus states on all fields
- Inline validation with helpful error messages
- Submit button state indicates readiness
- Error recovery guidance provided
- Accessible form structure (proper field associations)

### Card/Container Standards

**Professional container design:**
- Subtle visual separation (border OR shadow, not both)
- Moderate border radius (professional, not playful)
- Adequate internal padding
- Consistent spacing within cards

---

## Conversion Optimization Standards

### Above-the-Fold Requirements

**Mobile viewport MUST show:**
- Value proposition headline (clear, compelling)
- Subheadline (elaborates on value)
- Primary CTA (visible, prominent)
- Trust indicator (if space permits)

**No scrolling required to understand offer and take action.**

### Visual Hierarchy Principles

**Attention Prioritization:**
1. Headline (largest, most prominent, top)
2. CTA (accent colour, contrast, prominent)
3. Subheadline/value prop (medium emphasis)
4. Supporting content (lower emphasis)
5. Footer/legal (minimal emphasis)

---

## Performance Standards

**Target metrics:**
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

**Required optimizations:**
- Optimized images (use framework Image components)
- Lazy loading for below-fold content
- Code splitting for large dependencies
- Font optimization (preload, subset)

---

## Anti-Patterns (FORBIDDEN)

**Design anti-patterns:**
- **Carousel/Slider on mobile** — Poor UX, accessibility issues, low engagement
- **Autoplay video** — Annoying, accessibility issue, bandwidth waste
- **Modal on page load** — Interrupts user, feels spammy
- **"Click here" links** — Poor accessibility, vague, dated
- **Hamburger menu hiding CTA** — Reduces conversions
- **Tiny text (<14px)** — Readability issue on mobile
- **Low contrast text** — Accessibility failure
- **Generic stock photos** — Users see through them
- **Vague value propositions** — "We help businesses succeed" says nothing
- **Too many CTAs** — Decision paralysis, dilutes primary action

**Technical anti-patterns:**
- **Skipping accessibility validation** — Every component must pass a11y checks
- **Desktop-first design** — Always start with mobile
- **Unoptimized images** — Use framework optimization
- **Ignoring keyboard navigation** — All interactions must be keyboard accessible

---

## Review Checklist

**Before marking component complete:**

**Accessibility:**
- [ ] WCAG 2.1 AA validation passed
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Colour contrast verified (4.5:1+)
- [ ] Touch targets 48x48px minimum

**Mobile-First:**
- [ ] Designed mobile viewport first
- [ ] Touch-friendly interactions
- [ ] Performance tested

**Conversion:**
- [ ] Clear value proposition visible
- [ ] Primary CTA prominent
- [ ] Visual hierarchy guides to CTA

---

**This UI/UX standard ensures every component is accessible, mobile-optimized, brand-consistent, and conversion-focused.**
