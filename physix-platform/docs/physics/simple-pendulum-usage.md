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

```ts
// trong useFrame((_, delta) => { ... }) của React Three Fiber
sim.advance(delta);
const { bob, angleRad, parameters } = sim.getRenderSnapshot();
// bob.x, bob.y: vị trí quả nặng (m) so với điểm treo
// angleRad: góc dây so với phương thẳng đứng
// parameters.lengthM: chiều dài dây để vẽ
```

- Dùng `getRenderSnapshot()` để vẽ (đã nội suy cho mượt). Không dùng nó để lấy số đo.
- Khi kéo quả nặng, đổi vị trí chuột sang góc rồi gọi `setDragAngle(angleRad)`. Vẽ theo **góc mà hàm trả về**, vì nó đã bị giới hạn ±10°.
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

## 5. Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `npm ERR! enoent ... package.json` | Bạn đang ở thư mục gốc. Chạy `cd physix-platform` trước. |
| `Missing script: "test:scientific"` | Code chưa mới nhất. Chạy `git checkout main` rồi `git pull`. |
| Lỗi liên quan đến engine hoặc phiên bản Node | Nâng Node lên 22.12 trở lên. |
| `npm ci` báo lock file không khớp | Chạy `git status`; nếu lỡ sửa `package-lock.json` thì khôi phục bằng `git checkout -- package-lock.json` rồi chạy lại `npm ci`. |
| `No test suite found in file ...` | Bạn đang chạy test cho toàn repo. Dùng `npm run test:scientific`. |
| Cảnh báo `__dirname ... configLoader: 'native'` khi chạy test | Chỉ là cảnh báo của Vite, không ảnh hưởng kết quả. |
