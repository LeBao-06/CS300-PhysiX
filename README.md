# PhysiX

PhysiX is an interactive 3D physics laboratory being developed by **Phy6 (Group 04)** for CS300 — Elements of Software Engineering. It aims to help students operate virtual apparatus, conduct guided experiments or explore supported setups in an Open Laboratory, record measurements, and compare trials. The approved final demo requires Level 2 contextual AI assistance (with confirmation before supported changes and a fallback when the AI service is unavailable).

**Repository audit snapshot as of 26 October 2026 (not re-audited here):** the repository contains a working React/Vite starter and a partial architectural scaffold. The folder separation is reasonable, but the setup is **not complete**, and no functioning physics laboratory has been implemented. The roadmap below describes intended work, not shipped capabilities.

## Run the current starter

Use Node.js and npm. This audit used **Node 22.15.0 / npm 11.6.4**; the installed Vite and Vitest engine declarations support Node 22.12+ within the Node 22 line. A repository runtime pin has not yet been added.

From the repository root:

```powershell
cd physix-platform
npm ci
npm run dev
```

Open the URL printed by Vite. The current screen is the Vite/React counter starter, not the proposed lab. No backend credentials are required by that starter.

```powershell
npm run build
npm run preview
npm run lint
```

These commands run inside `physix-platform/`. `build` runs TypeScript and generates `dist/`; `preview` serves that build locally. There is no root npm package or configured npm workspace.

The `.env.dev.example` and `.env.prod.example` files are empty. They do not yet define a usable configuration. When configuration is implemented, align environment filenames with Vite modes: ordinary `dev` and `build` use development and production modes, while `dev`/`prod` mode names require explicit configuration. Keep private credentials server-side; `VITE_*` values are public browser configuration.

## Repository layout

```text
CS300-PhysiX/
├── AGENTS.md                    Contributor and agent instructions
├── README.md                    Project overview and setup audit
├── .github/                     Workflow and issue-template placeholders
├── Project Assignments/         PA0–PA2 rubrics and project artifacts
├── docs/                        Course documentation categories (.gitkeep only)
│   ├── management/
│   ├── requirements/
│   ├── analysis-and-design/
│   └── test/
├── Dockerfile                   Empty placeholder
├── docker-compose.dev.yml       Empty placeholder
├── docker-compose.prod.yml      Empty placeholder
└── physix-platform/             Single frontend application package
    ├── package.json / package-lock.json
    ├── src/
    │   ├── main.tsx / App.tsx    Actual starter entry points
    │   ├── app/                 Router/provider placeholders
    │   ├── content/             Empty JSON catalogs, schemas, and two lessons
    │   ├── simulation-core/     Empty contracts, solvers, loop, validators
    │   ├── experiments/         Empty registry and Ohm's Law module
    │   ├── rendering/           Empty canvas and scene components
    │   ├── store/               Empty state modules
    │   ├── services/            Empty external-service adapters
    │   ├── components/ / utils/ Placeholder application helpers
    │   └── assets/              Starter artwork
    ├── public/                  Starter assets; planned asset directories
    ├── tests/scientific/        Two empty test files
    ├── docs/                    Engineering documentation directories
    └── supabase/                Empty local migration/function directories
```

Some directories exist only locally: Git does not preserve empty directories. The tree is an orientation map, not a claim that every directory contains tracked implementation.

Keep `.github/` at the repository root, as it is now, rather than under `physix-platform/` as shown in the pasted example. Workflows will need `physix-platform` as their working directory and the nested lockfile as their cache dependency path. A single application package is sufficient at this stage; a monorepo/workspace is not necessary merely to separate code by responsibility.

The PA0 instructions prescribe root `/src`, `/docs`, and `/pa`. This repository instead uses `physix-platform/src` and `Project Assignments/`, and names the design category `analysis-and-design`. These serve similar purposes but are not a literal match. Align the structure with course expectations or obtain acceptance of this documented mapping. Keep submitted snapshots separate from living documents and link root course docs to application engineering docs.

## Approved scope and proposed architecture

**[APPROVED — PHYSIX_PA2_SKILL.md v1.1, 27 October 2026]** PhysiX targets **Grade 11 Physics — Kết nối tri thức với cuộc sống**. PA2 documentation should specify all verified textbook experimental activities once the inventory is approved; the **final runnable demo** is limited to **Simple Pendulum and Ohm's Law**. A separate, pre-arranged 3D **Guided Lab** is the primary experience. A **bounded Open Lab** is secondary and available after completing the Guided flow, with its option at the bottom-right of the experiment UI. Both demos need live measurements, tables, graphs, and multi-trial comparison. **Level 2 contextual AI is mandatory**, with deterministic fallback if the provider fails. Teachers use the same UI; accounts, class management, grading, unrestricted apparatus assembly and CSV export are not current core. English UI first, with localization-ready strings.

**Baseline availability:** The approved `PHYSIX_PA2_SKILL.md` v1.1 is team-provided; its canonical shared URL/path has not yet been confirmed for this repository. For course submission, the official PA2 instructions and RUP templates take precedence over this product baseline.

