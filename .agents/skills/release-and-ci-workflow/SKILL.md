---
name: release-and-ci-workflow
description: GitHub Actions, Release-Drafter, and HACS validation workflow standards.
---

# Release and CI Workflow Standards

Guidelines for repository GitHub Actions workflows and automated release processes.

## Workflow Rules
1. **Action Pinning**:
   - Pin third-party GitHub Actions to 40-character commit SHAs with version comments (e.g. `uses: actions/checkout@3d3c42e5... # v7.0.1`).
2. **Auto Labeler**:
   - Keep dedicated `.github/workflows/autolabeler.yaml` using `release-drafter/release-drafter/autolabeler@eada3c... # @v7`.
   - Autolabeler regex patterns in `.github/release-drafter.yml` must use plain strings without `/.../i` wrappers (e.g., `'^ci'`, `'^feat'`, `'^fix'`).
3. **HACS Action**:
   - Workflow `.github/workflows/hacs.yml` must trigger on `push` to `main`.
   - Run `npm ci` and `npm run build` before `hacs/action` so generated JS assets exist in workspace root during validation.
