# Refactoring & Programming Principles

## Single Responsibility Principle (SRP) - Most Important

Every function should have one and only one reason to change. A function should do one thing well and have a single, clear purpose. When you see a large function with multiple inline comments explaining different sections, this is a strong indicator that the function violates SRP and should be broken down. Instead of adding comments like "// Step 1: validate input", "// Step 2: process data", "// Step 3: format output", create separate well-named functions like `validateInput()`, `processData()`, and `formatOutput()`. This makes code self-documenting, easier to test, and more maintainable.

## Don't Repeat Yourself (DRY)

Avoid duplicating code and logic throughout the codebase. When you find yourself writing similar code in multiple places, extract it into a reusable function or module. However, be careful not to over-abstract too early - sometimes apparent duplication is actually coincidental and the code serves different purposes that may evolve differently over time.

## You Aren't Gonna Need It (YAGNI)

Don't implement functionality until you actually need it. Remove dead code and unused features rather than keeping them "just in case". This principle helps keep the codebase lean and focused on actual requirements rather than hypothetical future needs.

## Keep It Simple, Stupid (KISS)

Prefer simple, straightforward solutions over complex ones. If there are multiple ways to solve a problem, choose the one that is easiest to understand and maintain. Complexity should only be introduced when it solves a real problem, not for its own sake.

## Separation of Concerns

Different aspects of a program should be handled by different modules or functions. For example, data validation, business logic, and presentation should be kept separate. This makes each part easier to understand, test, and modify independently.

## Fail Fast

Detect and report errors as early as possible in the execution flow. Use early returns to handle error conditions and edge cases before proceeding with the main logic. This makes debugging easier and prevents cascading failures.

## Composition Over Inheritance

Prefer building functionality by combining simple, focused objects rather than creating complex inheritance hierarchies. In this codebase, prefer functions with context objects instead of classes when possible.

## Principle of Least Surprise

Code should behave in ways that are intuitive and expected. Function names should clearly convey what they do, and the implementation should match the expectation set by the name. Avoid clever tricks that make code harder to understand.
