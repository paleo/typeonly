# Monorepo for TypeOnly

**TypeOnly** is a lightweight validation library that uses TypeScript type definitions to validate JSON data. **[Learn more about TypeOnly here](https://github.com/paleo/typeonly/tree/master/packages/typeonly)**.

## Projects

* [typeonly](https://github.com/paleo/typeonly/tree/master/packages/typeonly): Parses types and interfaces from TypeScript and stores them as JSON files;
* [@typeonly/loader](https://github.com/paleo/typeonly/tree/master/packages/loader): Brings types and interfaces from TypeScript at runtime;
* [@typeonly/validator](https://github.com/paleo/typeonly/tree/master/packages/validator): An API to validate JSON data or JavaScript objects, using TypeScript typing definitions;
* [@typeonly/validator-cli](https://github.com/paleo/typeonly/tree/master/packages/validator-cli): A CLI to validate JSON files, using TypeScript typing definitions.

## Contribute

### Install and Build

We need a JVM (Java Virtual Machine) to build the parser because we use [ANTLR](https://www.antlr.org/), which is a Java program. So, at first, install a JVM on your system.

In a terminal, open the cloned `typeonly/typeonly/` repository. Then:

```sh
# Download once the ANTLR JAR file into the `packages/typeonly/` directory
wget https://www.antlr.org/download/antlr-4.13.2-complete.jar --directory-prefix packages/typeonly

# Install once all Node.js dependencies
npm install
mkdir .plans   # local work files; keep an existing plans directory or symlink
npx -y alignfirst workspace setup
```

Workspace setup seeds VS Code settings and runs `npm install` and `npm run build`. It allocates no ports and starts no services. Read `npx -y alignfirst workspace --guide` for lifecycle procedures and [DEVELOPERS.md](DEVELOPERS.md) for the project workflow.

For shared work files, use `npx -y alignfirst plans setup <plans-clone-path>` instead of creating `.plans`. The configured repository folder is `typeonly`. AlignFirst runs on demand without a project dependency; `npm install -g alignfirst` optionally provides the bare command.

### Development environment

With VS Code, our recommanded plugins are:

* **Biome** from biomejs (biomejs.dev)
* **ANTLR4 grammar syntax support** from Mike Lischke (`mike-lischke.vscode-antlr4`)

## Publish

```sh
npm run changeset
npm run changeset:version
npm i

npm run build
(cd packages/typeonly && npm publish)
(cd packages/loader && npm publish)
(cd packages/validator && npm publish)
(cd packages/validator-cli && npm publish)
```
