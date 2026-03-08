---
title: Code Style
summary: Formatting rules, import conventions, linter configuration, and coding patterns.
read_when:
  - writing or modifying code
  - understanding import extension rules
  - configuring or debugging linter issues
---

# Code Style

## Tooling

**Biome** is the sole formatter and linter (no Prettier, no ESLint). Config lives in the root `biome.json`.

```bash
npm run lint       # check
npm run lint:fix   # auto-fix
```

## Formatting Rules

| Rule | Value |
|---|---|
| Indent style | Spaces |
| Indent width | 2 |
| Line width | 100 |
| Quote style | Double quotes (Biome default) |

## ESM and Import Conventions

The entire monorepo is ESM-only (`"type": "module"` in every `package.json`).

### Import Extensions Are Mandatory

Biome enforces `useImportExtensions: "error"`. Every import must include a file extension:

```typescript
// Correct
import { parseTypeOnlyToAst } from "./parser/parse-typeonly.js";
import type { TypeOnlyAst } from "./ast.d.ts";

// Wrong — will fail lint
import { parseTypeOnlyToAst } from "./parser/parse-typeonly";
```

Rules for choosing the extension:

- **`.js`** for runtime imports (TypeScript's `NodeNext` resolution maps `.js` → `.ts`)
- **`.d.ts`** for type-only imports from hand-written `.d.ts` source files (like `ast.d.ts`, `rto.d.ts`)

### ANTLR Imports Use a Special Pattern

ANTLR-generated files are plain JavaScript without type information. They use dynamic `await import()` with a `as string` type assertion:

```typescript
const TypeOnlyLexer = (await import("../../antlr-parser/TypeOnlyLexer.js" as string)).default;
```

## Key Linter Rules

| Rule | Setting | Notes |
|---|---|---|
| `noExplicitAny` | off | `any` is allowed |
| `noForEach` | off | `.forEach()` is used throughout |
| `noParameterAssign` | error | Do not reassign function parameters |
| `noInferrableTypes` | error | Don't annotate types that TS can infer |
| `noUselessElse` | error | |
| `useImportExtensions` | error | See above |
| `noConstantCondition` | off | `while (true)` loops are allowed |
| `noSwitchDeclarations` | off | |
| `organizeImports` | off | Biome does not auto-sort imports |

## TypeScript Configuration

- **Target**: `ES2022`
- **Module**: `NodeNext` / `moduleResolution: nodenext`
- **Strict mode**: enabled
- **Source maps**: disabled
- **Declaration output**: goes to `scripts/declarations/` (used by `bundle-tsd.js`)
- `allowJs: true` (needed for ANTLR-generated `.js` files)
- `skipLibCheck: true`

## Discriminated Union Conventions

The codebase uses discriminated unions with project-specific discriminant field names:

- **AST layer**: `whichDeclaration`, `whichType`, `whichEntry`, `whichImport`
- **RTO layer**: `kind`
- **Loader layer**: `kind` (same as RTO)

## General Conventions

- Prefer `for...of` or `.forEach()` — both are acceptable.
- Use `interface` for object shapes, `type` for unions and aliases.
- Prefix unused parameters with `_` (e.g., `_recognizer`, `_ctx`).
- Helper functions go in `helpers/` directories.
- Hand-written `.d.ts` source files live in `src/` alongside `.ts` files — do not confuse them with generated declarations.
