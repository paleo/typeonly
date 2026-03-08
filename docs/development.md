---
title: Development
summary: How to build, test, and lint across the monorepo.
read_when:
  - setting up a local development environment
  - running builds or tests
  - understanding the CI/tooling setup
---

# Development

## Prerequisites

- Node.js (ES2022+ target)
- npm 11+ (set via `packageManager` in root `package.json`)

## Install and Build

```sh
npm install
npm run build        # builds all packages in dependency order via Turbo
npm run build:force  # rebuilds everything, ignoring cache
```

## Run Tests

```sh
npm run test         # runs all tests (Turbo runs build first)
```

Tests use **Vitest**. Test files live in `tests/` directories or alongside source as `*.spec.ts`. Per-package: `npm test` or `npx vitest` for watch mode.

## Lint and Format

```sh
npm run lint         # biome check (lint + format)
npm run lint:fix     # auto-fix
```

Biome config (`biome.json`): 2-space indentation, 100-char line width, recommended rules. Notable settings:
- `useImportExtensions` enforced (`.js` extensions in imports)
- `noExplicitAny` disabled
- Strict TypeScript (`"strict": true` in all `tsconfig.json`)

## Per-Package Scripts

Each package follows a consistent pattern:

| Script | Description |
|---|---|
| `clear` | Remove `dist/` and `scripts/declarations/` |
| `tsc` | TypeScript compile |
| `build` | Clear + compile + bundle `.d.ts` |
| `test` | `vitest run` |
| `lint` | `biome check .` |

The `typeonly` core package adds an ANTLR step before `tsc` to generate the parser from `.g4` grammar files.

## Turbo Task Graph

Defined in `turbo.json`:
- `build` depends on `clear` and upstream `^build`
- `test` depends on `build`
- Cache outputs: `dist/**`, `antlr-parser/**`
