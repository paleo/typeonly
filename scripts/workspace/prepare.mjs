import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const { isMainWorktree, currentWorktree, force } = JSON.parse(
  process.env.ALIGNFIRST_WORKSPACE_CONTEXT,
);

if (isMainWorktree) {
  const target = join(currentWorktree, ".vscode/settings.json");
  if (!existsSync(target) || force) {
    copyFileSync(join(currentWorktree, ".vscode/settings.example.json"), target);
    console.log("Bootstrapped .vscode/settings.json from .vscode/settings.example.json.");
  }
}
