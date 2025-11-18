# Documentation Standards: AI Agent Guidelines

This document provides standards for creating documentation that uses the **MkDocs + Material + Diataxis** stack. All documentation must follow these standards to ensure consistency, quality, and proper implementation of the Diataxis framework.

## Documentation Framework: Diataxis

All content must fit into exactly **one** of the documentation types below. The framework organizes documentation around user needs across two fundamental axes:
- **Acquisition ↔ Application** (studying to learn vs. working to accomplish tasks)
- **Action ↔ Cognition** (practical "knowing how" vs. theoretical "knowing that")

**Note on Content Types:** Projects serving technical audiences may use **three** of the four Diataxis types: How-To Guides, Reference, and Explanation. Tutorials may not be applicable for experienced technical users. See "Role-First Navigation" section below for implementation details.

### 1. Tutorials (Learning-Oriented, Practical)

> **⚠️ MAY NOT BE APPLICABLE FOR TECHNICAL AUDIENCES**
>
> Projects serving experienced technical users may omit tutorials and focus on **How-To Guides, Reference, and Explanation** only.
> Technical users typically need practical solutions and deep understanding, not learning exercises.
> This section is retained for projects that do serve beginners or learning-oriented audiences.

**Purpose:** Take beginners through hands-on learning experiences with guaranteed successful outcomes.

**Characteristics:**
- Provides concrete lessons that teach through action
- Focuses on skill acquisition, not task completion
- Guides users step-by-step through a learning journey
- Ensures success at every stage
- Avoids explanation—save theory for later

**Writing guidelines:**
- Use imperative mood: "Create a file", "Run the command"
- Provide complete, working examples
- Test every step to ensure reproducibility
- Reach the "aha moment" within 3-5 minutes
- Eliminate every non-essential element
- Maintain supportive teacher tone: "We'll create...", "Next, you'll..."

**Example content:** "Your First Documentation Site", "Building a Basic Tutorial"

### 2. How-To Guides (Problem-Oriented, Practical)

**Purpose:** Provide recipes that help competent users accomplish specific real-world tasks.

**Characteristics:**
- Solves a particular problem the user has chosen to tackle
- Assumes user competence—no teaching required
- Focuses on practical steps to achieve the goal
- Provides a reliable recipe to follow
- Can describe multiple approaches to the same problem

**Writing guidelines:**
- Title with the exact problem: "How to configure dark mode", "How to add search highlighting"
- Start with the problem context briefly, then get straight to the solution
- Use numbered steps for procedures
- Provide necessary context, but avoid detailed explanations
- Link to reference documentation for technical details
- Link to explanations for conceptual background
- Maintain colleague-offering-recipe tone: "Configure...", "Add..."

**Critical technique—The Awkward How-To Test:** If a how-to guide feels difficult to write or requires excessive steps, this often indicates a product design issue rather than a documentation problem. Document these discoveries as they provide valuable product improvement feedback.

**Critical technique—Phantom Links:** When writing how-to guides, create links to reference documentation that doesn't exist yet. These phantom links naturally blueprint what reference content users actually need.

**Example content:** "How to Enable Multi-Language Support", "How to Customize the Navigation Bar"

### 3. Reference (Information-Oriented, Theoretical)

**Purpose:** Provide technical descriptions of how the system works.

**Characteristics:**
- Describes the machinery and how to operate it
- Structured around the code or product architecture
- Provides accurate, comprehensive information
- Uses consistent structure and formatting
- Optimized for lookup, not reading cover-to-cover

**Writing guidelines:**
- Be austere—state facts without elaboration
- Use consistent structure across similar items
- Provide examples to illustrate usage, not teach concepts
- Be accurate and complete
- Avoid explaining concepts—link to explanation content instead
- Support deep linking with clear hierarchies
- Maintain technical manual tone: "The `timeout` parameter specifies..."

**Auto-generation:** For API documentation, use mkdocstrings to auto-generate from code docstrings. Maintain synchronization between code and documentation.

**Example content:** "Configuration Options Reference", "API Specification", "CLI Command Reference"

### 4. Explanation (Understanding-Oriented, Theoretical)

**Purpose:** Clarify and illuminate topics, providing understanding and context.

**Characteristics:**
- Discusses concepts, design decisions, historical context
- Addresses the "why" behind implementations
- Explores alternatives and trade-offs
- Connects ideas across the system
- Broadens the reader's understanding

