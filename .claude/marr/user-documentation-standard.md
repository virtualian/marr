# Documentation Standard

> **AI Agent Instructions**: This document defines documentation standards that apply universally across all projects. Follow these rules exactly for all documentation work.
>
> **Scope**: User-level standard (applies to all projects)
>
> **Rationale**: Systematic documentation standards ensure content serves user needs effectively, maintains accuracy, and remains discoverable.

---

## Core Rules (NEVER VIOLATE)

1. **Content MUST fit into exactly one Diataxis type** because clear classification ensures content serves its intended purpose
2. **Content types MUST NOT collapse into each other** because mixed-purpose content confuses users
3. **Documentation MUST maintain parity with code** because outdated documentation misleads users
4. **Multi-role projects MUST use role-first organization** because users identify by role before seeking content type
5. **Documentation MUST be organized by user need, not internal structure** because users think in terms of their problems, not your architecture

---

## Content Classification: Diataxis Framework

All content MUST fit into exactly **one** of four documentation types. The framework organizes documentation around user needs across two fundamental axes:

- **Acquisition ↔ Application** (studying to learn vs. working to accomplish tasks)
- **Action ↔ Cognition** (practical "knowing how" vs. theoretical "knowing that")

### 1. Tutorials (Learning-Oriented, Practical)

**Purpose:** Take beginners through hands-on learning experiences with guaranteed successful outcomes.

**Characteristics:**
- Provides concrete lessons that teach through action
- Focuses on skill acquisition, not task completion
- Guides users step-by-step through a learning journey
- Ensures success at every stage
- Avoids explanation—save theory for later

**Mandatory Elements:**
- Uses imperative mood: "Create a file", "Run the command"
- Provides complete, working examples
- Every step tested to ensure reproducibility
- Reaches the "aha moment" within 3-5 minutes
- Eliminates every non-essential element
- Maintains supportive teacher tone: "We'll create...", "Next, you'll..."

**When to Use:**
- User is learning the system for the first time
- Teaching fundamental skills users will build upon
- User needs confidence through successful completion

**When NOT to Use:**
- User already knows what they want to accomplish → How-To Guide
- User needs to understand concepts, not perform tasks → Explanation

**Applicability Note:** Projects serving experienced technical audiences MAY omit tutorials if users don't need learning exercises.

---

### 2. How-To Guides (Problem-Oriented, Practical)

**Purpose:** Provide recipes that help competent users accomplish specific real-world tasks.

**Characteristics:**
- Solves a particular problem the user has chosen to tackle
- Assumes user competence—no teaching required
- Focuses on practical steps to achieve the goal
- Provides a reliable recipe to follow
- Can describe multiple approaches to the same problem

**Mandatory Elements:**
- Title states the exact problem: "How to configure dark mode", "How to add search"
- Starts with problem context briefly, then gets straight to solution
- Uses numbered steps for procedures
- Provides necessary context without detailed explanations
- Links to reference documentation for technical details
- Links to explanations for conceptual background
- Maintains colleague-offering-recipe tone: "Configure...", "Add..."

**When to Use:**
- User has a specific problem to solve
- User already understands the domain
- User needs a reliable solution path

**When NOT to Use:**
- User is learning for the first time → Tutorial
- User needs technical specifications → Reference
- User needs to understand why → Explanation

---

### 3. Reference (Information-Oriented, Theoretical)

**Purpose:** Provide technical descriptions of how the system works.

**Characteristics:**
- Describes the machinery and how to operate it
- Structured around the code or product architecture
- Provides accurate, comprehensive information
- Uses consistent structure and formatting
- Optimized for lookup, not reading cover-to-cover

**Mandatory Elements:**
- Austere—states facts without elaboration
- Consistent structure across similar items
- Provides examples to illustrate usage, not teach concepts
- Accurate and complete
- Avoids explaining concepts—links to explanation content instead
- Supports deep linking with clear hierarchies
- Maintains technical manual tone: "The `timeout` parameter specifies..."

**When to Use:**
- User needs technical specifications
- User is looking up specific parameters or options
- User needs authoritative information about capabilities

