# PhysiX contributor instructions

These instructions apply throughout this repository. Read the relevant source and assignment documents before changing behavior. The repository currently contains a Vite starter and an architectural scaffold; empty files are not implemented features.

## Project context and sources

PhysiX is the Phy6 / Group 04 CS300 project: a browser-based interactive physics laboratory with prepared Guided experiments, supported Open Laboratory assembly, measurements, repeated trials, and mandatory Level 2 contextual AI assistance for the final demo. Guided Lab is primary; a bounded Open Lab is secondary. The target audience is Grade 11 Physics (Kết nối tri thức), with teachers using the same experiment UI for demonstrations. Desktop/laptop use is the initial target.

- Read [README.md](README.md) for the 2026-10-26 setup audit, roadmap, and unresolved technical decisions.
- The approved product-direction baseline is **`PHYSIX_PA2_SKILL.md` v1.1 (2026-10-27)**, provided by the Product Owner. Confirm its canonical shared location before adding a repository link. The official PA2 brief and RUP templates still govern submission requirements. Apply newer explicit approved decisions if they supersede it. Mark unresolved claims `[NEEDS-VERIFICATION]` rather than guessing.
- Course deliverables come from [PA0 instructions](<Project Assignments/PA0/PA0-24A01-Group registration-Tools setup.docx.md>), [PA1 rubric](<Project Assignments/PA1/PA1.pdf>), and [PA2 rubric](<Project Assignments/PA2/PA2.pdf>).
- Product evidence lives in [the PA0 proposal](<Project Assignments/PA0/PA0_PhysiX_Proposal.docx.md>), [PA2 Vision](<Project Assignments/PA2/02_Vision/PhysiX_Vision.docx.md>), [PA2 plan](<Project Assignments/PA2/01_Project_Plan/PhysiX_Project_Plan.docx.md>), and [PA2 use cases](<Project Assignments/PA2/03_UseCase_Specs/PhysiX_UseCase_Specs.docx.md>).
- **[APPROVED]** The final executable demos are **Simple Pendulum and Ohm's Law**. Free Fall and Light Refraction are not committed final-demo requirements. PA2 documentation must cover all *verified* experimental activities in Grade 11 Kết nối tri thức, but that does not require implementing every documented experiment.
- **[APPROVED]** No account registration, class management, grading, LMS, homework submission, or CSV export in the current core. Teachers use the same lab UI, not a separate portal. English UI copy first with localization-friendly structure.
- Surface conflicts with the approved baseline and official coursework instead of treating historical PA1 statements or unapproved drafts as current decisions. Preserve assignment artifacts unless their revision is part of the task.

## Repository and commands

The application package is `physix-platform/`; this is currently a single-package repository, not an npm workspace. Run npm commands there. GitHub workflows belong in the repository-root `.github/workflows/` and must set the application working directory explicitly.

```powershell
cd physix-platform
npm ci
npm run dev
npm run build
npm run lint
```

Use the committed `package-lock.json`. The installed Vite/Vitest versions inspected on 2026-10-26 support Node 22.12+ within Node 22; the audit ran on Node 22.15.0. A shared runtime pin remains to be added.

Only `dev`, `build`, `lint`, and `preview` scripts currently exist. Vitest and Playwright are dependencies, but test scripts/configuration and meaningful tests are unfinished. `npx vitest run` currently fails because both scientific test files are empty. Do not report empty suites as passing. Docker, Compose, CI, and environment example files are also placeholders.

`src/main.tsx` currently mounts `src/App.tsx`. Do not create a second disconnected entry point under `src/app/`. Coordinate any move with `index.html` and imports.

## Architecture to maintain as implementation grows