### Technical direction

**[APPROVED technical direction]** React + TypeScript, Three.js through React Three Fiber (R3F), pure TypeScript experiment-specific scientific solvers independent from rendering, and Rapier only where rigid-body behavior warrants it. **[PROPOSED / NOT YET APPROVED]** Zustand coordination, Supabase persistence/server functions, and selections among chart/UI libraries. The 26 October audit found dependencies declared but integrations largely absent; Recharts and uPlot were both declared, Tailwind's Vite plugin was not configured, and shadcn/ui was not scaffolded. Verify against the latest checkout before asserting those findings are still current.

The central boundary is:

```text
User actions → validated experiment commands → authoritative simulation state
                                             ├→ 3D rendering
                                             └→ measurements → charts / trial snapshots
```

`simulation-core` must stay independent of React, Three.js, and external services. The **proposed, not yet validated** simulation timestep is 1/120 s, independent of rendering. Renderers and meters consume solver output. Rapier is reserved for labs needing collisions or joints and should load on demand.

**[APPROVED]** The demo experiments are **Simple Pendulum and Ohm's Law**. Free Fall and Light Refraction are **[FUTURE / PROPOSED]**, not committed demo scope. Each experiment has a specific Guided workflow, supported interactions, validation, and scientific model; Open Lab may reuse the same model within supported bounds. Measurements, data tables, graphs, multi-trial comparisons, and contextual Level 2 AI are **core requirements**, not optional follow-ups. Worksheets and persistence are unapproved proposals. No classroom/assignment management or unrestricted natural-language experiment generation in the current core.

Proposed engineering targets are <=1% numerical error under documented model assumptions, median >=60 FPS, p95 frame time <=20 ms, and physics step time <=4 ms on recorded target hardware. These are roadmap targets, not measured results or finalized PA2 Vision requirements. Define tolerances near zero, small-angle limits, and benchmark conditions before treating them as release gates.

## Setup audit against the supplied roadmap

| Area | Evidence in this checkout | Remaining work |
| --- | --- | --- |
| Frontend tooling | Package/lockfile, TypeScript, Vite, ESLint, React starter | Replace starter with the application; name package appropriately (`name` is currently `src`); pin shared Node/npm versions; decide strict TypeScript settings |
| Runtime integration | `src/main.tsx` mounts `src/App.tsx` | Router/providers are empty; planned `src/app/` layout must be connected without duplicate entry points |
| Simulation and 3D | All domain `.ts`/`.tsx` scaffold files are empty | Implement contracts, deterministic solvers, fixed-step loop, validation, scenes, interactions, and tests |
| Curriculum | Three schema files, two catalogs, two experiment JSON files existed but contained zero bytes at audit | Write validated schemas/content for approved demos; document all verified Grade 11 textbook experiments in the PA2 inventory, without treating additional lesson implementations as committed scope |
| Scientific testing | Vitest dependency and two empty files | Add test scripts/configuration and meaningful reference tests; isolate scientific, integration, and browser suites |
| Browser testing | Playwright dependency | Add configuration, browser installation instructions, server startup, WebGL smoke test, and lab flow tests |
| CI and issue reporting | Three workflow files and two issue templates are empty | Write executable workflows/templates; include build/lint, scientific tests, browser tests, and defined JS/WASM budgets |
| Performance and ADRs | No tracked ADR or benchmark results; reference log is empty | Record engine decision, comparison methodology, hardware, raw measurements, and scorecard |
| Assets and localization | Only starter public assets are tracked | Supply GLB models or procedural apparatus, port conventions, loading/error states, and locale resources; validate Rapier loading strategy |
| Persistence and AI | Supabase/AI dependencies or directories and empty adapters at audit | Implement mandatory contextual Level 2 AI with secure server-side keys, confirmation and fallback. Treat persistence/authentication as future proposals requiring approval |
| Docker and environment | Dockerfile, both Compose files, and both environment examples are empty | Implement if needed; Docker is not needed to run the current Vite starter. Add a `.dockerignore` before building an image |
| Documentation and handoff | Assignment exports and five PA1 screenshots exist | Populate working docs, reconcile scope, add verification evidence, and update the nested starter README |

The app `.gitignore` excludes `.env` and `*.local`, but does not generally exclude `.env.dev`, `.env.prod`, `.env.development`, or `.env.production`. Establish an ignore policy that excludes credential-bearing files while retaining examples before introducing those files. There is no root `.gitignore` covering future root-level local configuration.

Verification during this audit: **`npm run build` and `npm run lint` passed** for the starter. **`npx vitest run` failed** with “No test suite found” in both scientific files (zero tests). Build success does not establish simulation correctness, WebGL behavior, persistence, or roadmap completion. No fresh dependency install, browser suite, deployment, or target-hardware benchmark was performed.

## Assignment alignment and unresolved decisions

