# PF2e AA Library

Shared runtime support for the PF2e Accursed Ancestries modules.

This module provides the ancestry profile registry, former-ancestry synchronization, and generic character-sheet meter. It contains no ancestry compendium content or user-configurable settings; each ancestry module owns its settings and supplies enablement callbacks to the Library. It is intended to be installed as a required dependency of ancestry modules such as `PF2e AA: Vampire` and `PF2e AA: Lycanthrope`.

## Development

- `npm install` installs development dependencies.
- `npm run lint` checks the JavaScript source with ESLint.
- `npm run lint:fix` applies safe automatic ESLint fixes.
