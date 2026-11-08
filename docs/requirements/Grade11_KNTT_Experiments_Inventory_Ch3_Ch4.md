# Grade 11 Physics (*Kết nối tri thức với cuộc sống*) — Experimental Activity Inventory (Chapters 3–4)

**Document Metadata:**
- **Topic:** Official Curriculum Laboratory Activities Inventory for Chapters 3 and 4
- **Curriculum Source:** *Vật lí 11 — Kết nối tri thức với cuộc sống* (Nhà xuất bản Giáo dục Việt Nam)
- **Author / Reviewer:** Nguyễn Văn Lê Bảo (Physics Modeling & Verification Lead)
- **Reviewed by:** Võ Quốc Linh (Backend / Catalog), Đặng Trần Tuấn Khôi (Scope & QA)
- **Creation Date:** October 29, 2026
- **Status:** APPROVED BASELINE (Sprint 2)
- **Scope Notice:** In accordance with the project roadmap and user instructions, this inventory documents the sole textbook-explicit practical laboratory in Chapter 4 (**Lesson 26: Practice — Measuring Electromotive Force and Internal Resistance of an Electrochemical Cell**). Chapters 3 and other lessons are cataloged for future sprint adaptations.

---

## 1. Curriculum Classification and Taxonomy

The PhysiX project applies a rigorous three-tier taxonomy to all secondary-school curriculum experiments:

