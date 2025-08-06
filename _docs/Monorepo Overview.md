# Monorepo Overview

## Sub-projects

- **typeonly**: Core TypeOnly library for parsing and processing TypeOnly syntax
- **loader**: TypeOnly loader for bundlers and build tools
- **validator**: Runtime validation library for TypeOnly schemas
- **validator-cli**: Command-line interface for the validator

## Monorepo Tooling

- **Package Manager**: npm with workspaces
- **Build System**: Turbo for task orchestration and caching
- **Linting**: Biome for code formatting and linting
- **Changelog**: Changesets for version management and changelog generation

## Main Configuration Files

- `package.json`: Root package configuration with workspace definitions
- `turbo.json`: Turbo build pipeline configuration
- `biome.json`: Biome linting and formatting rules
- `.changeset/`: Changeset configuration for version management