**Writing guidelines:**
- Provide context and background
- Explain design decisions and their rationale
- Discuss alternatives considered
- Connect to broader concepts
- Use analogies and examples to illuminate ideas
- No instructions—this is about understanding, not action
- Maintain subject matter expert tone: "This design emerged because..."

**Example content:** "Why This Documentation Stack Works", "The Architecture of Static Site Generators", "Understanding the Four-Quadrant Model"

## Role-First Navigation Architecture

**Architectural Decision:** Documentation MAY use **role-first navigation** rather than Diataxis-first navigation when serving multiple distinct user roles. Users navigate by their role first, then by content type within that role.

### Why Role-First Instead of Diataxis-First?

**User-Centric Thinking:** Users think "I'm an administrator" before they think "I need a how-to guide." Role-first navigation reduces cognitive load and gets users to relevant content faster.

**Diataxis as Implementation Detail:** The Diataxis framework still guides content quality and organization, but it becomes an implementation detail rather than user-facing navigation. Users don't need to understand the framework to find what they need.

**When to Use Role-First:** Consider role-first navigation when documentation serves multiple user roles with significantly different needs, skill levels, or use cases.

### Example User Role Structure

Documentation serving technical systems may include roles such as:

#### 1. Administrator
**Who:** Person responsible for system setup, configuration, maintenance, and documentation
**Content Needs:**
- Comprehensive setup and configuration guides
- Operations and troubleshooting how-tos
- Complete technical reference material
- Deep architectural explanations

**Writing Approach:** Assume technical competence, provide detailed information, include troubleshooting and edge cases.

#### 2. User
**Who:** Standard users performing regular tasks with the system
**Content Needs:**
- Getting started guides
- Common task how-tos
- Simple reference for available capabilities
- Basic understanding of system usage

**Writing Approach:** Keep it simple, focus on common use cases, avoid overwhelming with technical details.

#### 3. Power User
**Who:** Advanced users performing experimentation, development, and advanced customization
**Content Needs:**
- Advanced usage and experimentation guides
- Development and customization how-tos
- Advanced technical reference
- Deep understanding of internals

**Writing Approach:** Assume high technical competence, provide advanced techniques, include experimental features and development guidance.

**Note:** These are example roles. Projects should define roles based on their specific user base and use cases.

### Determining Content's Target Role

**Ask these questions:**

1. **Who needs this information?**
   - Administrators only → `administrator/`
   - All users → May belong in multiple roles or shared content
   - Power users experimenting → `power-user/`

2. **What's the complexity level?**
   - Basic/common tasks → `user/`
   - System setup/maintenance → `administrator/`
   - Advanced/experimental → `power-user/`

3. **Can this be shared?**
   - Reference material (CLI commands, API specs) can be shared
   - How-to guides should be role-specific to match user context
   - Explanations can sometimes be shared if they apply broadly

### Progressive Disclosure by Role

**User Role:** Simple, streamlined content. Focus on the 80% use case. Hide complexity.

**Administrator Role:** Comprehensive content. Include edge cases, troubleshooting, advanced configuration.

**Power User Role:** Advanced content. Assume deep understanding, provide experimental features, development guidance.

### Role Landing Pages

Each role has an index page (`administrator/index.md`, `user/index.md`, `power-user/index.md`) that:

1. **Welcomes the user** to their section
2. **Describes what they'll find** in this role's documentation
3. **Explains the subsections** (How-To, Reference, Explanation)
4. **Provides quick links** to most common pages for that role
5. **Sets expectations** about content complexity and scope

## The Collapse Problem

Documentation naturally wants to blur boundaries between types. **Resist this tendency.**

**Warning signs of collapse:**
- Tutorials that digress into advanced techniques
- How-to guides that explain concepts at length
- Reference material that teaches rather than describes
- Explanation content that includes step-by-step instructions

**Fix:** Ask two questions about any content:
1. Is this **action** (practical) or **cognition** (theoretical)?
2. Is this **acquisition** (study/learning) or **application** (work/problem-solving)?

The answers reveal where content belongs. Split collapsed content into separate pieces for each appropriate quadrant.

## Technical Specifications

### File Structure

