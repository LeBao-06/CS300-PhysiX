# Hướng dẫn sử dụng solver Con lắc đơn

Tài liệu dành cho các thành viên Phy6 cần chạy hoặc tích hợp solver Con lắc đơn (SCRUM-19).

- Công thức, giả định và độ chính xác của mô hình: [simple-pendulum-model.md](simple-pendulum-model.md)
- Mã nguồn: `src/experiments/simple-pendulum/` và `src/simulation-core/`
- Người phụ trách: Bảo. Câu hỏi về vật lý hoặc solver gửi trên Jira SCRUM-19.

> **Lưu ý:** hiện mới có solver, **chưa có giao diện**. `npm run dev` vẫn hiển thị trang mẫu Vite/React. Muốn kiểm tra solver thì chạy test (mục 2).

---

## 1. Cài đặt lần đầu (Windows 11)

### 1.1. Cài Node.js

Cần **Node.js 22.12 trở lên**. Kiểm tra trong PowerShell:

```powershell
node -v
npm -v
```

Nếu chưa có Node hoặc phiên bản thấp hơn, tải bản **22 LTS** tại <https://nodejs.org>, cài xong thì mở lại PowerShell.

Nếu gõ `npm` mà PowerShell báo *"running scripts is disabled on this system"*, chạy lệnh dưới đây **một lần** rồi mở lại cửa sổ:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 1.2. Lấy code và cài thư viện

Ứng dụng nằm trong thư mục con **`physix-platform`**. Mọi lệnh `npm` đều phải chạy ở đó, không phải ở thư mục gốc của repo.

```powershell
git clone https://github.com/LeBao-06/CS300-PhysiX.git
cd CS300-PhysiX\physix-platform
npm ci
```

Nếu đã clone từ trước, chỉ cần cập nhật:

```powershell
cd CS300-PhysiX
git checkout main
git pull
cd physix-platform
npm ci
```

`npm ci` cài đúng phiên bản thư viện ghi trong `package-lock.json`. Các cảnh báo `npm audit` ở cuối có thể bỏ qua.

---

## 2. Chạy test của solver

```powershell
npm run test:scientific
```

Kết quả đúng:

```
 Test Files  1 passed | 1 skipped (2)
      Tests  26 passed (26)
```

File bị "skipped" là test của Ohm, để dành cho Sprint 4.

| Mục đích | Lệnh |
|---|---|
| Xem kết quả test trên trình duyệt | `npx vitest --ui tests/scientific` |
| Tự chạy lại test mỗi khi lưu file | `npx vitest tests/scientific` (nhấn `q` để thoát) |
| Chạy riêng một nhóm test | `npx vitest run tests/scientific -t "simulated period"` |

> **Đừng chạy `npx vitest run` cho toàn repo.** Lệnh đó sẽ báo lỗi vì các file test integration và e2e (`tests/integration/`, `tests/e2e/`) vẫn còn rỗng.

---

## 3. Kiểm tra trước khi tạo Pull Request

Chạy trong `physix-platform`; cả bốn lệnh đều phải không báo lỗi:

```powershell
npm run lint
npm run build
npx prettier --check "src/**/*.{ts,tsx}"
npm run test:scientific
```

Nếu Prettier hoặc ESLint báo lỗi định dạng, sửa tự động bằng:

```powershell
npm run format
npm run lint:fix
```

---

## 4. Dùng solver trong code

Luôn import từ một chỗ duy nhất:

```ts
import { PendulumSimulation, degToRad } from '@experiments/simple-pendulum';
```

### 4.1. Quy ước

- **Đơn vị SI** trong toàn bộ solver: mét, kilôgam, radian, giây. UI tự đổi sang đơn vị hiển thị bằng các hàm có sẵn: `degToRad`, `radToDeg`, `gramsToKilograms`, `kilogramsToGrams`, `centimetresToMetres`.
- **Không tự tính lại vật lý** ở UI hay 3D. Mọi giá trị (vị trí, chu kỳ tham chiếu, độ lệch) đều lấy từ solver.
- **Làm tròn chỉ khi hiển thị.** Không được lưu giá trị đã làm tròn.
- Tọa độ quả nặng tính theo mét, gốc ở điểm treo, **+x sang phải, +y hướng lên**.

### 4.2. Vòng đời một lần đo

