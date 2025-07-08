# TypeOnly Development Instructions

## About TypeOnly

TypeOnly is a lightweight library for validating JSON data using TypeScript type definitions. It implements its own parser.

## Stack

Node.js, TypeScript, ANTLR

## Git

- Use conventional commits: `<type>: [#<issue>] <description>`

## Packages

- `packages/typeonly`: Parses types and interfaces from TypeScript and stores them as JSON files. This package is used at compile time.
- `packages/loader`: Loads types from a JSON descriptions. This package is used at runtime.
- `packages/validator`: An API to validate JSON data or JavaScript objects, using TypeScript typing definitions. This package uses the loader.
- `packages/validator-cli`: A CLI to validate JSON files, using TypeScript typing definitions. This package uses the validator.

## Noticeable source files

- `packages/typeonly/TypeOnlyLexer.g4`: The lexer syntax file of TypeOnly.
- `packages/typeonly/TypeOnlyParser.g4`: The parser syntax file of TypeOnly.
- `packages/typeonly/src/ast.d.ts`: Description of the AST.
- `packages/typeonly/src/rto.d.ts`: Raw TypeOnly Module definitions. It's the types of stored JSON data.
- `packages/loader/src/typeonly-loader.d.ts`: Types of loaded TS types: the job of the loader is to convert RTO to these types.

## Build & Development

- `npm run build` - Build all packages using Turborepo
- `npm run lint` - Run Biome linter

## Testing

- `npm run test` - Run tests in all workspaces (no watcher)

## Code Style Guidelines

[Code Style Guidelines](_docs/code-style-common.md) before writing any code.

## Procedures

Here are documented procedures, read what you need:

- [Upgrading All Dependencies](_docs/upgrade-all-dependencies.md)
