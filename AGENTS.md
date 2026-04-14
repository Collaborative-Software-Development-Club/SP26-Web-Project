# Repository Guidelines

## Project Structure & Module Organization
- `web-app/` contains the Next.js 16 frontend. Route groups in `web-app/app/` are split by feature: `(profile)`, `(chat)`, `(housing)`, and `(match)`. Keep feature-local UI in `_components/`, server actions in `_actions.ts`, shared hooks in `hooks/`, shared state in `contexts/`, and reusable utilities in `lib/`.
- `web-app/components/ui/` holds shared Shadcn UI primitives. Static assets live in `web-app/public/`, and mock data lives in `web-app/mock/`.
- `scraper/` contains the housing ingestion pipeline: `osu-web-scraper.py`, `upload-to-supabase.py`, `supabase_setup.sql`, and `addresses.txt`.

## Build, Test, and Development Commands
- `cd web-app && pnpm install` installs frontend dependencies. Prefer `pnpm` because `pnpm-lock.yaml` is committed.
- `cd web-app && pnpm dev` starts the local app at `http://localhost:3000`.
- `cd web-app && pnpm lint` runs ESLint with Next.js core-web-vitals and TypeScript rules.
- `cd web-app && pnpm build` checks the production build before opening a PR.
- `cd scraper && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` sets up the scraper environment.
- `cd scraper && python osu-web-scraper.py` collects listing data; `python upload-to-supabase.py` uploads it.

## Coding Style & Naming Conventions
- Follow `web-app/PROJECT_CONVENTIONS.md`: use kebab-case filenames, function declarations for React components, and named exports except for Next.js `page.tsx` and `layout.tsx`.
- Prefer server components unless interactivity is required. Keep auth-related server logic in `@/lib/auth`.
- Use Shadcn components from `web-app/components/ui/` before introducing custom controls. Match the formatting of the surrounding file and run `pnpm lint` before pushing.

## Testing Guidelines
- No Jest, Vitest, or Pytest suite is configured yet. Treat `pnpm lint` and `pnpm build` as the minimum validation steps, then manually smoke-test the affected routes or scraper flow.
- If you add automated tests, colocate frontend tests as `*.test.ts(x)` near the feature or add a dedicated `tests/` directory for Python utilities.

## Commit & Pull Request Guidelines
- Recent commits use short sentence-case summaries such as `Updated profile page` and `Fixed home page view issue`. Keep commit subjects concise, action-oriented, and feature-specific.
- PRs should include a brief summary, linked issue or task, screenshots for UI changes, and notes for any Supabase, env, or scraper-output changes.
- Review `CODEOWNERS` before requesting review; ownership is already mapped by feature directory.

## Security & Configuration Tips
- Do not commit `.env*`, scraper CSV/JSON outputs, or `.next/` artifacts. Keep Supabase credentials local in `web-app/.env.local`.