```
setup ──arm()──▶ armed ──release()──▶ swinging ──stopTimer()──▶ frozen
  ▲                                                               │
  └──────────────────────── resetTrial() ─────────────────────────┘
```

| Trạng thái | Ý nghĩa | Được phép |
|---|---|---|
| `setup` | Chuẩn bị | `setParameters`, `arm` |
| `armed` | Đã bấm Run, đồng hồ = 0 | `setDragAngle` (giới hạn ±10°), `release` (từ chối nếu dưới 1°) |
| `swinging` | Con lắc đang dao động | `advance`, `startTimer` (một lần), `stopTimer` |
| `frozen` | Đã Stop: con lắc và đồng hồ đứng yên | `getMeasurement`, `resetTrial` |
| `error` | Solver gặp giá trị không hợp lệ | `resetTrial` |

Mọi lệnh gọi sai trạng thái đều trả về `{ accepted: false, error }` và **không thay đổi gì**. UI đổi mã lỗi sang thông báo cho người dùng:

| Mã lỗi | Khi nào |
|---|---|
| `INVALID_PARAMETERS` | l hoặc m nằm ngoài phạm vi, hoặc không phải số |
| `RELEASE_ANGLE_OUT_OF_RANGE` | Thả với góc nhỏ hơn 1° |
| `WRONG_STATUS` | Gọi lệnh không đúng trạng thái (ví dụ đổi tham số khi đang chạy) |
| `TIMER_NOT_ALLOWED` | Bấm đồng hồ trước khi thả, hoặc sau khi đã Stop |

### 4.3. Ví dụ đầy đủ

```ts
import { degToRad, gramsToKilograms, PendulumSimulation } from '@experiments/simple-pendulum';

const sim = new PendulumSimulation({ lengthM: 0.5, massKg: gramsToKilograms(100) });

// Chuẩn bị
sim.setParameters({ lengthM: 0.8, massKg: 0.1 }); // chỉ được gọi ở trạng thái setup
sim.arm();                                         // nút Run

// Người dùng kéo quả nặng
const applied = sim.setDragAngle(degToRad(12));    // bị giới hạn còn 10°, hàm trả về góc thực tế
const result = sim.release();
if (!result.accepted) {
    // result.error === 'RELEASE_ANGLE_OUT_OF_RANGE' → hiện "Allowed release angle: 1°–10°"
}

// Mỗi khung hình (render loop)
sim.advance(deltaS);                // deltaS = số giây thực đã trôi qua từ khung trước
const view = sim.getRenderSnapshot();

// Đồng hồ: nút Start/Stop hoặc phím T
sim.toggleTimer();                  // lần 1: bắt đầu, lần 2: dừng (con lắc đứng yên)
const measurement = sim.getMeasurement(); // { elapsedS, startedAtS, stoppedAtS } sau khi Stop

// Retry / Next trial
sim.resetTrial();                   // về setup, giữ nguyên l và m
```

### 4.4. Hướng dẫn theo vai trò

**Phúc — scene 3D**

Xem hướng dẫn chi tiết và code mẫu ở **mục 5**. Ba điểm chính:

- Dùng `getRenderSnapshot()` để vẽ (đã nội suy cho mượt). Không dùng nó để lấy số đo.
- Khi kéo quả nặng, đổi vị trí chuột sang góc rồi gọi `setDragAngle(angleRad)`. Solver tự giới hạn góc ở ±10°.
- Chỉ cho kéo khi `status === 'armed'`. Từ lúc thả đến lúc Stop, khóa mọi tương tác trừ đồng hồ (UC03.1.2 A3).

**Huy — số đo và bảng kết quả**

```ts
const snap = sim.getSnapshot();
snap.stopwatch.readingS;  // số giây hiển thị trên đồng hồ
snap.stopwatch.state;     // 'idle' | 'running' | 'stopped'
snap.status;              // để bật/tắt các nút
```

- Số đo luôn lấy từ `getSnapshot()`, không lấy từ `getRenderSnapshot()`.
- Khi người dùng xác nhận một lần đo, lưu thành một dòng `PendulumTrialRecord` trong store. Simulation **không lưu** các lần đo đã xác nhận, nên `resetTrial()` không bao giờ làm mất dữ liệu.
- Kiểm tra tham số khớp với kế hoạch Guided bằng `matchesGuidedSetting(params, GUIDED_TRIAL_PLAN[i])`. Nút Run chỉ bật khi `lengthOk` và `massOk` đều đúng.
- Trang kết quả gọi `evaluateTrial(record)` cho từng dòng và `assessGuidedMeasurements(records)` khi đủ 6 lần đo. Các hàm này trả về T đo được, T tham chiếu, độ lệch (%) và kết quả đạt hay không.
- **Không hiển thị `simulatedPeriodS`** trong lúc học sinh đang đo ở chế độ Guided (UC03.1.2 bước 8). Giá trị này chỉ dành cho test và ngữ cảnh gửi cho AI.

