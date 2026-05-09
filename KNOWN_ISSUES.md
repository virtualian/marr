# Known Issues

This file lists active bugs and known limitations. For new features and roadmap items, see the [open issues with the `enhancement` label](https://github.com/virtualian/marr/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement).

## Active Bugs

| # | Issue | Affects | Workaround |
|---|---|---|---|
| [#85](https://github.com/virtualian/marr/issues/85) | `marr standard list` only lists locally-installed standards, not all available standards | `marr standard list` | Use `marr init --project --standards list` to see available bundled standards |

## Known Limitations

| # | Limitation | Notes |
|---|---|---|
| [#86](https://github.com/virtualian/marr/issues/86) | Deprecated, deleted, old, replaced, and stale standards are not removed during sync or upgrade | A subsequent sync re-installs the latest set; orphaned files must be removed manually |
| [#111](https://github.com/virtualian/marr/issues/111) | Consumer projects can run stale MARR standards (drift D1–D6) | Run `marr sync` from a freshly-installed source project to refresh |

## Reporting

If you encounter behaviour not listed here, please file an issue: https://github.com/virtualian/marr/issues/new
