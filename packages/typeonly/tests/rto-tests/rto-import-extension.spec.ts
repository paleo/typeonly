import { describe, expect, test } from "vitest";
import { generateRtoModules, parseTypeOnly } from "../../src/api.js";

describe("File Extension Support", () => {
  test("should handle imports with .ts extension", async () => {
    const source1 = `
      import { ABC } from "./a.ts"
      export interface MyInterface {
        abc: ABC;
      }
    `;
    const source2 = `
      export type ABC = "A" | "B" | "C";
    `;

    const rtoModules = await generateRtoModules({
      modulePaths: ["./b"],
      astProvider: (modulePath) => {
        if (modulePath === "./b") return parseTypeOnly({ source: source1 });
        if (modulePath === "./a") return parseTypeOnly({ source: source2 });
        throw new Error(`Unknown module: ${modulePath}`);
      },
      returnRtoModules: true,
    });

    const rtoModule = rtoModules?.["./b"];
    expect(rtoModule?.imports?.[0]?.from).toBe("./a"); // Extension should be removed
  });

  test("should handle imports with .d.ts extension", async () => {
    const source1 = `
      import { ABC } from "./a.d.ts"
      export interface MyInterface {
        abc: ABC;
      }
    `;
    const source2 = `
      export type ABC = "A" | "B" | "C";
    `;

    const rtoModules = await generateRtoModules({
      modulePaths: ["./b"],
      astProvider: (modulePath) => {
        if (modulePath === "./b") return parseTypeOnly({ source: source1 });
        if (modulePath === "./a") return parseTypeOnly({ source: source2 });
        throw new Error(`Unknown module: ${modulePath}`);
      },
      returnRtoModules: true,
    });

    const rtoModule = rtoModules?.["./b"];
    expect(rtoModule?.imports?.[0]?.from).toBe("./a"); // Extension should be removed
  });

  test("should handle imports with .js extension", async () => {
    const source1 = `
      import { ABC } from "./a.js"
      export interface MyInterface {
        abc: ABC;
      }
    `;
    const source2 = `
      export type ABC = "A" | "B" | "C";
    `;

    const rtoModules = await generateRtoModules({
      modulePaths: ["./b"],
      astProvider: (modulePath) => {
        if (modulePath === "./b") return parseTypeOnly({ source: source1 });
        if (modulePath === "./a") return parseTypeOnly({ source: source2 });
        throw new Error(`Unknown module: ${modulePath}`);
      },
      returnRtoModules: true,
    });

    const rtoModule = rtoModules?.["./b"];
    expect(rtoModule?.imports?.[0]?.from).toBe("./a"); // Extension should be removed
  });

  test("should handle imports without extension (existing behavior)", async () => {
    const source1 = `
      import { ABC } from "./a"
      export interface MyInterface {
        abc: ABC;
      }
    `;
    const source2 = `
      export type ABC = "A" | "B" | "C";
    `;

    const rtoModules = await generateRtoModules({
      modulePaths: ["./b"],
      astProvider: (modulePath) => {
        if (modulePath === "./b") return parseTypeOnly({ source: source1 });
        if (modulePath === "./a") return parseTypeOnly({ source: source2 });
        throw new Error(`Unknown module: ${modulePath}`);
      },
      returnRtoModules: true,
    });

    const rtoModule = rtoModules?.["./b"];
    expect(rtoModule?.imports?.[0]?.from).toBe("./a"); // Should remain as-is
  });

  test("should handle mixed import styles with different extensions", async () => {
    const source1 = `
      import { ABC } from "./a.ts"
      import { DEF } from "./b.d.ts"
      import { GHI } from "./c.js"
      export interface MyInterface {
        a: ABC;
        b: DEF;
        c: GHI;
      }
    `;
    const sourceA = `export type ABC = "A" | "B" | "C";`;
    const sourceB = `export type DEF = "D" | "E" | "F";`;
    const sourceC = `export type GHI = "G" | "H" | "I";`;

    const rtoModules = await generateRtoModules({
      modulePaths: ["./main"],
      astProvider: (modulePath) => {
        if (modulePath === "./main") return parseTypeOnly({ source: source1 });
        if (modulePath === "./a") return parseTypeOnly({ source: sourceA });
        if (modulePath === "./b") return parseTypeOnly({ source: sourceB });
        if (modulePath === "./c") return parseTypeOnly({ source: sourceC });
        throw new Error(`Unknown module: ${modulePath}`);
      },
      returnRtoModules: true,
    });

    const rtoModule = rtoModules?.["./main"];
    expect(rtoModule?.imports).toHaveLength(3);
    expect(rtoModule?.imports?.map((imp) => imp.from)).toEqual(["./a", "./b", "./c"]);
  });
});
