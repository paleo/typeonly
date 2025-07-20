# How to Write a TIP (Thorough Implementation Plan)

This is a procedure for a planning-only task. Help the user designing an implementation plan about improving this project.

When the user asks you for a TIP, he MUST provide a DRAFT: this is a message about what to do. If he didn't, then he must be asked to provide it.

Use the DRAFT as a starting point, but do not trust it. Investigate yourself in the monorepo, find the relevant source code, think carefully, take the time to understand how it currently works and what has to be done.

Guidelines:

- If you have any doubt, ask for clarifications.
- The implementation plan will be a prompt for a coding agent, so help it by explaining what you discovered.
- Start by some context: explain how it works currently, and how it will works after the task is done.
- Mention a way to find important source files: by giving file paths, or a function name to search for example.
- Do not repeat any documentation from the `_docs/` directory. Instead, mention in the prompt what needs to be read.
- If the DRAFT contains code, and if you think it is relevant, then include it in the implementation plan. Include every information from the DRAFT that is useful, but do not copy-paste the DRAFT as-is.
- Your implementation plan must end with an additional last step:

    > Refactoring Step: Read the source files that have been modified and apply the _Refactoring & Programming Principles_ procedure (`_docs/Refactoring & Programming Principles.md`) where relevant.

- Append a last paragraph after the implementation plan, with the following text:

    > Do not trust this implementation plan blindly. Be sure you understand the codebase and the plan by yourself before to apply it.

Write your plan in a new `_plans/<here-the-new-plan-name>.md` markdown file (do not overwrite an existing one). When you think the plan is complete, read it again with a critical eye, edit it to improve it. Repeat until you think it's solid.

_Important Note: There will be lint errors in the markdown file you write. Ignore them. NEVER FIX LINT ERRORS IN THE TIP._
