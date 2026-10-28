# Developer Guide

Run `npx -y alignfirst context` at the start of each session for project conventions, documentation and protocols. `docs/build-system.md` details the Turbo task graph and per-package scripts.

## Stack and layout

An npm-workspaces monorepo of TypeScript packages, built with Turbo: `packages/typeonly` (the parser, with an ANTLR grammar step), `packages/loader`, `packages/validator`, and `packages/validator-cli`. Test with Vitest, lint and format with Biome, release with Changesets.

## Workspaces

A workspace is a git worktree plus its setup: `.plans` and `.local` symlinked to the main worktree, `.vscode/settings.json` copied, then `npm install` and `npm run build`. This repository has no dev server, so the tooling runs portless: nothing to start, no `dev` script.

Run `npx -y alignfirst workspace --guide` for the full procedures. Workspace setup installs and builds the packages without starting services.

Prepare an ignored local `.plans` directory or retain the existing team-repository link before setup. `npx -y alignfirst plans check` validates it. Shared plans use the `typeonly/` folder; synchronize changes with `npx -y alignfirst sync`.

External workspace owners retain responsibility for Git worktree deletion and must run `npx -y alignfirst workspace teardown` first.

## Conventions

- _Ticket ID_: numeric.
- _Branch naming_: `<type>/<ticket-id>` (e.g. `feat/12`), or `<type>/<slug>` when there is no ticket.
- _Commit messages_: conventional commits, e.g. `feat: add validator option`. Do not mention the ticket ID.
- _Default branch_: `master`.

## Everyday commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build all packages in dependency order (Turbo) |
| `npm test` | Run all tests (Turbo runs build first) |
| `npm run lint` / `npm run lint:fix` | Check / fix with Biome |
| `npm run docmap` | Browse the project documentation |
| `npx -y alignfirst workspace <command>` | Manage worktree workspaces (`--guide` for the procedures) |
| `npx -y alignfirst sync` | Publish and retrieve the task plans (`.plans`) |
| `npm run test:workspace` | Test workspace preparation and summary scripts |