**MUST organize files by user role first, then by Diataxis content type** because users navigate by role before content type, reducing cognitive load and improving content discovery.

**MUST create separate top-level directories for each user role** (Administrator, User, Power User) because this implements role-first navigation architecture and provides clear separation of concerns.

**MUST include subdirectories for content types within each role** (how-to, reference, explanation) because Diataxis framework guides content quality even as implementation detail.

**MUST omit tutorials directory** because this project serves technical users who need practical solutions, not learning exercises.

**MUST provide home page that routes users to their role** because effective navigation starts with role identification.

### Markdown Requirements

**MUST use ATX-style headers** because this provides consistent, accessible document structure and works reliably across all Markdown processors.

**MUST use fenced code blocks with language identifiers** because syntax highlighting improves code readability and helps users understand context.

**MUST use reference-style links for repeated URLs** because this keeps markdown source clean and makes URL updates easier to manage.

**MUST include one blank line between sections** because this improves source readability and ensures consistent rendering.

**MUST use Material-specific extensions when appropriate** because these enhance user experience without breaking standard Markdown compatibility:

- **Admonitions** for important concepts because they draw attention to critical information, warnings, tips, or dangers
- **Content tabs** for showing alternatives because they allow compact presentation of multiple options without overwhelming users
- **Code annotations** for explaining examples because they provide inline explanations without disrupting code flow
- **Task lists** for procedural steps because they provide clear visual indicators of progress and completion states

### Navigation Structure

**MUST present three user roles as distinct top-level navigation items** because users identify by role before seeking content type, improving discoverability and reducing navigation complexity.

**MUST place Diataxis content types as subsections within each role** because this implements role-first architecture where framework guides quality but remains implementation detail.

**MUST omit tutorials from navigation** because this project serves technical users who need practical solutions, not learning exercises.

**MUST include role landing pages in navigation** because users need orientation points explaining what they'll find in each role's section.

**MUST order navigation items to match user journey** (Home, then roles in order of likely usage) because this supports natural discovery patterns.

### Section Index Pages

**MUST create two-level index page structure** because role-first architecture requires orientation at both role and content type levels.

#### Role Landing Pages (Top Level)

**MUST create landing page for each role** because users need orientation explaining what they'll find in their section and how to navigate it.

**MUST welcome users to their role's documentation section** because this confirms they're in the right place and sets appropriate tone.

**MUST describe who the section serves and what use cases it covers** because clear audience definition helps users confirm relevance and set expectations.

**MUST explain subsections in user-friendly language** because users may not understand Diataxis terminology (How-To, Reference, Explanation) without context.

**MUST provide quick links to most common pages for that role** because this supports rapid access to frequently needed content.

**MUST set complexity expectations appropriate to the role** because this helps users gauge content depth and whether they have prerequisite knowledge.

#### Content Type Index Pages (Second Level)

**MAY create index pages for content types within roles** (how-to, reference, explanation) only when substantial content exists because unnecessary index pages add navigation overhead without value.

**MUST create content type index pages only when they add value** beyond the role landing page because simpler navigation serves users better.

## Content Quality Standards

### Cross-Referencing

Link between documentation types appropriately:

- **How-to guides → Reference:** For technical details about parameters, options, or APIs
- **Tutorials → Explanation:** For deeper understanding after completing hands-on experience
- **Reference → Explanation:** For conceptual background about why things work a certain way
- **Explanation → Reference:** For technical specifications of concepts being discussed
- **Never** create circular explanations where content keeps pointing elsewhere without providing value

### External Documentation References

When referencing external documentation (such as NVIDIA DGX Spark official docs), follow these guidelines to maintain MarrBox's unique value while reducing maintenance burden for authoritative specifications.

#### When to Reference External Documentation

**Reference external docs for:**
- Authoritative hardware specifications (dimensions, weight, power requirements, thermal specs)
- Official software version information and release notes
- Known issues lists from official sources (e.g., NVIDIA Release Notes)
- Official product capabilities and features not specific to MarrBox integration

**Maintain MarrBox content for:**
- Integration guides (Ollama, Open WebUI, Tailscale, NFS, macOS)
- Practical installation guidance and real-world tips
- Troubleshooting integration-specific issues
- SSH configuration and network discovery methods
- Use-case specific workflows and procedures
- Role-based progressive disclosure
- Operational procedures and day-to-day administration

