# Onboarding Guide

## About TypeOnly

TypeOnly is a TypeScript validation library that parses TypeScript type definitions at compile-time and validates JSON data at runtime.

## Stack

Node.js, TypeScript, ANTLR

## Packages

- `packages/typeonly`: Core parser that converts TypeScript `.d.ts` files to JSON using ANTLR grammar.
- `packages/loader`: Runtime loader that converts JSON type definitions to executable validation objects.
- `packages/validator`: API for validating JSON/JS objects using loaded type definitions. This package uses the loader.
- `packages/validator-cli`: CLI tool for validating JSON files. This package uses the validator.

## Noticeable source files

- `packages/typeonly/TypeOnlyLexer.g4`: The lexer syntax file of TypeOnly.
- `packages/typeonly/TypeOnlyParser.g4`: The parser syntax file of TypeOnly.
- `packages/typeonly/src/ast.d.ts`: Description of the AST.
- `packages/typeonly/src/rto.d.ts`: Raw TypeOnly Module definitions. It's the types of stored JSON data.
- `packages/loader/src/typeonly-loader.d.ts`: Types of loaded TS types: the job of the loader is to convert RTO to these types.

## Architecture Flow

1. **Compile-time**: `typeonly` CLI parses `.d.ts` files → AST → RTO (Raw TypeOnly) JSON format
2. **Runtime**: `loader` converts RTO JSON → runtime type objects → `validator` validates data

Key type transformation: TypeScript types → AST (`ast.d.ts`) → RTO (`rto.d.ts`) → Loader types (`typeonly-loader.d.ts`)

## Development Workflows

### Build System

- `npm run build` - Builds all packages via Turborepo with dependency ordering
- Uses Java/ANTLR for parser generation: `npm run antlr` generates JS parser from `.g4` grammar files
- Each package has `clear` → `antlr` (typeonly only) → `tsc` → `bundle-tsd` build pipeline
- `npm run test` - Run tests in all workspaces (no watcher)

### Testing

- `npm run test` - Runs Vitest across all packages (no watch mode)
- Tests are in `tests/` folders, structured as `ast-tests/` and `rto-tests/` for typeonly package
- Use `npm run test` in individual packages for development

## Key Patterns

### Package Structure

Each package follows: `src/` (TypeScript) → `dist/` (compiled JS) + `scripts/declarations/` (bundled types)

### ANTLR Integration

- Grammar files: `TypeOnlyLexer.g4`, `TypeOnlyParser.g4`
- Generated parser in `antlr-parser/` (gitignored, built on-demand)
- Java required for ANTLR: `java -cp "antlr-4.13.2-complete.jar" org.antlr.v4.Tool`

### Type Definitions

- `ast.d.ts`: Internal AST structure from parser
- `rto.d.ts`: Serializable "Raw TypeOnly" format for JSON storage
- `typeonly-loader.d.ts`: Runtime type objects for validation

### Cross-Package Dependencies

- Loader depends on typeonly's RTO types
- Validator depends on loader's runtime types
- Use workspace dependencies in package.json: `"typeonly": "workspace:*"`

## File Locations

- Grammar: `packages/typeonly/TypeOnly{Lexer,Parser}.g4`
- Core types: `packages/typeonly/src/{ast,rto}.d.ts`
- Parser logic: `packages/typeonly/src/parser/`
- RTO factory: `packages/typeonly/src/rto-factory/`
- Loader types: `packages/loader/src/typeonly-loader.d.ts`

## Development Notes

- Requires JVM for ANTLR parser generation
- Uses ES modules (`"type": "module"`)
- Turborepo handles build orchestration and caching
- Each package can be developed independently but follow the established type flow
