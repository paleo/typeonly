# Instructions for Agent - TypeOnly

Always ignore the `.local`, `.local-wt` and `.plans` directories when searching the codebase.

## Start every session with the project context

Run `npx -y alignfirst context` from the repository root as your first command, whatever the task. It prints the project conventions (ticket IDs, branch names, commits), the documentation map, and the AlignFirst protocols.

### Essential Documentation

Always read before any investigation or work:

- `docs/architecture.md` — the packages and how they fit together
- `docs/code-style.md` — the conventions every change must follow

## Workspaces

A **workspace** is a git worktree (with its branch) plus its own dev setup: symlinked shared directories and seeded config files. Workspaces are isolated, so you can work on several branches in parallel. This repository has no dev server, so the system runs portless: nothing to start, no `dev` script.

Run `npx -y alignfirst workspace --guide` for the full procedures. Setup shares `.local` and the existing plans target, seeds VS Code settings, then runs `npm install` and `npm run build`.

## Project conventions

Settings in `alignfirst.json` define numeric tickets, conventional commits and the `master` default branch. Omit ticket IDs from commit messages. Without a ticket, name branches `<type>/<slug>`.

### Team Plans Repository

In the main worktree, `.plans` is a symlink into a clone of the team plans repository (folder `typeonly/`). Plans are shared with the team through that repository and are never committed in this one.

After every change in `.plans/`, synchronize the plans: `npx -y alignfirst sync`.
