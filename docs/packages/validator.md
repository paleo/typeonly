---
title: Validator
summary: The @typeonly/validator package — validating data against TypeScript types.
read_when:
  - validating JSON or JavaScript objects against types
  - integrating TypeOnly validation into an application
  - understanding validation error messages
---

# Validator (`@typeonly/validator`)

Validates JSON data or JavaScript objects against TypeScript type definitions at runtime.

## API

```ts
import { createValidator, createValidatorFromModules } from "@typeonly/validator";
```

### `createValidator(options)`

Sync (from a bundle):

```ts
const validator = createValidator({
  bundle: JSON.parse(readFileSync("dist/types.to.json", "utf8")),
});
```

Async (from `.rto.json` files):

```ts
const validator = await createValidator({
  modulePaths: ["./drawing"],
  baseDir: "dist/",
});
```

### Validating

```ts
const result = validator.validate("Drawing", data);
// { valid: true }
// or { valid: false, error: "In property 'radius', value '\"wrong\"' is not conform to number." }
```

The `moduleName` parameter is optional — if the type name is unique across modules, it is resolved automatically. If ambiguous, pass it explicitly:

```ts
validator.validate("Drawing", data, "./drawing");
```

### Options

- **`acceptAdditionalProperties`** — When `true`, extra properties on objects are allowed (non-strict mode). Default: `false`.

### `createValidatorFromModules(modules, options?)`

Creates a validator from already-loaded `Modules` (from `@typeonly/loader`). Useful when you need both the loader and validator.

## Validation Capabilities

Supports all TypeOnly constructs: interfaces, union/intersection types, literal types, arrays, tuples, optional properties, and index signatures. Error messages include the full property path for easy debugging.