**When NOT to Use:**
- User needs to solve a problem → How-To Guide
- User needs to understand concepts → Explanation
- User is learning the system → Tutorial

---

### 4. Explanation (Understanding-Oriented, Theoretical)

**Purpose:** Clarify and illuminate topics, providing understanding and context.

**Characteristics:**
- Discusses concepts, design decisions, historical context
- Addresses the "why" behind implementations
- Explores alternatives and trade-offs
- Connects ideas across the system
- Broadens the reader's understanding

**Mandatory Elements:**
- Provides context and background
- Explains design decisions and their rationale
- Discusses alternatives considered
- Connects to broader concepts
- Uses analogies and examples to illuminate ideas
- NO instructions—this is about understanding, not action
- Maintains subject matter expert tone: "This design emerged because..."

**When to Use:**
- User needs to understand "why" something works a certain way
- User needs conceptual background
- User wants to understand design decisions and trade-offs

**When NOT to Use:**
- User needs to perform a task → Tutorial or How-To Guide
- User needs technical specifications → Reference

---

## Audience Targeting: Role-First Organization

Projects serving multiple distinct user roles with significantly different needs, skill levels, or use cases MUST use role-first organization.

### When Role-First Organization is MANDATORY

**MUST use role-first organization when:**
- Project serves 2+ distinct user roles (e.g., Administrator, User, Power User)
- Roles have significantly different skill levels
- Roles have different use cases or goals
- Content complexity varies substantially by role

**MAY use Diataxis-first organization when:**
- Project serves a single user role
- All users have similar skill levels and needs
- Content complexity is relatively uniform

**Rationale:** Users think "I'm an administrator" before they think "I need a how-to guide." Role-first navigation reduces cognitive load and gets users to relevant content faster.

---

### Role Definition Requirements

When using role-first organization, projects MUST define roles clearly:

**Each role definition MUST include:**
- **Who:** Description of person in this role
- **Content Needs:** What types of content this role requires
- **Skill Level:** Expected technical competence
- **Use Cases:** Primary goals and tasks

**Common Role Patterns (adapt to your project):**

#### Administrator
- Person responsible for setup, configuration, maintenance
- Needs: Comprehensive guides, troubleshooting, complete reference, deep explanations
- Skill: High technical competence expected
- Use Cases: System installation, configuration, operations

#### User
- Person performing standard tasks with the system
- Needs: Getting started guides, common task how-tos, basic reference
- Skill: Moderate technical competence
- Use Cases: Daily usage, common workflows

#### Power User
- Person performing advanced tasks, experimentation, customization
- Needs: Advanced guides, development how-tos, advanced reference, internals explanations
- Skill: Very high technical competence
- Use Cases: Experimentation, development, advanced customization

**Projects MUST define their own roles based on actual user base.** These are examples, not requirements.

---

### Progressive Disclosure by Role

Content complexity MUST match role expectations:

**User Role:**
- Simple, streamlined content
- Focus on 80% use case
- Hide complexity
- Assume moderate technical competence

**Administrator Role:**
- Comprehensive content
- Include edge cases, troubleshooting, advanced configuration
- Assume high technical competence

**Power User Role:**
- Advanced content
- Assume deep understanding
- Include experimental features, development guidance
- Assume very high technical competence

---

### Navigation Architecture

**For role-first projects:**
- Top-level navigation MUST present user roles as distinct items
- Diataxis content types MUST appear as subsections within each role
- Each role MUST have a landing page explaining what users will find

**For Diataxis-first projects:**
- Top-level navigation MUST present content types (Tutorial, How-To, Reference, Explanation)
- Content organized directly by type

---

## The Collapse Problem

Documentation naturally wants to blur boundaries between types. **This MUST be resisted.**

### Warning Signs of Collapse

**Detect collapse when:**
- Tutorials digress into advanced techniques before teaching basics
- How-to guides explain concepts at length instead of solving problems
- Reference material teaches rather than describes
- Explanation content includes step-by-step instructions

### Fix for Collapsed Content

**When collapse is detected:**

1. Ask two questions about the content:
   - Is this **action** (practical) or **cognition** (theoretical)?
   - Is this **acquisition** (study/learning) or **application** (work/problem-solving)?

