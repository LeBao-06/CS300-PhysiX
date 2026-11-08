# Simple Pendulum — Physics Model Specification

| | |
|---|---|
| Jira | SCRUM-19 [PA3] Implement the first experiment physics model |
| Owner | Nguyễn Văn Lê Bảo (Physics Developer) |
| Reviewers | Trần Thiên Phúc (integration), Trần Đặng Lê Huy (measurement display) |
| Requirements | Vision 2.1 Feature 3; Use-Case Specification 2.3, UC03.1.1–UC03.1.4 |
| Code | `src/experiments/simple-pendulum/`, `src/simulation-core/` |
| Status | Implemented, unit-tested; not yet reviewed by the physics content expert |

This document is the source for the pendulum part of the SAD and for the reference tests (SCRUM-20).

## 1. Physical model

**Assumptions** (shown on the experiment introduction page, UC03.1.1):

1. The string is inextensible and massless, so the length *l* is constant.
2. The bob is a point mass; *l* is measured from the suspension point to the centre of the bob.
3. No air resistance and no friction at the pivot (no damping).
4. Uniform gravity, fixed at *g* = 9.8 m/s².
5. Motion stays in one vertical plane.

**Equation of motion** — the full (non-linear) pendulum equation:

$$\ddot\theta = -\frac{g}{l}\sin\theta, \qquad \theta(0)=\theta_0,\ \dot\theta(0)=0$$

θ is the angle from the vertical (rad), positive towards +x. The bob mass does not appear in the equation; it is validated and displayed only, which is what trials 3–4 demonstrate.

**Why non-linear and not θ(t) = θ₀ cos ωt.** The linear model makes the period exactly independent of the release angle, so the trial 5–6 comparison would be decided by the model rather than observed. The non-linear model reproduces the small real dependence on angle and still meets the Vision accuracy criterion (§4).

## 2. Reference formulas

| Name | Formula | Use |
|---|---|---|
| Small-angle period | T = 2π√(l/g) | Every user-facing comparison: results table, deviations, Vision 1 % criterion |
| Exact period | T = 4√(l/g)·K(sin(θ₀/2)) | Independent oracle for solver tests only |
| Measured period | T<sub>measured</sub> = t / N | From the stopwatch reading *t* and requested count *N* (UC03.1.4) |
| Individual deviation | \|T<sub>measured</sub> − T<sub>reference</sub>\| / T<sub>reference</sub> × 100 % | Guided pass ≤ 5 % for each of 6 trials |
| Pair ratio | R<sub>measured</sub> = T<sub>later</sub> / T<sub>earlier</sub>, R<sub>required</sub> = √(l<sub>later</sub> / l<sub>earlier</sub>) | √2 for trials 1–2, 1 for 3–4 and 5–6; pass ≤ 5 % |

K is the complete elliptic integral of the first kind, computed with the arithmetic–geometric mean: K(k) = π / (2·AGM(1, √(1 − k²))).

## 3. Parameters, units and bounds

All calculations use SI units. Conversions are explicit functions in `pendulumModel.ts` (`degToRad`, `radToDeg`, `gramsToKilograms`, `kilogramsToGrams`, `centimetresToMetres`). Display rounding is done only by the UI and never changes stored values.

| Parameter | Symbol | SI unit | Display unit | Allowed range | Notes |
|---|---|---|---|---|---|
| String length | l | m | m (2 decimals) | 0.20 – 1.50 m | Suspension point → bob centre |
| Bob mass | m | kg | g | 0.050 – 0.200 kg (50 – 200 g) | No effect on motion |
| Release angle | θ₀ | rad | ° | \|θ₀\| from 1° to 10° | Either side of the vertical |
| Gravity | g | m/s² | m/s² | fixed 9.8 | Not user-editable |
| Oscillation count | N | – | – | positive integer; 10 in Guided | Chosen by the user in Open Lab |

Guided plan (UC03.1.2 step 3, Use-Case Specification 2.3):

| Trial | l (m) | m (g) | θ₀ (°) | Pair varies |
|---|---|---|---|---|
| 1 | 0.50 | 100 | 10 | length |
| 2 | 1.00 | 100 | 10 | length |
| 3 | 0.80 | 50 | 10 | mass |
| 4 | 0.80 | 200 | 10 | mass |
| 5 | 0.80 | 100 | 10 | release angle |
| 6 | 0.80 | 100 | 5 | release angle |

**Invalid input handling.** `validatePendulumParameters` and `validateReleaseAngle` return every issue with a code (`NOT_A_NUMBER`, `BELOW_MIN`, `ABOVE_MAX`) plus the allowed range, so the UI can show "Allowed range: …" next to the control. Invalid values are never applied; the last valid value is kept. Bound checks use a relative tolerance of 10⁻⁹ so that exact boundary values survive unit conversion (10° → rad).

## 4. Numerical method and accuracy