#### How to Add External References

**Reference placement:**
- Add references at **section level**, not inline within procedures
- Place references at the beginning of relevant sections (Prerequisites, Hardware Specifications, Known Issues)
- Use consistent format across all external references

**Reference format:**
```markdown
For official DGX Spark hardware specifications, see [NVIDIA DGX Spark User Guide](https://docs.nvidia.com/dgx/dgx-spark/index.html).
```

**After the reference, continue with MarrBox-specific content:**
```markdown
### Practical Installation Considerations

Beyond the official specs, consider these practical points when installing:
- [MarrBox-specific guidance continues...]
```

#### External Reference Best Practices

**Link stability:**
- Reference only stable, top-level pages (e.g., main user guide URL)
- Avoid deep links to specific sections that may reorganize
- Document the external documentation structure to detect changes

**Workflow preservation:**
- Section-level references avoid disrupting step-by-step workflows
- Users can optionally consult external docs without breaking their flow
- Critical setup procedures remain self-contained in MarrBox documentation

**Clear scope statements:**
- Explicitly state what MarrBox documentation focuses on
- Make clear distinction: "See NVIDIA for X. MarrBox provides Y."
- Example: "MarrBox documentation focuses on specific integration scenarios, practical implementation, and use cases. Reference official NVIDIA docs for complete product capabilities and authoritative specifications."

#### Link Health Monitoring

**Validation requirements:**
- Test all external links before committing documentation
- Include external link validation in content review checklist
- Monitor external documentation for reorganizations that break references

**Future automation:**
- Consider adding link checker to CI/CD pipeline (see issue tracking for implementation)
- Set up notifications for broken external links
- Periodically review external reference validity (quarterly recommended)

### Voice and Tone by Type

- **Tutorials:** Supportive teacher—"We'll create...", "Next, you'll...", "Let's build..."
- **How-to guides:** Colleague offering a recipe—"Configure...", "Add...", "To solve this..."
- **Reference:** Technical manual—"The `timeout` parameter specifies...", "Returns...", "Accepts..."
- **Explanation:** Subject matter expert—"This design emerged because...", "The key insight...", "Consider..."

### Writing Style

- Use present tense
- Use active voice
- Be concise—respect the reader's time
- Use concrete examples
- Define terms on first use
- Avoid jargon where plain language suffices
- Write for an international audience (avoid idioms and cultural references)

### Code Examples

**In tutorials:**
- Provide complete, working code
- Test every example to ensure it works
- Use realistic but simple examples
- Build incrementally—each step adds one concept
- Include expected output

**In how-to guides:**
- Show the minimal code needed to solve the problem
- Focus on the solution, not teaching concepts
- Provide complete examples when necessary for clarity
- Can show multiple approaches

**In reference:**
- Illustrate syntax and usage
- Keep examples minimal and focused
- Show return values and side effects
- Document edge cases

**In explanation:**
- Use code to illustrate concepts, not provide instructions
- Examples can be pseudocode or conceptual
- Focus on the "why" not the "how"

## Validation Checklist

Before considering documentation complete:

### Structural validation
- [ ] Content fits clearly into one Diataxis quadrant
- [ ] File is in the correct directory
- [ ] Navigation entry exists in `mkdocs.yml`
- [ ] Section index page references this content
- [ ] File follows naming conventions (lowercase, hyphens for spaces)

### Content validation
- [ ] Title clearly indicates content type and topic
- [ ] Opening paragraph establishes purpose and audience
- [ ] Content maintains consistent voice for its type
- [ ] Cross-references link appropriately to other quadrants
- [ ] Code examples are tested and work
- [ ] No collapse—content doesn't mix documentation types
- [ ] Length is appropriate (tutorials and explanations can be longer; how-tos and reference should be concise)

### Technical validation
- [ ] Markdown syntax is valid
- [ ] Code blocks specify language for syntax highlighting
- [ ] Internal links use relative paths
- [ ] External links use absolute URLs
- [ ] All external links tested and valid (especially NVIDIA documentation references)
- [ ] External references placed at section level, not inline in procedures
- [ ] Images include alt text
- [ ] Headers follow logical hierarchy (no skipped levels)
- [ ] Special characters are properly escaped