- `src/simulation-core/`: authoritative pure TypeScript contracts, solvers, validation, and fixed-timestep stepping. No React, Three.js, DOM, Zustand, or external service dependencies. UI and meshes consume calculated state and measurements rather than calculating competing physics values.
- `src/experiments/`: concrete experiment implementations and registry. Keep mathematical behavior testable without a renderer.
- `src/rendering/`: Three.js / React Three Fiber / Drei scene presentation, cameras, instruments, and pointer interactions. Translate gestures into validated simulation actions.
- `src/store/`: application coordination and bounded telemetry buffers. Avoid tying numerical integration or high-frequency samples to React render frequency.
- `src/content/`: versioned curriculum, apparatus catalog, and schemas. Validate JSON and references; record actual textbook verification rather than copying example sign-offs.
- `src/services/`: external adapters, including future AI integration as needed. The final demo requires contextual Level 2 AI, but the experiment must continue with deterministic built-in instructions if AI/network access fails. `supabase/` is scaffolded, not proof that auth/persistence is core or implemented.
- Add `physics-rapier/`, feature modules, and assets when implemented. Rapier is optional for collision/joint behavior and should load only where needed; do not make it the unverified authority for scientific measurements.

The roadmap proposes `dt = 1 / 120 s`, independently of render frequency, with interpolation for presentation. Bound catch-up work and define pause/reset behavior. Use SI units internally, explicit display conversions, finite parameter bounds, and reproducible initial conditions. Seed noise when testing error-aware measurements.

Scientific tests must specify reference equations, assumptions, input ranges, and tolerances. The proposed <=1% error criterion needs an appropriate domain (for example, small-angle pendulum periods) and an absolute tolerance near zero. Do not claim it for every model without evidence. Report performance with hardware/browser details and measured frame/step statistics.

## Interaction and data contracts

- **[APPROVED]** Guided Lab is the default entry; each experiment has its own prepared 3D workspace. Validate step-by-step completion and give recoverable feedback for invalid/out-of-order actions. Show the bounded Open Lab option at the bottom-right; allow exploration after the Guided flow and never promise arbitrary apparatus combinations.
- **[NEEDS-VERIFICATION]** Pendulum and Ohm need different apparatus, steps, parameters, error cases, and physical assumptions. Confirm detailed flows against verified experiment procedures and approved use-case specifications before enforcing step names or restrictions. Do not require CSV export.
- **[APPROVED invariant]** Recorded trials needed for comparison must not be silently lost on trial reset. **[PROPOSED]** `Reset Trial` retains recorded trials; `Next Trial` returns to parameter setup; `Restart Experiment` requests confirmation before clearing recorded data. Final labels, exact transitions, and reset semantics need agreement in experiment-specific specs.
- **[APPROVED]** Both demos must provide live measurements, labeled data tables, relevant graphs, and multi-trial comparison derived from the same authoritative simulation state. Recorded rows are snapshots. Label units, compare compatible quantities, and handle invalid samples without losing valid data. Export is future scope.
- **[APPROVED]** Level 2 AI is mandatory for the final demo: it must know the selected experiment and current Guided step, explain concepts/procedures, assist with troubleshooting, and request confirmation before supported changes. AI output cannot override deterministic physics or validation. If the provider fails, keep the lab usable with built-in instructions. Provider/model/API architecture and acceptance tests remain `[NEEDS-VERIFICATION]`.
- Keep private AI keys and any future service-role credentials server-side. Treat all browser-exposed `VITE_*` values as public. If persistence is later approved, design privacy and access controls explicitly; do not introduce authentication as a current core requirement.

## Validation and documentation

For code changes, run the build and lint checks, plus meaningful tests for affected behavior once available. For solver changes, include independent reference and edge-case checks; for user workflows, cover state transitions and reset/data preservation. Document commands run, failures, and untested behavior honestly.

For documentation-only edits, check local links and consistency with the repository. **Sprint 2** is for requirements, prototypes, research, and small feasibility spikes; official feature implementation begins in **Sprint 3**. The scaffold is not a working 3D demo. Distinguish planned, scaffolded, implemented, and verified work. Never invent benchmark scores, interview evidence, teacher approval, Jira progress, or test results.

Keep scope, use-case identifiers, UI labels, and acceptance criteria aligned across current working documents. Course artifacts must retain revision history; PA2 submission formatting requires blue text for revisions in the submitted documents. Markdown exports alone do not prove that formatting is present.

Use root `docs/` for course-oriented management, requirements, analysis/design, and test artifacts. Application engineering documentation currently has a separate home at `physix-platform/docs/`; link the two rather than maintain conflicting copies. Empty directories do not survive Git clones: add substantive files or deliberate `.gitkeep` markers where needed.
