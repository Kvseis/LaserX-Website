# Repository Guidelines

Whatever action you can do yourself, please do yourself. This includes starting apps and verification.

## Project Scope & Current State
LaserX is a Next.js site for industrial laser cleaning in Baku. Azerbaijani is the default language, with Russian, English, and Turkish versions. Use phone and WhatsApp CTAs for `+994553900028`; do not add a waitlist. Maintain the premium industrial visual system and identify AI-generated comparisons as illustrative rather than customer results. Use the `gpt-taste` skill for design changes; do not use Sites.

## Project Structure & Module Organization
- `src/app/(az)/` and `src/app/[locale]/`: default and translated routes.
- `src/components/`: shared pages, navigation, and sections.
- `src/app/globals.css`: visual system, animations, and responsive rules.
- `src/lib/messages/`: customer-facing copy and page metadata in all four languages.
- `src/lib/about-copy.ts`: About page content in all four languages.
- `public/images/`: optimized WebP production imagery.
- `scripts/visual-check.mjs`: desktop/mobile browser smoke test.
- `Logo/` and `Hero Photo/`: original supplied assets; preserve them.

## Build, Test, and Development Commands
- `npm install`: install locked dependencies.
- `npm run dev`: start the Webpack development server on `127.0.0.1:3000`.
- `npm run typecheck`: run TypeScript without emitting files.
- `npm run build`: create a production build.
- `npm run start`: serve the production build.
- `npm run check:visual`: verify desktop/mobile overflow, navigation, CTAs, and comparison controls; the dev server must already be running.
- `npm run check:about`: verify About page routes, translations, images, navigation, and responsive screenshots.

## Coding Style & Naming Conventions
Use TypeScript and two-space indentation. Name components with PascalCase and functions/variables with camelCase. Follow App Router filenames such as `page.tsx` and `layout.tsx`. Keep all four translation files in sync when updating customer-facing copy. Prefer semantic HTML, CSS variables, and restrained GSAP motion with reduced-motion support.

## Testing Guidelines
No unit-test framework or coverage threshold is configured. Before submitting, run type checking, a production build, and the browser smoke test. Manually review generated screenshots in `artifacts/` and test keyboard focus plus reduced-motion behavior when interaction code changes.

## Commit & Pull Request Guidelines
Use concise imperative commits, optionally prefixed with `feat:`, `fix:`, or `docs:`. Pull requests should explain the change, report verification commands, link relevant issues, and include desktop/mobile screenshots for visual changes.

## Security & Configuration
Keep credentials out of Git. Store secrets in ignored `.env*` files and never expose private values through `NEXT_PUBLIC_` variables.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
