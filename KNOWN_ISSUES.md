# Known Issues

This file lists active bugs and known limitations. For new features and roadmap items, see the [open issues with the `enhancement` label](https://github.com/virtualian/marr/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement).

## Active Bugs

| # | Issue | Affects | Workaround |
|---|---|---|---|
| [#85](https://github.com/virtualian/marr/issues/85) | `marr standard list` only lists locally-installed standards, not all available standards | `marr standard list` | Use `marr init --project --standards list` to see available bundled standards |

## Known Limitations

| # | Limitation | Notes |
|---|---|---|
| [#86](https://github.com/virtualian/marr/issues/86) | `marr sync` does not remove deprecated/replaced standards | `marr update --project --prune` removes orphans tracked by the manifest; `sync`-side handling is still pending |

## Reporting

If you encounter behaviour not listed here, please file an issue: https://github.com/virtualian/marr/issues/new