**Linh — AI lab assistant**

Gửi kèm ngữ cảnh lấy từ `getSnapshot()`: `parameters`, `status`, `releaseAngleRad`, `stopwatch`. Mọi thay đổi tham số do AI đề xuất phải đi qua `setParameters()`, để solver tự kiểm tra phạm vi hợp lệ.

### 4.5. Tra cứu nhanh

| Cần gì | Dùng |
|---|---|
| Chu kỳ tham chiếu 2π√(l/g) | `smallAnglePeriod(lengthM)` |
| Kiểm tra l, m hợp lệ | `validatePendulumParameters({ lengthM, massKg })` |
| Kiểm tra góc thả hợp lệ | `validateReleaseAngle(angleRad)` |
| Phạm vi cho phép (để hiện "Allowed range") | `LENGTH_BOUND`, `MASS_BOUND`, `RELEASE_ANGLE_BOUND` |
| 6 lần đo của Guided | `GUIDED_TRIAL_PLAN` |
| Số dao động cần đếm | `GUIDED_OSCILLATION_COUNT` (= 10) |
| T đo được = t/N | `measuredPeriod(elapsedS, N)` |
| Ngưỡng đạt (5%) | `GUIDED_DEVIATION_LIMIT_PERCENT` |

---

## 5. Kết nối solver với scene 3D (React Three Fiber)

Phần này dành cho người code scene 3D trong `src/rendering/` (Phúc và các thành viên hỗ trợ). Thư viện sử dụng: **Three.js + React Three Fiber (R3F) + Drei**, đều đã có trong `package.json`.

> Code mẫu ở mục 5.4 đã được kiểm tra bằng TypeScript và ESLint với cấu hình của repo, nhưng **chưa chạy thử trên trình duyệt**. Hãy coi đây là điểm khởi đầu và tinh chỉnh khi dựng scene thật.

### 5.1. Nguyên tắc phân chia

| Solver (`@experiments/simple-pendulum`) | Scene 3D (`src/rendering/`) |
|---|---|
| Tính góc, vận tốc, vị trí quả nặng | Vẽ giá đỡ, dây, quả nặng, thước, thước đo góc, đồng hồ |
| Giới hạn góc kéo ±10°, từ chối thả dưới 1° | Đổi vị trí chuột sang góc, rồi gửi cho solver |
| Đồng hồ bấm giờ, đóng băng khi Stop | Hiển thị đồng hồ, bắt phím T và nút bấm |
| Quyết định thao tác nào hợp lệ | Khóa hoặc mở tương tác theo `status` |

**Scene không được tự tính vật lý.** Không viết `Math.sin(...)` để mô phỏng chuyển động, không tự đếm chu kỳ, không tự giới hạn góc. Mọi thứ đều đọc từ solver.

### 5.2. Quy ước tọa độ

- **1 đơn vị trong scene = 1 mét.** Khi đó vị trí do solver trả về dùng được ngay, không cần đổi tỉ lệ.
- Solver trả tọa độ quả nặng `bob.x`, `bob.y` (mét) **so với điểm treo**, với +x sang phải và +y hướng lên. Đây cũng là hệ trục mặc định của Three.js.
- Con lắc dao động trong mặt phẳng XY. Đặt điểm treo tại một vị trí `PIVOT` trong scene, ví dụ đầu thanh ngang của giá đỡ.
- Góc `angleRad` dương thì quả nặng lệch sang +x. Vì vậy chỉ cần **xoay một group quanh trục Z đúng bằng `angleRad`**: vector `(0, −l)` xoay một góc θ sẽ thành `(l·sin θ, −l·cos θ)`, đúng bằng `bob` của solver.

```
          PIVOT  ●───────── thanh ngang của giá đỡ
                  \
                   \  dây dài l (m)
                θ   \
                     ●  quả nặng tại (l·sin θ, −l·cos θ) so với PIVOT
```

### 5.3. Chia sẻ một instance cho cả scene và UI

