---
title: Testing
summary: How to write and run tests — Vitest setup, test patterns, and conventions for each package.
read_when:
  - writing new tests
  - running tests for a specific package
  - understanding test patterns and conventions
---

# Testing

## Test Runner

All packages use **Vitest** with the `node` environment.

## Running Tests

```bash
# All tests across the monorepo (builds first via Turbo)
npm run test

# Single package
cd packages/typeonly && npx vitest run
cd packages/loader && npx vitest run
cd packages/validator && npx vitest run

# Watch mode
cd packages/typeonly && npm run test:watch
```

Tests depend on the `build` task. Turbo handles this automatically from the root, but when running in a single package, make sure it has been built first.

## Test File Organization

```
packages/typeonly/tests/
  ast-tests/          # One file per feature
    ast-interface.spec.ts
    ast-array.spec.ts
    ast-comment.spec.ts
    ast-composite.spec.ts
    ast-function.spec.ts
    ast-generic.spec.ts
    ...
  rto-tests/          # RTO generation tests
    rto-types.spec.ts
    rto-import.spec.ts
    rto-comment.spec.ts
    ...

packages/loader/tests/
  loader-types.spec.ts
  loader-extension.spec.ts
  module-path-helpers.spec.ts

packages/validator/tests/
  interface.spec.ts
  types.spec.ts
```

Files use the `.spec.ts` extension, discovered by `**/tests/**/*.spec.ts` (configured in `vitest.config.ts`).

## Vitest Configuration

Each package has a `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/src/**/*.spec.ts", "**/tests/**/*.spec.ts"],
    environment: "node",
  },
});
```

## Test Patterns

### AST Tests — Parse-and-Assert

Parse a TypeOnly source string, then assert the resulting AST structure:

```typescript
import { describe, expect, test } from "vitest";
import { parseTypeOnly } from "../../src/api.js";
import type { AstNamedInterface, AstProperty } from "../../src/ast.d.ts";

describe("AST Specification for Interfaces", () => {
  test("interface with properties", () => {
    const source = `
interface I1 {
  a: string
  b: number
}
`;
    const ast = parseTypeOnly({ source });
    const namedInterface = ast.declarations?.[0] as AstNamedInterface;
    expect(namedInterface.entries?.length).toBe(2);
    const prop = namedInterface.entries?.[0] as AstProperty;
    expect(prop.name).toBe("a");
    expect(prop.type).toBe("string");
  });
});
```

Import `parseTypeOnly` from `../../src/api.js` (`.js` extension). Import AST types from `../../src/ast.d.ts` (`.d.ts` extension) using `import type`.

### RTO Tests — Parse + Convert, Then Assert

```typescript
import { createStandaloneRtoModule, parseTypeOnly } from "../../src/api.js";
import type { RtoTypeName } from "../../src/rto.d.ts";

test("RtoTypeName", () => {
  const rtoModule = createStandaloneRtoModule({
    ast: parseTypeOnly({ source: "export type T1 = string" }),
  });
  const namedType = rtoModule.namedTypes?.[0];
  expect(namedType).toMatchObject({
    name: "T1",
    exported: true,
    kind: "name",
    group: "primitive",
    refName: "string",
  });
});
```

### Loader Tests — Full Pipeline Through Module Loading

```typescript
import { createStandaloneRtoModule, parseTypeOnly } from "typeonly";
import { loadModules } from "../src/api.js";

test("loads type", async () => {
  const modules = await loadModules({
    modulePaths: ["./mod1"],
    rtoModuleProvider: async () =>
      createStandaloneRtoModule({
        ast: parseTypeOnly({ source: "export type T1 = string" }),
      }),
  });
  const namedType = modules["./mod1"].namedTypes["T1"];
  expect(namedType.kind).toBe("name");
});
```

Note: loader tests import `typeonly` as a package dependency (not a relative import).

### Validator Tests — End-to-End Validation

```typescript
import { createStandaloneRtoModule, parseTypeOnly } from "typeonly";
import { createValidator } from "../src/api.js";

test("validates interface", async () => {
  const validator = await createValidator({
    modulePaths: ["./mod1"],
    rtoModuleProvider: async () =>
      createStandaloneRtoModule({
        ast: parseTypeOnly({ source: `export interface A { a: number }` }),
      }),
  });
  const result = validator.validate("A", { a: 42 }, "./mod1");
  expect(result.valid).toBe(true);
});
```

## Parameterized Tests

Tests frequently use loops to test many inputs:

```typescript
const validIdentifiers = ["Abc12", "$_ab12", "_", "$"];
validIdentifiers.forEach((identifier) => {
  test(`valid identifier: ${identifier}`, () => {
    const source = `interface ${identifier} {}`;
    const ast = parseTypeOnly({ source });
    const iface = ast.declarations?.[0] as AstNamedInterface;
    expect(iface.name).toBe(identifier);
  });
});
```

## Error Case Tests

```typescript
test("invalid identifier", () => {
  expect(() => parseTypeOnly({ source: "interface 2b {}" })).toThrow();
});
```
