# Bootstrapping a docs/ Directory

A reference for creating a `docs/` directory in a project that has none.

## 1. Analyze the Codebase

Investigate the project to discover essential knowledge:

- Look for existing agent instructions, READMEs, architecture docs, and inline documentation.
- Read key source files to understand the project structure, patterns, and conventions.
- Identify areas where documentation would save time for newcomers.

## 2. Identify Document Candidates

Group related knowledge into potential documents. Common types:

- **Architecture** — system overview, key abstractions, data flow.
- **Code style** — formatting, naming, patterns specific to the project.
- **Testing** — how to run tests, write new tests, test conventions.
- **Component-specific guides** — one per major module or subsystem.
- **Setup / getting started** — environment setup, first run, prerequisites.

Aim for 40–80 lines per document. If a topic is too broad, split it.

## 3. Discuss with the User

Present findings and the proposed doc layout:

- List each proposed document with a tentative title and one-line summary.
- Suggest a directory structure (flat or with subdirectories).
- Get approval before writing. Adjust based on feedback.

## 4. Write the Documents

Follow docfront conventions:

- Use kebab-case file names, shell-safe.
- Start each file with YAML frontmatter (`title`, optionally `summary` and `read_when`).
- Keep content brief and specific to the project — no generic filler.

After writing, run `docfront --check` to verify all files pass validation.
