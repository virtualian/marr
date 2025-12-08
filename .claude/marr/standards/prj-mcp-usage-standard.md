---
marr: standard
version: 1
title: MCP Usage Standard
scope: All MCP tool usage and external service integration

triggers:
  - WHEN using MCP tools or integrating external services
  - WHEN selecting which tool to use for a task
  - WHEN troubleshooting tool behavior or failures
  - WHEN configuring or setting up MCP servers
---

# MCP Usage Standard

> **AI Agent Instructions**: This document defines how to use Model Context Protocol (MCP) tools. Follow these rules when using MCP tools or integrating external services.

---

## Core Rules (NEVER VIOLATE)

1. **Be specific in tool requests** because ambiguous requests cause wrong tool selection
2. **Use explicit tool names when unclear** because AI cannot infer intent from vague descriptions
3. **Never assume tool capabilities** because each MCP has specific, limited functionality
4. **Verify tool availability before use** because not all environments have all MCPs

---

## MCP Tool Selection

### Before Using an MCP Tool

- Confirm the tool is available in the current environment
- Understand what the tool does and does not do
- Know the tool's required inputs and expected outputs
- Be aware of any rate limits or usage constraints

### Choosing the Right Tool

- Match the tool to the specific task at hand
- Prefer specialized tools over general-purpose ones
- Use the simplest tool that accomplishes the goal
- Consider tool limitations before starting work

---

## Usage Patterns

### Making Requests

- Provide all required parameters explicitly
- Use clear, unambiguous language
- Specify expected output format when relevant
- Include context necessary for the tool to succeed

### Handling Responses

- Verify the response matches expectations
- Handle errors gracefully
- Do not retry failed requests without understanding the failure
- Document unexpected behavior for future reference

---

## Anti-Patterns (FORBIDDEN)

- **Assuming tool availability** — Always verify before use
- **Vague tool requests** — Be specific about what you need
- **Ignoring tool limitations** — Respect documented constraints
- **Blind retries on failure** — Understand why a request failed before retrying
- **Using wrong tool for the job** — Match tools to tasks appropriately
- **Overloading single requests** — Break complex tasks into focused tool calls

---

**This MCP usage standard ensures effective and reliable use of Model Context Protocol tools.**
