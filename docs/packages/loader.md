---
title: Loader
summary: The @typeonly/loader package — loading RTO modules at runtime.
read_when:
  - accessing type metadata at runtime
  - extracting literal values from union types
  - working with RTO modules in application code
---

# Loader (`@typeonly/loader`)

Loads RTO JSON modules at runtime and provides an in-memory `Modules` object for type introspection. This is a lightweight package with zero runtime dependencies.

## API

Two main exports from `src/api.ts`:

```ts
import { loadModules, literals } from "@typeonly/loader";
```

### `loadModules(options)`

Sync (from a pre-loaded bundle):

```ts
import { readFileSync } from "node:fs";

const modules = loadModules({
  bundle: JSON.parse(readFileSync("dist/types.to.json", "utf8")),
});
```

Async (from individual `.rto.json` files on disk):

```ts
const modules = await loadModules({
  modulePaths: ["./drawing"],
  baseDir: "dist/",
});
```

### `literals(type, only?)`

Extracts literal values from a union type:

```ts
const { ColorName } = modules["./drawing"].namedTypes;
literals(ColorName, "string"); // ["red", "green", "blue"]
```

The `only` parameter filters by literal kind: `"string"`, `"number"`, `"bigint"`, or `"boolean"`.

## When to Use

Use the loader when you need type information at runtime but don't need validation — for example, to populate a dropdown with allowed values or to generate documentation from types. For validation, use `@typeonly/validator` instead (it uses the loader internally).
