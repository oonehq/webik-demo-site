# Demo website editing contract

This is the website edited by the Webik local harness. The editor itself lives outside this directory.

- Modify only this website's app/, components/ui/ and public/ files.
- Keep Next.js App Router and existing styling; use Base UI components for interactive controls.
- Preserve components/inspector.tsx, its import in app/layout.tsx and data-webik-id selection hooks.
- Keep good desktop and mobile layouts, semantic markup and useful alternative text.
- Do not change package manifests or install dependencies without a developer request outside the harness.
- Do not commit, push, deploy, start servers, contact people, or create subagents. Git actions belong to the editor UI.
- Run npm run typecheck before finishing. Summarize the change in Czech.
- Studio Forma and project details are demo fixtures, not factual claims about a real business.
