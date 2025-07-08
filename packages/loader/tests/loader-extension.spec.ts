import { describe, expect, test } from "vitest";
import { loadModules } from "../src/api.js";

describe("Loader File Extension Support", () => {
  test("should handle module paths with and without extensions", async () => {
    // Test that modules can be loaded regardless of extension in path
    const rtoModule = {
      namedTypes: [
        {
          name: "ABC",
          exported: true,
          kind: "name" as const,
          group: "primitive" as const,
          refName: "string",
        },
      ],
    };

    const modules = await loadModules({
      modulePaths: ["./a"],
      rtoModuleProvider: async (modulePath) => {
        // This should work for both "./a", "./a.ts", "./a.d.ts", etc.
        if (
          modulePath === "./a" ||
          modulePath === "./a.ts" ||
          modulePath === "./a.d.ts" ||
          modulePath === "./a.js"
        ) {
          return rtoModule;
        }
        throw new Error(`Unknown module: ${modulePath}`);
      },
    });

    expect(modules["./a"]).toBeDefined();
    expect(modules["./a"].namedTypes?.ABC).toBeDefined();
  });

  test("should handle RTO modules with imports that have removed extensions", async () => {
    // Simulate RTO modules where extensions were removed during generation
    const rtoModuleA = {
      namedTypes: [
        {
          name: "BaseType",
          exported: true,
          kind: "name" as const,
          group: "primitive" as const,
          refName: "string",
        },
      ],
    };

    const rtoModuleB = {
      imports: [
        {
          from: "./a", // Extension removed during RTO generation
          namedMembers: [{ name: "BaseType" }],
        },
      ],
      namedTypes: [
        {
          name: "ExtendedInterface",
          exported: true,
          kind: "interface" as const,
          properties: [
            {
              name: "base",
              type: {
                kind: "importedRef" as const,
                refName: "BaseType",
              },
            },
          ],
        },
      ],
    };

    const modules = await loadModules({
      modulePaths: ["./b"],
      rtoModuleProvider: async (modulePath) => {
        if (modulePath === "./a") return rtoModuleA;
        if (modulePath === "./b") return rtoModuleB;
        throw new Error(`Unknown module: ${modulePath}`);
      },
    });

    expect(modules["./a"]).toBeDefined();
    expect(modules["./b"]).toBeDefined();
    expect(modules["./a"].namedTypes?.BaseType).toBeDefined();
    expect(modules["./b"].namedTypes?.ExtendedInterface).toBeDefined();

    // Verify the import relationship works
    expect(modules["./b"].imports).toBeDefined();
    expect(modules["./b"].imports?.[0]?.from).toBe(modules["./a"]);
  });

  test("should handle namespaced imports with extension-less paths", async () => {
    const rtoModuleA = {
      namedTypes: [
        {
          name: "TypeA",
          exported: true,
          kind: "name" as const,
          group: "primitive" as const,
          refName: "string",
        },
        {
          name: "TypeB",
          exported: true,
          kind: "name" as const,
          group: "primitive" as const,
          refName: "number",
        },
      ],
    };

    const rtoModuleB = {
      namespacedImports: [
        {
          from: "./a", // Extension removed during RTO generation
          asNamespace: "TypesA",
        },
      ],
      namedTypes: [
        {
          name: "CombinedInterface",
          exported: true,
          kind: "interface" as const,
          properties: [
            {
              name: "propA",
              type: {
                kind: "importedRef" as const,
                refName: "TypeA",
                namespace: "TypesA",
              },
            },
            {
              name: "propB",
              type: {
                kind: "importedRef" as const,
                refName: "TypeB",
                namespace: "TypesA",
              },
            },
          ],
        },
      ],
    };

    const modules = await loadModules({
      modulePaths: ["./b"],
      rtoModuleProvider: async (modulePath) => {
        if (modulePath === "./a") return rtoModuleA;
        if (modulePath === "./b") return rtoModuleB;
        throw new Error(`Unknown module: ${modulePath}`);
      },
    });

    expect(modules["./a"]).toBeDefined();
    expect(modules["./b"]).toBeDefined();
    expect(modules["./b"].namespacedImports).toBeDefined();
    expect(modules["./b"].namespacedImports?.[0]?.from).toBe(modules["./a"]);
  });
});