### Accessibility validation
- [ ] Link text is descriptive (not "click here")
- [ ] Images have meaningful alt text
- [ ] Color is not the only means of conveying information
- [ ] Headers create logical document outline
- [ ] Code examples include context for screen readers

## Pragmatic Application

Perfect categorization should not block progress. The framework serves as an analytical lens and quality improvement tool, not a rigid categorization system.

### Acceptable pragmatism

- Explanations can include compact context to avoid constant reference links
- Tutorials can tier content for different skill levels
- Reference material can link to other content types
- How-to guides can include brief explanations when it improves clarity
- A single how-to guide can present multiple alternative solutions

### Unacceptable compromise

- Mixing action-oriented and understanding-oriented content in the same document
- Creating tutorials that don't provide hands-on learning experiences
- Writing reference documentation around user tasks instead of technical structure
- Placing content in the wrong quadrant because it's convenient
- Starting tutorials with lengthy explanations before hands-on work

## Implementation Approach

### For new documentation projects

1. **Start with quickstarts (tutorials)**—reach core value in 3-5 minutes
2. **Develop how-to guides next** for real user scenarios
3. **Build reference documentation** following blueprint from phantom links
4. **Add explanation content last** as understanding deepens

### For migrating existing documentation

1. **Review each file** and classify into one of the four types
2. **Content that spans multiple types** indicates collapse—split it
3. **Move files** to appropriate directories
4. **Update navigation** to reflect four-quadrant structure
5. **Create section index pages**
6. **Update cross-references**
7. **Test all links** to ensure they still work

**Incremental adoption is preferred.** Diataxis explicitly rejects big-bang documentation rewrites.

## Common Pitfalls and Solutions

### Pitfall: Tutorial that explains too much

**Problem:** Tutorial spends paragraphs explaining concepts before letting users take action.

**Solution:** Cut explanation ruthlessly. Users learn by doing. Add a link to explanation content for those who want deeper understanding after completing the tutorial.

### Pitfall: How-to guide that teaches concepts

**Problem:** How-to guide spends time teaching background information the user doesn't need to solve their problem.

**Solution:** Assume competence. Provide just enough context to understand the problem, then jump to the solution. Link to explanations for those who want to understand why.

### Pitfall: Reference that wanders into explanation

**Problem:** Reference documentation tries to explain when to use features or why design decisions were made.

**Solution:** State facts only. Move "when to use this" content to how-to guides. Move "why it works this way" content to explanations.

### Pitfall: Explanation with step-by-step instructions

**Problem:** Explanation content includes "First do this, then do that" instructions.

**Solution:** Remove instructions. If the steps are necessary, create a tutorial or how-to guide. Explanations illuminate concepts, they don't guide actions.

### Pitfall: Unclear quadrant placement

**Problem:** Can't decide if content is a tutorial or how-to guide, or reference vs. explanation.

**Solution:** Apply the two-axis test:
- Tutorial vs. How-to: Is the user learning (tutorial) or solving a problem they already understand (how-to)?
- Reference vs. Explanation: Does it describe what/how (reference) or why (explanation)?

## Quick Reference: "Which Quadrant?"

**Ask yourself:**

- Am I teaching someone to do something for the first time? → **Tutorial**
- Am I helping someone solve a specific problem they already have? → **How-To Guide**
- Am I describing how something works or what it does? → **Reference**
- Am I explaining why something is the way it is? → **Explanation**

**When in doubt:** If it includes step-by-step instructions, it's either Tutorial or How-To. If the user already knows what they want to accomplish, it's How-To. If they're learning a new skill, it's Tutorial.

## Additional Resources

### Diataxis Framework
- Official website: https://diataxis.fr/
- Quick start: https://diataxis.fr/start-here/
- GitHub repository: https://github.com/evildmp/diataxis-documentation-framework

### MkDocs and Material
- MkDocs documentation: https://www.mkdocs.org/
- Material for MkDocs: https://squidfunk.github.io/mkdocs-material/
- Material plugins: https://squidfunk.github.io/mkdocs-material/plugins/

### Markdown
- CommonMark specification: https://commonmark.org/
- Material Markdown extensions: https://squidfunk.github.io/mkdocs-material/reference/

---

**Version:** 2.0
**Last Updated:** 2025-10-27
**License:** CC-BY-SA 4.0

**For questions or suggestions about these standards, please open an issue in the project repository.**
