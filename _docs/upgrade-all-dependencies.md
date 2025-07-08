# Upgrading All Dependencies

Use this command:

```sh
# Update only the `package.json` files
npx npm-check-updates -u --workspaces --dep "prod,dev,optional"

# Install upgraded dependencies & build
npm i
npm run build
```

Guidelines:

- You must REFUSE to start if the repository is not clean. Before to start, ensure that there is nothing to commit.
- When a dependency is used in several packages, we always want to keep it in sync at **the same version**.
- Fix build issues: If dependencies cause build failures, attempt to fix them by updating code/configs.
- Revert problematic dependencies: If a dependency causes too much trouble, revert it to the previous version and document the issue.
- Do NOT upgrade npm or Node.js versions (`packageManager`, `engines`, `.nvmrc`).

## Remove `node_modules` and `package-lock.json` recursively

When an upgrade doesn't go smoothly, you may need to delete the `node_modules` directories and the lock file. Here's how to do it:

```sh
find . -name "node_modules" -type d -prune -exec rm -rf {} + ; find . -name "package-lock.json" -type f -delete

npm i
```