- Integrator: classical RK4 on the state [θ, ω].
- Fixed step Δt = 1 ms, independent of the frame rate (`FixedTimestepAccumulator`). At most 250 steps (0.25 s) are run per frame; after a long pause the excess real time is dropped instead of freezing the browser.
- The bob is drawn with linear interpolation between the last two steps (`getRenderSnapshot`). Measurements always use the non-interpolated state (`getSnapshot`).
- Same parameters and step count → bit-identical results on any computer and frame rate (tested).

Simulated period for the Guided plan, compared with both references (measured from zero crossings in the solver):

| Trial | l (m) | θ₀ | 2π√(l/g) (s) | Exact (s) | Simulated (s) | vs 2π√(l/g) | vs exact |
|---|---|---|---|---|---|---|---|
| 1 | 0.50 | 10° | 1.41923 | 1.42193 | 1.42193 | +0.191 % | < 10⁻⁷ % |
| 2 | 1.00 | 10° | 2.00709 | 2.01092 | 2.01092 | +0.191 % | < 10⁻⁷ % |
| 3–5 | 0.80 | 10° | 1.79520 | 1.79862 | 1.79862 | +0.191 % | < 10⁻⁷ % |
| 6 | 0.80 | 5° | 1.79520 | 1.79605 | 1.79605 | +0.048 % | < 10⁻⁷ % |

Vision criterion — simulated period within 1 % of 2π√(l/g) — holds over the whole allowed domain (largest deviation +0.19 % at 10°). Energy drift over 60 s at l = 0.20 m, θ₀ = 10° is below 10⁻⁸ relative.

## 5. Time handling (agreed point with Huy)

- **Simulation time** starts at 0 at the moment of release and advances only in 1 ms steps while the bob swings.
- **The stopwatch is part of the simulation**, so its reading uses simulation time. Start and Stop record the simulation time reached when the input is processed; the stopwatch is never backdated to the release and never stops automatically after N oscillations.
- **Stop timer freezes both** the stopwatch and the pendulum (status `frozen`).
- If the browser falls behind and steps are dropped, both motion and stopwatch slow down together, so the measured t/N stays consistent with the motion.
- The solver also detects full cycles (`simulatedPeriodS`). This value is for tests and AI context; the Guided UI must not show it during data collection (UC03.1.2 step 8).

## 6. Interface for the 3D scene and the measurement UI

Import everything from `@experiments/simple-pendulum`.

```ts
const sim = new PendulumSimulation({ lengthM: 0.5, massKg: 0.1 });

sim.setParameters({ lengthM, massKg }); // setup only; refused if invalid
sim.arm();                              // "Run": bob becomes draggable, stopwatch = 0
sim.setDragAngle(angleRad);             // clamped to ±10°, returns the applied angle
sim.release();                          // refused below 1° (RELEASE_ANGLE_OUT_OF_RANGE)

// every frame (Phúc): advance with real elapsed seconds, then draw
sim.advance(deltaS);
const view = sim.getRenderSnapshot();   // view.bob.{x,y} in m, pivot at origin, +y up

sim.toggleTimer();                      // T key / button: start once, then stop (freezes)
const reading = sim.getSnapshot();      // reading.stopwatch.readingS for the live display
const m = sim.getMeasurement();         // { elapsedS, startedAtS, stoppedAtS } after Stop
sim.resetTrial();                       // Retry / Next trial: back to setup, same parameters
```

Run status: `setup → armed → swinging → frozen`, plus `error` if the solver produces a non-finite value (UC03.1.2 A5). Actions in the wrong status return `{ accepted: false, error }` and change nothing; the UI maps the error code to a message.

**Responsibilities.** The simulation does not store confirmed trials: the store keeps each confirmed row as a `PendulumTrialRecord` snapshot, so resetting a trial can never lose recorded data. Guided step gating uses `GUIDED_TRIAL_PLAN` and `matchesGuidedSetting`. Results use `evaluateTrial` and `assessGuidedMeasurements` (UC03.1.4 steps 5–6); the four conclusion groups are assessed elsewhere. No physics calculation should be duplicated in UI or rendering code.

## 7. Limits and open items

- Valid only inside the bounds in §3. Larger amplitudes are future scope (UC03.1.3 A4).
- No damping, string mass or finite bob size; real pendulums differ slightly.
- Release-angle tolerance between the dragged angle and the required Guided angle is still `[NEEDS-VERIFICATION]` in UC03.1.2 step 5; the solver records the actual release angle so the rule can be applied once decided.
- Length and mass bounds in Open Lab are pending review by the physics content expert.
- Content-expert review of this model is still required before Build 3 (Vision, Physics Consistency).

## 8. Verification

`npm run test:scientific` runs `tests/scientific/pendulumOde.test.ts`: exact-period and small-angle checks on a 5 × 3 grid of lengths and angles, energy conservation, frame-rate determinism, catch-up limit, input validation, run lifecycle and the Guided assessment arithmetic. The full reference suite with hand-calculated tables is SCRUM-20.
