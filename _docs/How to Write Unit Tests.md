# How to Write Unit Tests

## Tooling

- **Test Framework**: Vitest for all packages
- **Test Runner**: Turbo manages test execution across the monorepo
- **TypeScript**: Tests are written in TypeScript with `.spec.ts` extensions

## Running Tests

### Global tests (all packages)

```bash
npm run test
```

### Single package tests

```bash
cd packages/[package-name]
npm run test
```

### With watcher (single package)

```bash
cd packages/[package-name]
npx vitest
```

## Writing Tests

### File Placement

- Test files use `.spec.ts` extension
- Place tests in `tests/` directory within each package
- Group related tests in subdirectories (e.g., `ast-tests/`, `rto-tests/`)

### Test Structure

- Use Vitest's `describe`, `test`, and `expect` functions
- Import from `vitest`: `import { describe, expect, test } from "vitest"`
- Group related tests with descriptive `describe` blocks
- Use clear, specific test descriptions

### Configuration

Each package has a `vitest.config.ts` that includes:

- Test files: `**/src/**/*.spec.ts` and `**/tests/**/*.spec.ts`
- Node environment for testing