2. The answers reveal where content belongs

3. Split collapsed content into separate pieces for appropriate quadrants

**Example:**
- How-to guide with lengthy explanation → Split into "How to X" (how-to) + "Why X works this way" (explanation)
- Tutorial with advanced edge cases → Keep basic tutorial, create "Advanced X techniques" (how-to)

---

## Documentation-Code Parity

For projects where users interact through scripts, CLIs, or APIs, documentation MUST maintain strict parity with code.

### Mandatory Update Protocol

**When modifying code, documentation MUST be updated in the same commit for:**
- New command-line options or parameters
- Changed default behavior
- New output formats or report types
- Modified algorithms or detection methods
- New dependencies or requirements
- Changed file locations or names
- New error messages or exit codes
- Performance improvements with measurable impact

**Updates MAY be deferred for:**
- Code comments only
- Internal variable name changes
- Pure refactoring with no behavioral changes

### Pre-Commit Documentation Checklist

Before committing code changes:
- [ ] Corresponding documentation files updated
- [ ] Code examples in documentation tested
- [ ] Cross-references verified
- [ ] Performance characteristics updated if changed
- [ ] Navigation updated if structure changed
- [ ] Commit message mentions documentation updates

**Rationale:** Outdated documentation actively misleads users. For CLI tools and APIs, documentation is the primary user interface.

---

## Cross-Referencing Requirements

Links between documentation types MUST follow appropriate patterns:

**MUST link as follows:**
- **How-to guides → Reference:** For technical details about parameters, options, APIs
- **Tutorials → Explanation:** For deeper understanding after completing hands-on experience
- **Reference → Explanation:** For conceptual background about why things work a certain way
- **Explanation → Reference:** For technical specifications of concepts being discussed

**MUST NOT:**
- Create circular explanations where content keeps pointing elsewhere without providing value
- Link between same content types unless providing alternative approaches
- Link to content that duplicates what's in the current document

---

## External Documentation References

When referencing external authoritative documentation:

### When to Reference External Documentation

**MUST reference external docs for:**
- Authoritative specifications maintained by other organizations
- Official version information and release notes
- Known issues lists from official sources
- Official product capabilities not specific to your integration

**MUST maintain internal documentation for:**
- Integration guides specific to your system
- Practical implementation guidance
- Troubleshooting integration-specific issues
- Configuration specific to your use cases
- Use-case specific workflows
- Operational procedures

### How to Add External References

**MUST place references at section level, not inline within procedures** because section-level placement avoids disrupting workflows.

**MUST use consistent format:**
```markdown
For official specifications, see [Authority Documentation](https://example.com/docs).
```

**After reference, MUST continue with project-specific content:**
```markdown
### Practical Implementation

Beyond the official specs, consider these project-specific points:
- [Your documentation continues...]
```

### External Reference Best Practices

**MUST ensure link stability:**
- Reference only stable, top-level pages
- Avoid deep links to specific sections that may reorganize
- Test external links before committing

**MUST clearly state scope:**
- Explicitly state what your documentation focuses on
- Make clear distinction: "See [Authority] for X. This documentation provides Y."

---

## Voice and Tone by Content Type

Content MUST use appropriate voice for its type:

- **Tutorials:** Supportive teacher—"We'll create...", "Next, you'll...", "Let's build..."
- **How-to guides:** Colleague offering a recipe—"Configure...", "Add...", "To solve this..."
- **Reference:** Technical manual—"The `timeout` parameter specifies...", "Returns...", "Accepts..."
- **Explanation:** Subject matter expert—"This design emerged because...", "The key insight...", "Consider..."

---

## Writing Style Requirements

All documentation MUST follow these writing conventions:

- Use present tense
- Use active voice
- Be concise—respect the reader's time
- Use concrete examples
- Define terms on first use
- Avoid jargon where plain language suffices
- Write for international audience (avoid idioms and cultural references)

---

## Code Examples by Content Type

### In Tutorials

**MUST:**
- Provide complete, working code
- Test every example to ensure it works
- Use realistic but simple examples
- Build incrementally—each step adds one concept
- Include expected output

