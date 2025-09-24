# Dữ liệu giả lập (Mock Data) cho hệ thống StagPower Gym

Thư mục này chứa dữ liệu giả lập phục vụ phát triển và kiểm thử frontend.

## Danh sách tệp

### Nhóm thực thể cốt lõi

1. **`users.ts`** – Người dùng (Member, Trainer, Staff, Admin)
   - 9 người dùng với thông tin theo vai trò
   - Bao gồm `member_info`, `trainer_info`, `staff_info`, `admin_info`

2. **`healthInfo.ts`** – Thông tin sức khỏe hội viên
   - 6 hồ sơ sức khỏe (BMI, mục tiêu, kinh nghiệm)
   - Liên kết tới người dùng cụ thể

3. **`packages.ts`** – Danh sách gói tập và giá
   - ~15 gói (Membership, Combo, PT)
   - Nhiều thời lượng và hạng (Basic, VIP), có gói Trial

4. **`branches.ts`** – Chi nhánh phòng gym
   - 8 chi nhánh tại TP.HCM, trạng thái Active/Maintenance/Closed

### Logic nghiệp vụ

5. **`subscriptions.ts`** – Đăng ký gói của hội viên
   - 8 bản ghi (Active/Expired/Suspended)
   - Có quản lý tạm ngưng và theo dõi buổi PT

6. **`payments.ts`** – Giao dịch thanh toán
   - 10 giao dịch (Momo/ZaloPay/Cash/Card/BankTransfer)
   - Nhiều trạng thái và ưu đãi áp dụng

7. **`discounts.ts`** – Quy tắc ưu đãi/khuyến mãi
   - 14 loại (HSSV, VIP, Nhóm, Công ty, Voucher)

### Vận hành

8. **`checkIns.ts`** – Lịch sử vào/ra (check-in/check-out)
   - 21 bản ghi với nhiều trạng thái
   - Có lỗi xác thực và thời lượng buổi tập

9. **`schedules.ts`** – Lịch PT (Confirmed/Completed/Cancelled)

10. **`bookingRequests.ts`** – Yêu cầu đặt lịch PT

11. **`aiSuggestions.ts`** – Gợi ý bài tập từ AI

## Cách dùng

### Import toàn bộ dữ liệu
```typescript
import { mockData } from './mockdata';
```

### Import từng phần
```typescript
import { mockUsers, mockPackages } from './mockdata';
```

### Hàm trợ giúp
```typescript
import { getMockDataById, getMockDataByMemberId, getMockStats } from './mockdata';

const user = getMockDataById('users', '507f1f77bcf86cd799439011');
const memberSubscriptions = getMockDataByMemberId('subscriptions', '507f1f77bcf86cd799439011');
const stats = getMockStats();
```

## Quan hệ dữ liệu

- **Users** → **HealthInfo** (1–1 với Member)
- **Users** → **Subscriptions/Payments/CheckIns/Schedules/BookingRequests/AISuggestions** (1–n)
- **Packages** → **Subscriptions** (1–n)
- **Branches** → **Subscriptions/CheckIns/Schedules** (1–n)
- **Subscriptions** → **Payments/Schedules/BookingRequests** (1–n)

## Điểm nổi bật

### Người dùng
- Nguyễn Văn An (VIP 12 tháng), Trần Thị Bình (Basic 3 tháng), Lê Văn Cường (Combo VIP + PT), …

### Gói tập
- Basic 1/3/6/12 tháng (1 chi nhánh)
- VIP 1/3/12 tháng (tất cả chi nhánh)
- Combo (Membership + PT), PT riêng, Trial 3/7 ngày

### Kịch bản dữ liệu
- Hội viên active, gói hết hạn cần gia hạn, tạm ngưng, lịch PT, đa dạng phương thức thanh toán, gợi ý AI…

## Ghi chú

- Tất cả thời gian theo ISO
- Giá tiền VNĐ
- ID theo định dạng MongoDB ObjectId
- Dữ liệu tên/địa chỉ Việt Nam
- Phản ánh quy tắc trong tài liệu yêu cầu hệ thống

---

## Cập nhật mô hình dữ liệu (09/2025)

- `checkIns.ts`
  - Thêm: `checkout_method?: 'qr_exit' | 'manual_app' | 'staff' | 'auto'`, `auto_checkout?: boolean`, `auto_checkout_reason?: 'CloseTime' | 'MaxSession'`, `allow_reopen_until?: string`.
  - Cập nhật vài bản ghi mẫu (có `auto_checkout`).

- `packages.ts`
  - Thêm gói: `Combo VIP 12 tháng + 12 buổi PT` (`id: 507f...046`).

- `subscriptions.ts`
  - Thêm đăng ký Active cho hội viên `507f...011` (01/01/2025 → 31/12/2025) dùng gói combo mới.

- `payments.ts`
  - Thêm thanh toán hoàn tất cho combo mới (ưu đãi VIP 10%).

Các thay đổi hỗ trợ logic check‑out an toàn (thủ công/tự động) và phù hợp `schema.txt`, `GymManagementSystem.markdown`.