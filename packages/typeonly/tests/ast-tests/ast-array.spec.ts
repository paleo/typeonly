import { parseTypeOnly } from "../../src/api"
import { AstArrayType, AstFunctionType, AstInterface, AstNamedType, AstProperty } from "../../src/ast"

describe("AST Specification for Array", () => {

  test("array with an identifier", () => {
    const source = `
type T1 = number[]
`
    const ast = parseTypeOnly({ source })
    const namedType = ast.declarations![0] as AstNamedType
    expect(namedType.type).toEqual({
      whichType: "array",
      itemType: "number",
    } as AstArrayType)
  })

  test("array with an interface", () => {
    const source = `
type T1 = {a: A}[]
`
    const ast = parseTypeOnly({ source })
    const namedType = ast.declarations![0] as AstNamedType
    const type = namedType.type as AstArrayType
    expect(type.whichType).toBe("array")
    expect(type.genericSyntax).toBe(undefined)
    const itemType = type.itemType as AstInterface
    expect(itemType.whichType).toBe("interface")
    expect((itemType.entries![0] as AstProperty).name).toBe("a")
  })

  test("array with a function", () => {
    const source = `
type T1 = (() => A)[]
`
    const ast = parseTypeOnly({ source })
    const namedType = ast.declarations![0] as AstNamedType
    const type = namedType.type as AstArrayType
    expect(type.whichType).toBe("array")
    expect(type.genericSyntax).toBe(undefined)
    const itemType = type.itemType as AstFunctionType
    expect(itemType.whichType).toBe("function")
  })
})