| Classification | Definition | Application to Chapters 3–4 |
| :--- | :--- | :--- |
| **`TEXTBOOK-EXPLICIT`** | Formal, fully detailed practical laboratory lessons titled *"Thực hành"* in the textbook, providing explicit apparatus lists, wiring schematics, measurement tables, and error evaluation formulas. | **Lesson 26 (Bài 26):** *Đo suất điện động và điện trở trong của pin điện hoá.* |
| **`TEXTBOOK-ILLUSTRATIVE`** | In-lesson illustrative demonstrations or qualitative classroom activities (e.g., electrostatic deflection, qualitative Ohm's Law $I-U$ observation) without formal multi-trial reporting templates. | Deferred to subsequent sprint cataloging. |
| **`TEAM-ADAPTED`** | Synthetic or open-ended sandbox assembly scenarios constructed by the development team to test component bounds in Open Laboratory mode. | Derived DC circuit variations (e.g., variable multi-resistor networks). |

---

## 2. Inventory Item: Lesson 26 (Bài 26) — Practical Experiment

### 2.1 Overview & Pedagogical Objectives
- **Lesson Title:** Bài 26. Thực hành: Đo suất điện động và điện trở trong của pin điện hoá (*Practice: Measuring Electromotive Force and Internal Resistance of an Electrochemical Cell*)
- **Textbook Chapter:** Chapter IV. Dòng điện — Mạch điện (*Electric Current — Electric Circuits*)
- **Educational Objective:**
  1. Experimentally determine the electromotive force ($\xi$) and internal resistance ($r$) of both an old (partially depleted) and a new (fresh) electrochemical cell using standard laboratory instruments.
  2. Master the operation and calibration of digital multimeters configured as DC Voltmeters and DC Ammeters.
  3. Plot empirical data points on a $U = f(I)$ coordinate system, construct the best-fit linear characteristic curve, and extract physical constants via graphical extrapolation and linear regression.
  4. Understand experimental errors and safety constraints, specifically why closed circuits must not be maintained continuously for extended durations.

---

### 2.2 Apparatus Catalog & Virtual Lab Asset Specifications

| Item # | Apparatus Name (Textbook) | English Technical Specification | Quantity | PhysiX 3D Asset / Instrument Representation |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Hai pin điện hoá loại 1,5 V (1 pin cũ, 1 pin mới) | Electrochemical dry cells (nominal $1.5\text{ V}$): one depleted cell, one fresh cell | 2 | 3D AA/D-cell battery models with labeled terminals ($+ / -$) and distinct visual wear textures. |
| **2** | Một biến trở $100\ \Omega$ | Slide-wire rheostat / variable resistor, rated $0\text{--}100\ \Omega$ ($2\text{ A}$) | 1 | 3D slider rheostat with movable wiper contact and resistance scale. |
| **3** | Hai đồng hồ đo điện đa năng hiện số | Digital multimeters (DMM), dual-channel display | 2 | 3D virtual DMMs with rotary function dials: one set to DC Voltage ($V_{\text{DC}}$, resolution $0.01\text{ V}$), one set to DC Current ($mA_{\text{DC}}$, resolution $0.1\text{ mA}$). |
| **4** | Dây nối | Insulated copper connecting wires with banana plugs / spade clips | 8 | Spline-based interactive 3D flexible wires with color coding (red: positive, black: ground). |
| **5** | Công tắc điện K | Single-pole single-throw (SPST) knife or push switch | 1 | 3D switch model with clear binary visual state (Open: 0 / Closed: 1). |
| **6** | Điện trở bảo vệ $R_0$ | Fixed protective resistor ($R_0 \approx 10\ \Omega$) | 1 | 3D ceramic power resistor to prevent short-circuit current surges. |
| **7** | Bảng lắp mạch điện | Experimental circuit breadboard / patch board | 1 | 3D terminal board with standardized mounting sockets. |

---

### 2.3 Physical Governing Formulas and Mathematical Model

For a complete closed electrical circuit containing an electrochemical source $(\xi, r)$, an external adjustable rheostat $R$, and a fixed protective resistor $R_0$:

1. **Ohm's Law for a Complete Closed Circuit:**
   $$I = \frac{\xi}{R + R_0 + r}$$

2. **Terminal Voltage Equation (Relationship between $U$ and $I$):**
   $$U = \xi - I \cdot r$$
   *(where $U$ is the potential difference across the external circuit terminals measured by the parallel voltmeter).*

3. **Graphical Determination of Electromotive Force ($\xi$):**
   When the circuit is open ($I = 0$), the terminal voltage equals the source EMF:
   $$I = 0 \implies U_0 = \xi$$
   Geometrically, $\xi$ corresponds to the vertical intercept ($y$-intercept) of the line $U = f(I)$ extrapolated to $I = 0$.

4. **Graphical Determination of Internal Resistance ($r$):**
   Selecting two arbitrary reference points $M(I_M, U_M)$ and $N(I_N, U_N)$ lying on the fitted characteristic line:
   $$r = \frac{U_M - U_N}{I_N - I_M} = - \frac{\Delta U}{\Delta I}$$
   The slope of the line equals $-r$.

---

### 2.4 Circuit Setup and Procedural Sequence

```mermaid
graph LR
    subgraph Circuit Schematic (Fig 26.2)
        Source["Power Source (ξ, r)"] --> Switch["Switch K"]
        Switch --> Ammeter["DC Ammeter (A)"]
        Ammeter --> Rheostat["Variable Rheostat (R)"]
        Rheostat --> ProtResistor["Protective Resistor (R₀)"]
        ProtResistor --> Source
        Source -.-> Voltmeter["DC Voltmeter (V) [Parallel across Source]"]
    end
```

#### Procedural Steps:
1. **Initial Assembly (Part A — Depleted / Old Cell):**
   - Connect the circuit according to Fig 26.2: connect cell, switch $K$, ammeter $A$, rheostat $R$, and protective resistor $R_0$ in series.
   - Connect the voltmeter $V$ in parallel directly across the terminals of the battery.
   - Adjust the rheostat slider to its maximum resistance ($R = 100\ \Omega$).
2. **Execution & Measurement:**
   - Close switch $K$, power on both digital multimeters.
   - Read and log the terminal voltage $U$ (V) and circuit current $I$ (mA) into **Table 26.1**.
   - Immediately open switch $K$ to prevent cell heating and internal resistance drift.
3. **Multi-Trial Iteration:**
   - Decrease the rheostat resistance $R$ progressively over 4 additional steps (e.g., $R \approx 80\ \Omega, 60\ \Omega, 40\ \Omega, 20\ \Omega$).
   - For each step, close switch $K$ momentarily, log $(U, I)$, and open switch $K$.
4. **Data Analysis & Linear Extrapolation:**
   - Plot the 5 experimental coordinate points $(I_k, U_k)$ on the $U-I$ graph.
   - Draw the optimal linear best-fit line passing closest to the empirical points.
   - Extrapolate the line to intersect the vertical axis ($I = 0$) to obtain $U_0 = \xi$.
   - Compute internal resistance $r = \frac{U_M - U_N}{I_N - I_M}$ using two points on the line.
5. **Iteration (Part B — Fresh / New Cell):**
   - Replace the power source with the new 1.5V cell.
   - Repeat the identical sequence, record data into **Table 26.2**, and plot the comparison characteristic curve.

---

### 2.5 Prescribed Data Recording Tables

#### Table 26.1: Measurement Results for Depleted Cell (*Pin cũ*)

| Trial # | Rheostat Resistance $R\ (\Omega)$ | Measured Voltage $U\ (\text{V})$ | Measured Current $I\ (\text{mA})$ |
| :---: | :---: | :---: | :---: |
| 1 | 100.0 | — | — |
| 2 | ~80.0 | — | — |
| 3 | ~60.0 | — | — |
| 4 | ~40.0 | — | — |
| 5 | ~20.0 | — | — |

- **Extrapolated EMF:** $I = 0 \implies U_0 = \xi = \dots\ \text{V}$
- **Calculated Internal Resistance:** $r = \dots\ \Omega$; $\Delta r = \dots\ \Omega$

#### Table 26.2: Measurement Results for Fresh Cell (*Pin mới*)

| Trial # | Rheostat Resistance $R\ (\Omega)$ | Measured Voltage $U\ (\text{V})$ | Measured Current $I\ (\text{mA})$ |
| :---: | :---: | :---: | :---: |
| 1 | 100.0 | — | — |
| 2 | ~80.0 | — | — |
| 3 | ~60.0 | — | — |
| 4 | ~40.0 | — | — |
| 5 | ~20.0 | — | — |

- **Extrapolated EMF:** $I = 0 \implies U_0 = \xi = \dots\ \text{V}$
- **Calculated Internal Resistance:** $r = \dots\ \Omega$; $\Delta r = \dots\ \Omega$

---

### 2.6 Physical Assumptions, Operational Constraints & Safety Precautions

1. **Internal Resistance Constancy:** The internal resistance $r$ is assumed constant across the brief measurement window of an individual trial.
2. **Current-Induced Depletion Prevention:** The textbook explicitly warns: *"Tại sao trong khi tiến hành thí nghiệm không nên đóng mạch điện trong thời gian dài?"* (Why should the circuit not remain closed for long periods?). 
   - *Physical Reason:* Continuous current draw causes internal electrochemical polarization and Joule heating ($Q = I^2 r t$), which elevates internal resistance and rapidly discharges the cell, causing non-linear drift in measured $U$.
   - *PhysiX Simulation Implementation:* The virtual lab models switch $K$ state; holding the circuit closed for $> 30\text{ s}$ displays an educational hint reminding students to open switch $K$ between trials.
3. **Meter Impedance Ideality:**
   - Virtual voltmeter input resistance is modeled as quasi-infinite ($R_V \ge 10\text{ M}\Omega$).
   - Virtual ammeter internal shunt resistance is modeled as negligible ($R_A \le 0.05\ \Omega$).
4. **Protective Resistor $R_0$ Requirement:** $R_0 = 10\ \Omega$ prevents short-circuit overcurrent ($I_{\max} \le \xi / R_0 = 1.5\text{ V} / 10\ \Omega = 150\text{ mA}$) even if the student accidentally sets the variable rheostat to $R = 0\ \Omega$.

---

### 2.7 Mapping to PhysiX Architecture and MVP Scope

- **Simulation Engine (`src/simulation-core/`):** Implements closed-circuit Ohm's Law and linear DC nodal solver; output updates at fixed $dt = 1/120\text{ s}$.
- **Measurement Subsystem (UC04):** Consumes $U(t)$ and $I(t)$ to populate dynamic data rows (matching Tables 26.1 and 26.2).
- **Comparison Graphing:** Streams dynamic $U = f(I)$ characteristic curves, enabling side-by-side overlay of old vs. new cells (depleted cell exhibits steeper negative slope due to significantly higher internal resistance $r_{\text{old}} \gg r_{\text{new}}$).