### In How-To Guides

**MUST:**
- Show minimal code needed to solve the problem
- Focus on the solution, not teaching concepts
- Provide complete examples when necessary for clarity
- Can show multiple approaches

### In Reference

**MUST:**
- Illustrate syntax and usage
- Keep examples minimal and focused
- Show return values and side effects
- Document edge cases

### In Explanation

**MUST:**
- Use code to illustrate concepts, not provide instructions
- Examples can be pseudocode or conceptual
- Focus on the "why" not the "how"

---

## Validation Requirements

Before documentation is considered complete, it MUST pass validation:

### Structural Validation

- [ ] Content fits clearly into one Diataxis quadrant
- [ ] File is in correct directory for its type and role (if applicable)
- [ ] Navigation entry exists
- [ ] Cross-references link appropriately to other quadrants
- [ ] No collapse—content doesn't mix documentation types

### Content Validation

- [ ] Title clearly indicates content type and topic
- [ ] Opening paragraph establishes purpose and audience
- [ ] Content maintains consistent voice for its type
- [ ] Code examples are tested and work
- [ ] Length is appropriate for type

### Technical Validation

- [ ] All internal links work
- [ ] All external links tested and valid
- [ ] Code blocks specify language for syntax highlighting
- [ ] Headers follow logical hierarchy (no skipped levels)

### Accessibility Validation

- [ ] Link text is descriptive (not "click here")
- [ ] Images have meaningful alt text
- [ ] Color is not the only means of conveying information
- [ ] Headers create logical document outline

---

## Quick Reference: "Which Quadrant?"

When determining content type, ask:

- Am I teaching someone to do something for the first time? → **Tutorial**
- Am I helping someone solve a specific problem they already have? → **How-To Guide**
- Am I describing how something works or what it does? → **Reference**
- Am I explaining why something is the way it is? → **Explanation**

**When in doubt:** If it includes step-by-step instructions, it's either Tutorial or How-To. If the user already knows what they want to accomplish, it's How-To. If they're learning a new skill, it's Tutorial.

---

## Anti-Patterns (FORBIDDEN)

### Content Type Violations

❌ **Tutorials that explain too much** - Cut explanation ruthlessly. Users learn by doing. Link to explanation content for those who want deeper understanding.

❌ **How-to guides that teach concepts** - Assume competence. Provide just enough context, then jump to the solution.

❌ **Reference that wanders into explanation** - State facts only. Move "when to use this" to how-to guides, "why it works this way" to explanations.

❌ **Explanation with step-by-step instructions** - Remove instructions. If steps are necessary, create a tutorial or how-to guide.

### Organization Violations

❌ **Organizing by internal structure** - Documentation organized around your codebase structure instead of user needs.

❌ **Single-document collapse** - Mixing tutorials, how-tos, reference, and explanation in one document.

❌ **Wrong role targeting** - Administrator content in user section, or vice versa.

### Maintenance Violations

❌ **Outdated code examples** - Examples that don't work with current version.

❌ **Broken cross-references** - Links to moved or deleted content.

❌ **Undocumented changes** - Code changes without corresponding documentation updates.

---

## Integration with Other Standards

**Git Workflow:**
- Documentation updates MUST be included in the same commit as code changes
- Commit messages MUST mention documentation updates when applicable

**Testing:**
- Code examples in documentation MUST be tested
- Documentation validation MUST be part of quality gates

---

## Summary: Quick Reference

### Content Classification (Always)
1. ✅ Tutorials - Learning through hands-on experience
2. ✅ How-To Guides - Solving specific problems
3. ✅ Reference - Technical descriptions
4. ✅ Explanation - Understanding concepts

### Audience Targeting (When Applicable)
- ✅ Define clear user roles
- ✅ Organize by role first when serving multiple audiences
- ✅ Progressive disclosure by role complexity

### Quality Requirements (Always)
- ✅ No content type collapse
- ✅ Appropriate voice for content type
- ✅ Documentation-code parity
- ✅ Cross-reference appropriately
- ✅ Validate before commit

---

**This documentation standard ensures content serves user needs effectively, maintains accuracy, and remains discoverable across all projects.**