Scene 3D, bảng số đo của Huy và trợ lý AI phải dùng **cùng một** đối tượng `PendulumSimulation`. Có hai cách:

1. **Đơn giản nhất (dùng ngay được):** tạo instance ở component trang thí nghiệm bằng `useState(() => new PendulumSimulation(...))`, rồi truyền xuống scene và panel qua props hoặc React context. Code mẫu dưới đây dùng cách này.
2. **Lâu dài (cần thống nhất với Huy):** giữ instance trong `useSimulationStore` (Zustand) như một giá trị **không reactive**, kèm một snapshot được cập nhật khoảng 10 lần/giây cho UI.

Dù chọn cách nào, cũng **không được gọi `setState` trong mỗi khung hình**. Làm vậy React sẽ render lại 60 lần/giây. Scene đọc solver trực tiếp trong `useFrame` và thay đổi `ref` của mesh. UI (số đo, nút bấm) chỉ cập nhật khoảng 10 lần/giây, đúng với NFR Performance (số đo làm mới ít nhất 10 lần/giây).

### 5.4. Code mẫu

```tsx
import { PendulumSimulation, type PendulumSnapshot } from '@experiments/simple-pendulum';
import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/** Vị trí điểm treo trong scene (m). Chỉnh theo giá đỡ thật. */
const PIVOT = new THREE.Vector3(0, 1.8, 0);
/** Bán kính quả nặng khi vẽ (m). Chỉ để hiển thị: solver coi quả nặng là chất điểm. */
const BOB_RADIUS_M = 0.025;

/** Dây + quả nặng. Đọc solver mỗi khung hình, không gây render lại React. */
function PendulumModel({ sim }: { sim: PendulumSimulation }) {
    const armRef = useRef<THREE.Group>(null);
    const stringRef = useRef<THREE.Mesh>(null);
    const bobRef = useRef<THREE.Mesh>(null);
    const dragging = useRef(false);
    // Mặt phẳng dao động (z = PIVOT.z), dùng để đổi vị trí chuột sang tọa độ 3D.
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -PIVOT.z), []);
    const hit = useMemo(() => new THREE.Vector3(), []);

    useFrame((_, delta) => {
        sim.advance(delta); // solver tự chia thành các bước 1 ms
        const view = sim.getRenderSnapshot();
        const l = view.parameters.lengthM;
        if (!armRef.current || !stringRef.current || !bobRef.current) return;
        armRef.current.rotation.z = view.angleRad; // xoay cả dây và quả nặng quanh điểm treo
        stringRef.current.scale.y = l; // hình trụ cao 1, kéo dài thành l
        stringRef.current.position.y = -l / 2;
        bobRef.current.position.y = -l;
    });

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        if (sim.getSnapshot().status !== 'armed') return; // chỉ kéo được sau khi bấm Run
        e.stopPropagation();
        (e.target as Element).setPointerCapture(e.pointerId);
        dragging.current = true;
    };

    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!dragging.current || !e.ray.intersectPlane(plane, hit)) return;
        // Góc so với phương thẳng đứng, dương khi chuột ở bên phải điểm treo.
        sim.setDragAngle(Math.atan2(hit.x - PIVOT.x, PIVOT.y - hit.y)); // solver giới hạn ±10°
    };

    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (!dragging.current) return;
        dragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
        const result = sim.release();
        if (!result.accepted) {
            // 'RELEASE_ANGLE_OUT_OF_RANGE': quả nặng vẫn được giữ, UI hiện "Allowed release angle: 1°–10°"
            console.warn(result.error);
        }
    };

    return (
        <group position={PIVOT}>
            <group ref={armRef}>
                <mesh ref={stringRef}>
                    <cylinderGeometry args={[0.0015, 0.0015, 1, 8]} />
                    <meshStandardMaterial color="#888888" />
                </mesh>
                <mesh
                    ref={bobRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                >
                    <sphereGeometry args={[BOB_RADIUS_M, 32, 16]} />
                    <meshStandardMaterial color="#c0392b" metalness={0.4} roughness={0.3} />
                </mesh>
            </group>
        </group>
    );
}

/** Snapshot cho UI, cập nhật `hz` lần mỗi giây (không phải mỗi khung hình). */
function usePendulumReadout(sim: PendulumSimulation, hz = 10): PendulumSnapshot {
    const [snap, setSnap] = useState(() => sim.getSnapshot());
    useEffect(() => {
        const id = window.setInterval(() => setSnap(sim.getSnapshot()), 1000 / hz);
        return () => window.clearInterval(id);
    }, [sim, hz]);
    return snap;
}

export function PendulumLab() {
    const [sim] = useState(() => new PendulumSimulation({ lengthM: 0.5, massKg: 0.1 }));
    const readout = usePendulumReadout(sim);

    // Phím T: bấm/dừng đồng hồ. Bỏ qua khi giữ phím (UC03.1.2 A2).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 't' && !e.repeat) sim.toggleTimer();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [sim]);

    // Chỉ cho xoay camera khi chưa Run hoặc đã Stop: tránh xung đột với thao tác kéo
    // và khóa camera trong lúc đo (UC03.1.2 A3).
    const cameraEnabled = readout.status === 'setup' || readout.status === 'frozen';

    return (
        <>
            <Canvas camera={{ position: [0, 1.3, 1.6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 3, 2]} />
                <PendulumModel sim={sim} />
                <OrbitControls target={[0, 1.3, 0]} enabled={cameraEnabled} />
            </Canvas>
            <p>Stopwatch: {readout.stopwatch.readingS.toFixed(2)} s</p>
        </>
    );
}
```

