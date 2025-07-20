# Code Style Guidelines

## Formatting & Structure

- **Encoding & Indentation**: UTF-8 encoding with 2-space indentation
- **Line Width**: 100 characters maximum
- **Semicolons**: Always use semicolon syntax
- **Empty Lines**: Keep empty line between top-level functions, classes, interfaces
- **No Multiple Blank Lines**: Multiple consecutive blank lines should not be written
- **Function Length**: Avoid exceeding ~50 lines per function implementation

## Imports & Modules

- **ESM Syntax**: Always use ESM import syntax (`import { X } from "y.js"`)
- **Import Extensions**: Import extensions are required (`useImportExtensions: "error"`)
- **No Recursive Imports**: Avoid importing modules recursively
- **Code Order**: (1) exported vars, (2) internal vars, (3) exported functions, (4) internal functions
- **Function Order**: Calling functions first, helper functions after

## TypeScript Conventions

- **No Enums/Namespaces**: Never use `enum` and `namespace`
- **Interface over Type**: Prefer interface declarations over type aliases
- **Generic Parameters**: Single capital letters (`T`, `K`, etc.)
- **Variable Declarations**: Prefer `const` over `let`
- **Increment/Decrement**: Prefer `++i` and `--i` over `i++` and `i--`
- **Error Construction**: Prefer `new Error()` over `Error()`
- **Undefined over Null**: Prefer `undefined` over `null`
- **Property Handling**: No differentiation between absent property and `undefined` value

## Code Organization

- **Top-level Declarations**: Prefer `function` and `class` declarative syntax over constants
- **Single Responsibility**: Functions should have single responsibility
- **Context over Classes**: Prefer functions with context object instead of classes
- **Early Returns**: Use early returns to simplify code flow
- **Pass Calculated Values**: Pass previously calculated values between functions instead of recalculating

## Code Quality

- **No Dead Code**: Unused code should not be kept (YAGNI principle)
- **No Commented Code**: Unless accompanied by valid explanation
- **No Duplicated Logic**: Avoid duplicated code and logic
- **Elegant Solutions**: Strive for elegant solutions from first implementation
- **Self-Explanatory Code**: Keep code clean and self-explanatory rather than adding comments
- **Meaningful Names**: Use function and variable names that clearly convey intent
- **Avoid Redundant Operations**: Especially expensive ones like image conversion
- **Inline Comments**: Only add when the code's purpose isn't obvious from its structure
- **Comment Guidelines**: If you add too much inline comments, consider creating and calling a function instead

## Biome Configuration

- **No Explicit Any**: `noExplicitAny` disabled (allows `any` type)
- **Parameter Assignment**: No parameter reassignment (`noParameterAssign: "error"`)
- **Const Assertions**: Use `as const` assertions (`useAsConstAssertion: "error"`)
- **Self-Closing Elements**: Use self-closing JSX elements (`useSelfClosingElements: "error"`)
- **Single Variable Declarator**: One variable per declaration (`useSingleVarDeclarator: "error"`)

## Getters/Setters

- **No Exceptions**: Getter/setter implementations must never throw exceptions

## Commit Conventions

- **Format**: `<type>: [#<issue>] <description>`
- **Linter Changes**: Changes to linter rules must be discussed before implementation
