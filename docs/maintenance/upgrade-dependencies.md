---
title: Upgrading Dependencies
read_when:
  - upgrading or updating dependencies
  - upgrading ANTLR
---

# Upgrading Dependencies

Refuse to start when the working tree is dirty: `git status` must report nothing to commit.

## Procedure

```sh
# Update the `package.json` files. `--dep` leaves out `packageManager` and peer dependencies.
npx --yes npm-check-updates -u --workspaces --dep "prod,dev,optional"

npm install
npm run build
npm run lint
npm test
```

The build compiles the sources only: `npm test` runs Vitest, which does not type-check the tests. Type-check them with `npx tsc -p packages/<package>/tests` for `typeonly`, `loader` and `validator`.

Rules:

- Upgrade every dependency, major versions included. Set each [pinned package](#pinned-packages) back to the latest version of its allowed range before the install.
- Keep a dependency used by several packages at the same version everywhere. `npm-check-updates` skips peer dependencies: align their ranges by hand.
- Leave the Node and npm versions unchanged: `.nvmrc`, `packageManager`, and the CI configuration.
- Fix what breaks, in code, configuration or types. Read the migration guide of each new major version.
- When a dependency causes too much trouble, revert it to its previous version and pin it below, with the reason.
- When the reason of a pin no longer holds, remove the pin.
- npm warns about install scripts not yet approved (`npm install-scripts approve`). Leave the warning, and approve none.
- Write a changeset for each published package whose `dependencies` changed (see [writing-a-changeset.md](../writing-a-changeset.md)). A change of `devDependencies` alone needs none.

## ANTLR

The grammar step of `packages/typeonly` runs the ANTLR tool, a Java jar, and the generated parser runs on the `antlr4` npm runtime. Both have the same version: `scripts/antlr.mjs` reads it from the `antlr4` dependency, and downloads `antlr-<version>-complete.jar` from `https://www.antlr.org/download/` when it is missing.

1. Find the latest ANTLR version on the [download page](https://www.antlr.org/download.html).
2. Set `antlr4` in `packages/typeonly/package.json` to that exact version, without a range. `npm-check-updates` may propose an npm release that has no jar yet: keep the version of the jar.
3. Run `npm install`, then `npm run build`: the build downloads the new jar and regenerates `antlr-parser/`. Delete the previous jar from `packages/typeonly/`.
4. Run the tests: a new ANTLR version may change the generated parser.

## Biome

- `files.includes` in `biome.json` lists the checked file types: TypeScript, `.mjs` and JSON. A new Biome version that checks more file types by default, as 2.6 did with Markdown and YAML, changes nothing here.
- Run `npm run lint:fix` after a Biome upgrade and review the result.

## Pinned packages

- `@types/node`: `26.x`. It follows the Node version of `.nvmrc`.
- `antlr4`: the exact version of the ANTLR jar, see [ANTLR](#antlr).

## Resetting `node_modules` and the lock file

As a last resort, when the install stays broken, delete every `node_modules` directory and the lock file, then install again:

```sh
find . -name "node_modules" -type d -prune -exec rm -rf {} + ; find . -name "package-lock.json" -type f -delete
npm install
```
