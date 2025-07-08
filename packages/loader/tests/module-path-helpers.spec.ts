import { describe, expect, test } from "vitest";
import { toModulePath } from "../src/helpers/module-path-helpers.js";

describe("Module Path Helpers - Extension Support", () => {
  test("should remove TypeScript extensions from module paths", () => {
    const testCases = [
      { input: "./module.ts", expected: "./module" },
      { input: "./module.d.ts", expected: "./module" },
      { input: "./module.js", expected: "./module" },
      { input: "./module", expected: "./module" },
      { input: "../types.ts", expected: "../types" },
      { input: "../types.d.ts", expected: "../types" },
      { input: "./sub/module.ts", expected: "./sub/module" },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = toModulePath({
        from: input,
        removeExtensions: [".d.ts", ".ts", ".js"],
      });
      expect(result).toBe(expected);
    });
  });

  test("should handle relative path resolution with extensions", () => {
    const result = toModulePath({
      from: "./sibling.ts",
      relativeToModule: "./sub/current",
      removeExtensions: [".d.ts", ".ts", ".js"],
    });
    expect(result).toBe("./sub/sibling");
  });

  test("should handle parent directory imports with extensions", () => {
    const result = toModulePath({
      from: "../parent.d.ts",
      relativeToModule: "./sub/current",
      removeExtensions: [".d.ts", ".ts", ".js"],
    });
    expect(result).toBe("./parent");
  });

  test("should not remove other extensions", () => {
    const result = toModulePath({
      from: "./module.json",
      removeExtensions: [".d.ts", ".ts", ".js"],
    });
    expect(result).toBe("./module.json");
  });

  test("should handle .rto.json extensions for loader", () => {
    const result = toModulePath({
      from: "./module.rto.json",
      removeExtensions: [".rto.json", ".d.ts", ".ts", ".js"],
    });
    expect(result).toBe("./module");
  });
});
