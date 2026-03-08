---
title: TypeOnly Language
summary: The supported TypeScript subset — what is allowed and what is not.
read_when:
  - writing .d.ts files for TypeOnly
  - understanding what TypeOnly can parse
  - hitting a parser error
---

# TypeOnly Language

TypeOnly is a strict subset of TypeScript. Any valid TypeOnly code is valid TypeScript, but not the reverse. It covers the "pure typing" part: `interface` and `type` definitions only.

## Supported Constructs

- **Interfaces** with properties (required and optional via `?`)
- **Type aliases** (`type X = ...`)
- **Union types** (`A | B`)
- **Intersection types** (`A & B`)
- **Literal types** (string, number, boolean literals)
- **Built-in types** (`string`, `number`, `boolean`, `bigint`, `undefined`, `null`, `object`, `any`, `unknown`, `never`, `void`)
- **Array types** (`T[]` and `Array<T>`)
- **Tuple types** (`[A, B, C]`)
- **Index signatures** (`[key: string]: T`)
- **Imports/exports** between `.d.ts` files
- **Comments** (single-line and multi-line)
- **String, number, and boolean literal unions** (e.g. `"a" | "b" | "c"`)

## Not Supported

- **Generics** — not implemented
- **Template literal types** — not supported
- **Conditional types** — not supported
- **Mapped types** — not supported
- **Utility types** (`Partial<T>`, `Pick<T, K>`, etc.) — not supported (these require generics)

## Key Principle

Do not write code that TypeScript would reject, even if the TypeOnly parser accepts it. TypeOnly will always remain a strict subset of TypeScript; future versions may reject code that current versions mistakenly accept.

## File Format

TypeOnly operates on `.d.ts` files (TypeScript declaration files). The parser is implemented from scratch using ANTLR and does not depend on the TypeScript compiler.
