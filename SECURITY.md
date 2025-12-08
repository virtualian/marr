# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in MARR, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email the maintainer directly at virtualian@gmail.com
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce if possible

### What to expect

- You will receive an acknowledgment within 48 hours
- We will investigate and provide updates on the fix timeline
- Once fixed, we will credit you in the release notes (unless you prefer anonymity)

## Security Considerations

MARR is a CLI tool that modifies configuration files in your project. By design, it:

- Reads and writes files in your project's `.claude/` directory
- Copies template files from its resource directory
- Does not make network requests
- Does not execute arbitrary code from configuration files

### Best Practices

- Review MARR-generated files before committing them
- Keep MARR updated to the latest version
- Report any unexpected file modifications
