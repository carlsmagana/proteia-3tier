# Repository Guidelines

## Project Structure & Module Organization
The Vite + React source lives in `src/main.tsx` and the `components/` directory. Feature dashboards sit under `components/`, with charts isolated in `components/charts/` and shared primitives in `components/ui/`. Domain data contracts and sample loaders are kept in `data/consolidated-products.ts`. Global styles and Tailwind tokens live in `styles/`, while `utils/` houses cross-cutting helpers. Keep design notes or wider documentation in `guidelines/` and stage assets under `data/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Start the live dev server via `npm run dev` (defaults to http://localhost:3000). Run `npm run build` to type-check with `tsc` and emit a production bundle, and `npm run preview` to smoke-test the built output locally. When adding new scripts, mirror them in the README and this guide.

## Coding Style & Naming Conventions
Follow TypeScript best practices with 2-space indentation, descriptive camelCase for variables and functions, and PascalCase for components. Co-locate component-specific styles via Tailwind utility classes; extend shared tokens in `styles/globals.css`. Keep props interfaces minimal and strongly typed. Use stable kebab-case IDs for chart keys and aria attributes. Prefer functional components, hooks, and early returns for clarity.

## Testing Guidelines
Testing is not wired in yet—plan to introduce `vitest` with `@testing-library/react` and place suites under a `tests/` folder mirroring component paths (e.g., `tests/ProductDiversityDashboard.test.tsx`). Target data adapters in `data/` to ensure CSV shape regressions surface quickly. Add lightweight fixtures beside each test or under `data/fixtures/`. Running `npx vitest run --coverage` is the expected pattern once tests land.

## Commit & Pull Request Guidelines
Use imperative, present-tense commit subjects under 72 characters (e.g., "Add price distribution chart"). Group related UI and data tweaks together and reference touched modules in the body when useful. Pull requests should include: purpose summary, before/after screenshots for visual updates, validation steps (`npm run dev`, `npm run build`), linked issue or task IDs, and any schema or dependency changes. Flag sample data updates so downstream consumers refresh their local copies.

## Data & Configuration Notes
`data/consolidated-products.ts` defines the canonical product shape powering every chart—update it before wiring new metrics. Align color or spacing changes with Tailwind tokens in `styles/globals.css`. When introducing third-party packages, update both `package.json` and any deployment notes so the environment stays reproducible.
