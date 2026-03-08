---
title: Validator CLI
summary: The @typeonly/validator-cli package — validating JSON files from the command line.
read_when:
  - validating JSON files against types without writing code
  - integrating type validation into a CI pipeline or script
---

# Validator CLI (`@typeonly/validator-cli`)

Command-line tool that validates JSON files against TypeScript type definitions. Combines the parser, loader, and validator into a single command.

## Usage

### From a `.d.ts` source file

```sh
npx @typeonly/validator-cli -s drawing.d.ts -t "Drawing" data.json
```

### From a pre-generated `.rto.json` file

```sh
npx @typeonly/validator-cli --rto-module drawing.rto.json -t "Drawing" data.json
```

## Options

| Flag | Alias | Description |
|---|---|---|
| `--source` | `-s` | TypeScript definition file (`.d.ts`) |
| `--source-dir` | | Directory containing definition files |
| `--source-encoding` | | Encoding for `.d.ts` files (default: `utf8`) |
| `--rto-module` | | Pre-generated `.rto.json` file (alternative to `--source`) |
| `--rto-dir` | | Directory for `.rto.json` files |
| `--type` | `-t` | Root type name to validate against |
| `--non-strict` | | Accept additional properties not in the type |
| `--json-encoding` | `-e` | Encoding for the JSON file (default: `utf8`) |
| `--help` | `-h` | Print help |

The last positional argument is the JSON file to validate.

## Exit Codes

- **0** — Validation passed
- **1** — Validation failed (error message printed to stderr)