### 5.5. Gắn với các nút bấm

| Nút / thao tác | Gọi | Bật khi |
|---|---|---|
| Ô nhập l, m (hoặc kéo dây, đổi quả nặng) | `sim.setParameters({ lengthM, massKg })` | `status === 'setup'` |
| Run | `sim.arm()` | `status === 'setup'` (Guided: thêm điều kiện `matchesGuidedSetting`) |
| Kéo và thả quả nặng | `setDragAngle` rồi `release` (mục 5.4) | `status === 'armed'` |
| Start / Stop timer, phím T | `sim.toggleTimer()` | `status === 'swinging'` |
| Retry / Next trial | `sim.resetTrial()` | `status === 'frozen'` hoặc `'error'` |

Chiều dài dây trong scene thay đổi ngay khi `setParameters` được chấp nhận, vì `useFrame` đọc `parameters.lengthM` mỗi khung hình.

### 5.6. Những lỗi dễ mắc

- **Quên gọi `sim.advance(delta)`** trong `useFrame`: con lắc đứng yên sau khi thả.
- **Dùng `getSnapshot()` để vẽ**: chuyển động bị giật nhẹ. Hãy dùng `getRenderSnapshot()` để vẽ.
- **Dùng `getRenderSnapshot()` để hiển thị số đo**: sai lệch nhỏ do nội suy. Số đo phải lấy từ `getSnapshot()`.
- **Tự giới hạn góc trong scene** bằng một giá trị khác 10°: lệch với solver. Cứ gửi góc thô cho `setDragAngle`.
- **Tạo `new PendulumSimulation(...)` ngay trong thân component** mà không bọc bằng `useState` hoặc `useRef`: mỗi lần render tạo ra một con lắc mới và mất trạng thái.
- **Đổi đơn vị scene** (ví dụ 1 đơn vị = 1 cm): phải nhân mọi vị trí với 100. Nên giữ 1 đơn vị = 1 m.

---

## 6. Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `npm ERR! enoent ... package.json` | Bạn đang ở thư mục gốc. Chạy `cd physix-platform` trước. |
| `Missing script: "test:scientific"` | Code chưa mới nhất. Chạy `git checkout main` rồi `git pull`. |
| Lỗi liên quan đến engine hoặc phiên bản Node | Nâng Node lên 22.12 trở lên. |
| `npm ci` báo lock file không khớp | Chạy `git status`; nếu lỡ sửa `package-lock.json` thì khôi phục bằng `git checkout -- package-lock.json` rồi chạy lại `npm ci`. |
| Kéo quả nặng không được | Kiểm tra đã gọi `sim.arm()` (nút Run) chưa; chỉ kéo được khi `status === 'armed'`. |
| Camera xoay theo khi đang kéo quả nặng | Tắt `OrbitControls` khi `status` khác `'setup'` và `'frozen'` (mục 5.4). |
| `No test suite found in file ...` | Bạn đang chạy test cho toàn repo. Dùng `npm run test:scientific`. |
| Cảnh báo `__dirname ... configLoader: 'native'` khi chạy test | Chỉ là cảnh báo của Vite, không ảnh hưởng kết quả. |
