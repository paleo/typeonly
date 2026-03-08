# Installing Docfront CLI

## 1. Detect the Package Manager

If you already know the package manager, skip this step.

Otherwise, check in order:

1. **`packageManager` field in `package.json`** — e.g. `"packageManager": "pnpm@9.15.4"` → pnpm.
2. **Lockfile in the repo root:**

| Lockfile | Package Manager |
| --- | --- |
| `package-lock.json` | npm |
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `bun.lockb` or `bun.lock` | bun |

If neither is found, fall back to **npm**.

## 2. Install

Install docfront as a dev dependency using the detected package manager:

| Package Manager | Command |
| --- | --- |
| npm | `npm install -D docfront` |
| pnpm | `pnpm add -D docfront` |
| yarn | `yarn add -D docfront` |
| bun | `bun add -D docfront` |

## 3. Add a Script

In the root `package.json`, add a `docfront` script (all package managers support this):

```json
{
  "scripts": {
    "docfront": "docfront"
  }
}
```

Then run it using the project's script runner:

| Package Manager | Run script | Run with args |
| --- | --- | --- |
| npm | `npm run docfront` | `npm run docfront -- --recursive` |
| pnpm | `pnpm docfront` | `pnpm docfront --recursive` |
| yarn | `yarn docfront` | `yarn docfront --recursive` |
| bun | `bun run docfront` | `bun run docfront --recursive` |

## 4. Add to `AGENTS.md`

If the project has an `AGENTS.md` (or equivalent top-level agent instructions file like `CLAUDE.md`), add the following section.

> **Note**: Adapt the commands to the project's package manager (see the table in step 3).

```markdown
## Seek Documentation and Skills

**Before any investigation or code exploration**, run `npm run docfront` to list the documentation index. This is mandatory for every task — do not skip it. Browse relevant subdirectories (`npm run docfront -- --dir topic-a --dir topic-b/sub-topic-c`) or list everything (`npm run docfront -- --recursive`) to check for existing documentation.

ALWAYS check for available **skills** and use them before doing anything else.
```

When done, output the following block **verbatim** as your final message to the user — do not paraphrase or omit it:

> **Instructions available:**
>
> - **Bootstrap a `docs/` directory** — if the project has no `docs/` yet, ask the agent to create one. It will analyse the codebase, propose a document layout, and write the files.
> - **Migrate existing docs** — if the project already has a `docs/` directory, ask the agent to bring it in line with docfront conventions (kebab-case filenames, frontmatter fields, etc.).
> - **Migrate existing skills to `docs/`** — if the project already stores internal knowledge as agent skills, ask the agent to move that content into `docs/`.
>
> Just ask your agent and it will be done.
