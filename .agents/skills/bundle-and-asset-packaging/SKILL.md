---
name: bundle-and-asset-packaging
description: Standards for Rollup bundling, asset generation, and backwards compatibility outputs.
---

# Bundle and Asset Packaging Standards

Build system configurations for bundling JavaScript artifacts and embedded assets.

## Dual Output Bundling
- `rollup.config.mjs` must export both `appliance-card.js` and `smartthings-card.js` outputs:
  ```javascript
  output: [
    { file: 'appliance-card.js', format: 'es' },
    { file: 'smartthings-card.js', format: 'es' },
  ]
  ```
- This ensures existing HACS installations requesting `smartthings-card.js` do not encounter HTTP 404 errors.

## Asset Generation
- Execute `generate-assets.js` when modifying or adding icon sets in `images/` to update `src/assets.ts`.

## TypeScript Versioning
- Keep `typescript` pinned to `^5.6.3` in `package.json` to prevent `@rollup/plugin-typescript` target symbol lookup errors.
