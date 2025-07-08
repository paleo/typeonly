import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { generateRtoModules } from "../../src/api.js";
import { makeReadSourceFileAstProvider } from "../../src/rto-factory/ProjectInputOutput.js";

describe("TypeScript File Support", () => {
  const testDir = "test-temp-cli";

  // Cleanup after each test
  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  test("should process .ts files in addition to .d.ts files", async () => {
    // Create temporary test files
    await mkdir(testDir, { recursive: true });

    await writeFile(join(testDir, "types.ts"), "export type MyType = string;");

    await writeFile(
      join(testDir, "interfaces.d.ts"),
      "export interface MyInterface { prop: string; }",
    );

    const astProvider = makeReadSourceFileAstProvider(testDir, "utf8");

    const rtoModules = await generateRtoModules({
      modulePaths: ["./types", "./interfaces"],
      astProvider,
      returnRtoModules: true,
    });

    // Both .ts and .d.ts files should be processed
    expect(rtoModules?.["./types"]).toBeDefined();
    expect(rtoModules?.["./interfaces"]).toBeDefined();

    expect(rtoModules?.["./types"]?.namedTypes?.[0]?.name).toBe("MyType");
    expect(rtoModules?.["./interfaces"]?.namedTypes?.[0]?.name).toBe("MyInterface");
  });

  test("should handle imports between .ts and .d.ts files", async () => {
    // Create temporary test files
    await mkdir(testDir, { recursive: true });

    await writeFile(join(testDir, "base.ts"), "export type BaseType = string;");

    await writeFile(
      join(testDir, "extended.d.ts"),
      'import { BaseType } from "./base.ts";\nexport interface Extended {\n  base: BaseType;\n}',
    );

    const astProvider = makeReadSourceFileAstProvider(testDir, "utf8");

    const rtoModules = await generateRtoModules({
      modulePaths: ["./extended"],
      astProvider,
      returnRtoModules: true,
    });

    expect(rtoModules?.["./extended"]).toBeDefined();
    expect(rtoModules?.["./base"]).toBeDefined();

    // Check that import path has extension removed
    expect(rtoModules?.["./extended"]?.imports?.[0]?.from).toBe("./base");
  });

  test("should prioritize .d.ts over .ts when both exist", async () => {
    // Create temporary test files
    await mkdir(testDir, { recursive: true });

    await writeFile(join(testDir, "types.ts"), 'export type FromTS = "ts-file";');

    await writeFile(join(testDir, "types.d.ts"), 'export type FromDTS = "dts-file";');

    const astProvider = makeReadSourceFileAstProvider(testDir, "utf8");

    const rtoModules = await generateRtoModules({
      modulePaths: ["./types"],
      astProvider,
      returnRtoModules: true,
    });

    expect(rtoModules?.["./types"]).toBeDefined();

    // Should load from .d.ts file (which has FromDTS type)
    const namedType = rtoModules?.["./types"]?.namedTypes?.[0];
    expect(namedType?.name).toBe("FromDTS");
  });
});
