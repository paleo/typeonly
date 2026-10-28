const { name, branch, currentWorktree, isMainWorktree, status } = JSON.parse(
  process.env.ALIGNFIRST_WORKSPACE_CONTEXT,
);

console.log(`Workspace ${name} — ${status}
  Type:   ${isMainWorktree ? "main" : "linked"}
  Branch: ${branch}
  Path:   ${currentWorktree}`);
