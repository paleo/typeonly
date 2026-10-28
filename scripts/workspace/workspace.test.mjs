import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "typeonly workspace 'quoted' "));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, ".vscode"));
  writeFileSync(join(root, ".vscode/settings.example.json"), '{"template":true}\n');
  return root;
}

function run(script, context) {
  return spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url))], {
    encoding: "utf8",
    env: { ...process.env, ALIGNFIRST_WORKSPACE_CONTEXT: JSON.stringify(context) },
  });
}

test("main settings are seeded, preserved, and reset only with force", (t) => {
  const root = fixture(t);
  const context = { isMainWorktree: true, currentWorktree: root, force: false };
  const target = join(root, ".vscode/settings.json");
  assert.equal(run("prepare.mjs", context).status, 0);
  assert.equal(readFileSync(target, "utf8"), '{"template":true}\n');
  writeFileSync(target, '{"custom":true}\n');
  assert.equal(run("prepare.mjs", context).status, 0);
  assert.equal(readFileSync(target, "utf8"), '{"custom":true}\n');
  assert.equal(run("prepare.mjs", { ...context, force: true }).status, 0);
  assert.equal(readFileSync(target, "utf8"), '{"template":true}\n');
});

test("linked preparation leaves file reconciliation to the kernel", (t) => {
  const root = fixture(t);
  const target = join(root, ".vscode/settings.json");
  writeFileSync(target, '{"linked":true}\n');
  assert.equal(
    run("prepare.mjs", { isMainWorktree: false, currentWorktree: root, force: true }).status,
    0,
  );
  assert.equal(readFileSync(target, "utf8"), '{"linked":true}\n');
});

test("preparation propagates missing-template errors", (t) => {
  const root = fixture(t);
  rmSync(join(root, ".vscode/settings.example.json"));
  assert.notEqual(
    run("prepare.mjs", { isMainWorktree: true, currentWorktree: root, force: true }).status,
    0,
  );
});

test("scripts reject missing context", () => {
  assert.notEqual(run("prepare.mjs", undefined).status, 0);
  assert.notEqual(run("summary.mjs", undefined).status, 0);
});

test("summary preserves main and linked identity without executing branch text", () => {
  for (const isMainWorktree of [true, false]) {
    const result = run("summary.mjs", {
      name: "typeonly",
      branch: "feat/12; $(exit 99)",
      currentWorktree: "/tmp/quoted 'path'",
      isMainWorktree,
      status: "ready",
    });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Workspace typeonly — ready/);
    assert.ok(result.stdout.includes(`Type:   ${isMainWorktree ? "main" : "linked"}`));
    assert.ok(result.stdout.includes("feat/12; $(exit 99)"));
    assert.ok(result.stdout.includes("/tmp/quoted 'path'"));
  }
});
