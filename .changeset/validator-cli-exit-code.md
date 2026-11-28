---
"@typeonly/validator-cli": patch
---

Fixed the CLI, which failed on every run with "Cannot access 'bufferEncodingValues' before initialization", and made it exit with code 1 on any failure.
