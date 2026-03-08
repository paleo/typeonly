---
title: Architecture
summary: Monorepo structure, package hierarchy, intermediate representations, and key classes.
read_when:
  - understanding how the project is organized
  - figuring out which package to modify
  - tracing data flow from source to validation
---

# Architecture

## What Is TypeOnly

TypeOnly parses a subset of TypeScript type/interface syntax and makes those types available at runtime for validation. It does **not** execute TypeScript or depend on `tsc` at runtime.

## Monorepo Layout

The repository uses **npm workspaces** with **Turborepo** for orchestration. There are 4 packages:

```
packages/
├── typeonly           # Core parser — parses .d.ts files, produces RTO JSON
├── loader             # @typeonly/loader — loads RTO modules at runtime
├── validator          # @typeonly/validator — validates data against types
└── validator-cli      # @typeonly/validator-cli — CLI for validation
```

Tooling at the root: Turbo (task orchestration), Biome (lint + format), Changesets (versioning).

## Package Dependency Chain

```
typeonly  →  @typeonly/loader  →  @typeonly/validator  →  @typeonly/validator-cli
```

Each package depends only on the one to its left. There are no circular dependencies.

## Data Flow Pipeline

```
TypeScript source (.d.ts — types & interfaces only)
        │
        ▼
   ANTLR4 Parser  (TypeOnlyLexer.g4 + TypeOnlyParser.g4)
        │
        ▼
   AstExtractor  (ANTLR listener → TypeOnlyAst)
        │
        ▼
   RtoModuleFactory  (AST → RtoModule)
        │
        ▼
   .rto.json files  (serialized RtoModule)
        │
        ▼
   Loader / ModuleFactory  (RtoModule → Modules with resolved refs)
        │
        ▼
   Validator  (Modules + JS value → ValidateResult)
```

## The Two Intermediate Representations

### AST (`TypeOnlyAst` — `packages/typeonly/src/ast.d.ts`)

- Direct syntax tree produced by `AstExtractor`, an ANTLR parse-tree listener.
- Uses **discriminated unions** with `whichDeclaration`, `whichType`, `whichEntry` as discriminant fields.
- Types can be plain strings (for simple type names like `"string"`) or objects with a `whichType` property.
- Created by `parseTypeOnly()` in the public API.

### RTO (`RtoModule` — `packages/typeonly/src/rto.d.ts`)

- "Runtime Type Object" — a normalized, JSON-serializable representation.
- Uses `kind` as the discriminant field (e.g., `"name"`, `"localRef"`, `"importedRef"`, `"interface"`, `"array"`, `"composite"`).
- Resolves string type names into structured objects with `group` (`"ts"`, `"primitive"`, `"global"`) and `refName`.
- Created by `RtoModuleFactory` from an AST, orchestrated by `RtoProject`.

## Key Classes by Package

### `typeonly` (core)

| Class / File | Responsibility |
|---|---|
| `parse-typeonly.ts` | Wires up ANTLR lexer/parser, collects errors, invokes `AstExtractor` |
| `AstExtractor` | ANTLR listener that builds `TypeOnlyAst` by walking the parse tree |
| `CommentGrabber` | Extracts doc-comments and standalone comments from the token stream |
| `RtoModuleFactory` | Converts a single module's AST into `RtoModule`; resolves type name groups |
| `RtoProject` | Orchestrates multi-module RTO generation; handles cross-module imports |
| `AstImportTool` | Tracks imports (classic + namespaced + inline) for a module |
| `InlineImportScanner` | Walks AST types to discover inline `import("...")` expressions |
| `ProjectInputOutput` | File I/O for reading source files and writing `.rto.json` output |

### `@typeonly/loader`

| Class / File | Responsibility |
|---|---|
| `Project` | Loads RTO modules (sync or async), resolves imports, builds `Modules` |
| `ModuleFactory` | Converts `RtoModule` into the loader's `Module` type with resolved references |

### `@typeonly/validator`

| Class / File | Responsibility |
|---|---|
| `Validator` | Walks a type definition tree and checks a JS value against it |
| `error-message.ts` | Formats human-readable validation error messages |

## Source `.d.ts` Files

Several `.d.ts` files live in `src/` as **hand-written source** (not generated):

- `packages/typeonly/src/ast.d.ts` — AST type definitions
- `packages/typeonly/src/rto.d.ts` — RTO type definitions
- `packages/loader/src/typeonly-loader.d.ts` — Loader's public type definitions
- `packages/typeonly/src/parser/antlr4-defs.d.ts` — Type shims for ANTLR4 JS runtime
- `packages/typeonly/src/rto-factory/internal-types.d.ts` — Internal RTO factory types

These are bundled into a single `.d.ts` per package at build time by `scripts/bundle-tsd.js`.

## ANTLR4 Grammar

The TypeOnly language grammar lives at the root of `packages/typeonly/`:

- `TypeOnlyLexer.g4` — Lexer rules
- `TypeOnlyParser.g4` — Parser rules

Generated JavaScript output goes to `antlr-parser/` (git-ignored, regenerated on build). A **JVM is required** to run the ANTLR tool. See `docs/packages/typeonly.md` for setup details.

## Entry Points

Each package exposes its public API through `src/api.ts`. CLI packages additionally have `src/cli.ts`. All packages are ESM-only (`"type": "module"`).