The [PA2 rubric](<Project Assignments/PA2/PA2.pdf>) was reported in the 26 October audit as due **1 November 2026**; verify against the latest LMS announcement. It requires revised plan and Vision documents with revision history and blue-font changes, a use-case model aligned with the Vision, detailed flows for each modeled use case, UI for at least three key use cases, weekly reports, and collaboration/tracking evidence. The submission directory/archive should follow `PA2-Group04` naming.

The **26 October 2026 audit** identified the following document gaps; they are historical findings that must be re-checked against the latest Google Drive/Jira documents, not claims of their current status:

- **Scope conflicts:** older PA2 drafts listed Pendulum/Projectile Motion, broad Grade 6–12 audiences, class administration, and account features. The approved baseline instead targets Grade 11 Kết nối tri thức, with Pendulum and Ohm final demos and no administrative core. Update the document owners' current artifacts and revision histories, not the submitted PA1 snapshots.
- **Use-case coverage:** the old UC01–UC06 and UC-01–UC-22 mappings cannot be treated as the approved registry. Linh and Bao must verify the Grade 11 textbook experiment inventory, and Khoi must approve the candidate list before Phuc freezes IDs and assigns experiment-specific execution UCs. Student is the primary actor; Teacher follows the same flows.
- **Scientific and UI details:** the earlier pendulum `>15°` versus `>20°` discrepancy, reset semantics, apparatus parameters, UI labels, and exact experiment steps still require evidence or agreement. Do not turn historical drafts into approved physical constraints.
- **PA2 formatting and evidence:** check exact RUP requirements, blue-font changes, specific revision history, traceability, updated weekly reports, peer review, and UI prototypes against the current official rubric and shared documents. The 26 October checkout cannot prove that newer Drive artifacts remain incomplete.
- **Interview evidence:** the older PA0 proposal listed four interviews and a survey; check the required interview count and any TA-approved alternative rather than treating the survey as a fifth interview.

The audit did not verify external Jira updates, current Drive revisions, or final submission acceptance.

## Roadmap and next steps

The pasted five-phase engineering sequence is useful, but its “Weeks 1–2 / PA2” label does not match the course calendar: PA2 is in Sprint 2. Use the dated course milestones when planning the remaining work.

| Course sprint | Dates (2026) | Planned milestone |
| --- | --- | --- |
| S1 — Inception | 5–18 October | PA0/PA1: proposal, initial plan/Vision, UI sketches |
| S2 — Elaboration | 19 October–1 November | PA2: requirements, approved scope, verified textbook inventory, use cases, UI prototypes, research, architecture comparison, and small feasibility spikes (not official feature implementation) |
| S3 — Elaboration | 2–15 November | PA3 / Build 1: start official implementation, architecture/interfaces, first Guided experiment, controls, measurements, reference tests |
| S4 — Construction | 16–29 November | PA4 / Build 2: agreed Guided/Open Lab subset, instruments, graphs, integration tests |
| S5 — Construction | 30 November–13 December | PA5 / Build 3: regression, usability/performance evidence, stable demo and handoff |

PA3–PA5 descriptions above follow the local project plan; their assignment rubrics are not included in this checkout.

Recommended execution order:

1. Sync repository guidance with the approved baseline; reconcile PA2 scope, approved experiment inventory, UC IDs/UI/report details, and engine-selection spike evidence. Account/classroom features are excluded from the current core unless a newer explicit Product Owner decision supersedes this.
2. Complete minimum engineering setup: runtime pin, build/lint/test scripts, meaningful scientific tests, Playwright smoke test, and functioning CI. Populate environment examples only for integrations actually used.
3. Starting Sprint 3, implement the two approved Guided experiment flows: curriculum → validated solver → 3D interaction → live measurements → data table/graph → preserved multi-trial comparison, with experiment-specific tests. CSV export is future scope.
4. Integrate **mandatory Level 2 contextual AI** (with confirmation and deterministic fallback) into the final demo; implement only the approved bounded Open Lab subset. Worksheets, persistence, extra experiments, and unrestricted sandbox features require separate approval.

There is no need to reproduce every filename in the proposed tree immediately. Implemented boundaries and demonstrated behavior are stronger completion evidence than empty files.

## Team and project references

| Member | Primary role |
| --- | --- |
| Đặng Trần Tuấn Khôi | Project Manager, Business Analyst |
| Trần Thiên Phúc | Software Architect, Developer |
| Võ Quốc Linh | Backend Developer, Tester |
| Trần Đặng Lê Huy | UI/UX Designer, Frontend Developer |
| Nguyễn Văn Lê Bảo | Developer, Tester |

- [PA0 proposal and user research](<Project Assignments/PA0/PA0_PhysiX_Proposal.docx.md>)
- [PA2 project plan](<Project Assignments/PA2/01_Project_Plan/PhysiX_Project_Plan.docx.md>)
- [PA2 Vision](<Project Assignments/PA2/02_Vision/PhysiX_Vision.docx.md>)
- [PA2 use cases](<Project Assignments/PA2/03_UseCase_Specs/PhysiX_UseCase_Specs.docx.md>)
- [PA1 UI screenshots](<Project Assignments/PA1/03_UI_Prototyping/screens/>)
- [Contributor instructions](AGENTS.md)
