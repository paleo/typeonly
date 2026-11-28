// Generates the parser in `antlr-parser/` from the grammar files. The ANTLR tool (a Java jar)
// has the version of the `antlr4` runtime dependency; it is downloaded when missing.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf-8"));
const version = packageJson.dependencies.antlr4;

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`The "antlr4" dependency must be an exact version, got "${version}"`);
}

const jarName = `antlr-${version}-complete.jar`;
const jarPath = join(packageDir, jarName);

if (!existsSync(jarPath)) {
  const url = `https://www.antlr.org/download/${jarName}`;
  console.log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Cannot download ${url}: HTTP ${response.status}`);
  }
  const tmpPath = `${jarPath}.tmp`;
  writeFileSync(tmpPath, Buffer.from(await response.arrayBuffer()));
  renameSync(tmpPath, jarPath);
}

const { status, error } = spawnSync(
  "java",
  [
    "-cp",
    jarPath,
    "org.antlr.v4.Tool",
    "-Dlanguage=JavaScript",
    "-o",
    "antlr-parser",
    "TypeOnlyParser.g4",
    "TypeOnlyLexer.g4",
  ],
  { cwd: packageDir, stdio: "inherit" },
);

if (error) throw error;
process.exit(status ?? 1);
