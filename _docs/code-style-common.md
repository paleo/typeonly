# Common Code Style Guidelines

## General Rules

- Use UTF-8 encoding with 2-space indentation, 100-char line width
- Use interface declarations over type aliases
- Dead (unused) code SHOULD NOT be kept (_YAGNI principle_).
- Multiple consecutive blank lines SHOULD NOT be written.
- Changes to linter rules MUST be discussed before being implemented.
- Code SHOULD NOT contain commented out code, unless accompanied by a valid explanation in comments.

## Code Organization

- Always use ESM import syntax for imports (e.g., `import { X } from "y.js"` instead of `require`)
- Order code: (1) exported vars, (2) internal vars, (3) exported/public functions first, (4) internal/helper functions after
- Follow function order: calling functions first, helper functions after
- Avoid import modules recursively.

## Code Quality Standards

- Strive for elegant solutions from the first implementation
- Avoid redundant operations, especially expensive ones like image conversion
- Avoid duplicated code and logic
- Keep functions small with a single responsibility
- Pass previously calculated values between functions instead of recalculating
- Prefer writing functions with a context object instead of a class
- Use early returns to simplify code flow when possible
- Keep code clean and self-explanatory rather than adding explanatory comments
- Only add inline comments when the code's purpose isn't obvious from its structure
- If you add too much inline comments, then it is a sign that a function should be created and called instead
- Use function and variable names that clearly convey intent, reducing the need for comments
- Avoid exceeding the height of one screen (~50 lines) for the implementation of a function, consider the _Single Responsibility Principle_ for dividing.

## TypeScript, JavaScript

- Use the semicolon syntax.
- Never use `enum` and `namespace`.
- Prefer `const` over `let`.
- Prefer `undefined` over `null`.
- Prefer `++i` and `--i` over `i++` and `i--`.
- Prefer `new Error()` over `Error()`.
- At the top level, prefer the `function` and `class` declarative syntax over creating them as constants.
- Keep an empty line between top-level functions, classes, interfaces.
- Implementation of a getter or setter (EcmaScript 5 syntax) must never throw exceptions.
- Prefer interface declarations over type aliases.
- Prefer a single capital letter for generics parameters, such as `T`, `K`, etc.
- We don't want to differentiate between an absent property and a property with an `undefined` value.
