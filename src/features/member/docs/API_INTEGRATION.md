# API Integration cho Member Profile

## Tổng quan
Màn hình MemberProfile đã được tích hợp hoàn toàn với API backend thay vì sử dụng mock data.

## Các API được tích hợp

### 1. User APIs
- **GET /api/auth/me** - Lấy thông tin user hiện tại
- **PUT /api/user/me/profile** - Cập nhật profile của user hiện tại

### 2. Health Info APIs  
- **GET /api/health-info/me** - Lấy thông tin sức khỏe của user hiện tại
- **POST /api/health-info/{memberId}** - Tạo thông tin sức khỏe mới
- **PUT /api/health-info/{healthInfoId}** - Cập nhật thông tin sức khỏe

## Các Service Functions

### UserApi (`src/features/member/api/user.api.ts`)
```typescript
- getMe(): Promise<User>
- updateMyProfile(data: UpdateUserProfileRequest): Promise<User>
```

### HealthInfoService (`src/features/member/services/healthInfo.service.ts`)
```typescript
- getMyHealthInfo(): Promise<HealthInfo>
- createHealthInfo(memberId: string, data: CreateHealthInfoRequest): Promise<HealthInfo>
- updateHealthInfo(healthInfoId: string, data: UpdateHealthInfoRequest): Promise<HealthInfo>
```

## Custom Hooks

### useUser (`src/features/member/hooks/useUser.ts`)
```typescript
- useMe() - Lấy thông tin user hiện tại
- useUpdateMyProfile() - Mutation để cập nhật profile
```

### useHealthInfo (`src/features/member/hooks/useHealthInfo.ts`)
```typescript
- useHealthInfo() - Lấy thông tin sức khỏe
- useCreateHealthInfo() - Mutation để tạo thông tin sức khỏe
- useUpdateHealthInfo() - Mutation để cập nhật thông tin sức khỏe
```

## Tính năng đã được tích hợp

### 1. Hiển thị thông tin cá nhân
- Tên, email, số điện thoại từ API
- Ngày sinh, giới tính, CCCD
- Ngày tham gia, QR code
- Trạng thái tài khoản (active/inactive)

### 2. Hiển thị thông tin sức khỏe
- Chiều cao, cân nặng, BMI
- Mục tiêu tập luyện
- Trình độ, mức độ thể lực
- Thời gian tập ưa thích
- Số buổi tập/tuần
- Tiền sử bệnh lý, dị ứng

### 3. Chỉnh sửa thông tin
- **Thông tin cá nhân**: Có thể chỉnh sửa tên và email
- **Thông tin sức khỏe**: Có thể tạo mới hoặc cập nhật

### 4. Loading States
- Hiển thị loading khi đang tải dữ liệu
- Loading button khi đang lưu
- Error handling với thông báo lỗi

### 5. Toast Notifications
- Thông báo thành công khi lưu
- Thông báo lỗi khi có vấn đề
- Sử dụng Sonner toast library

## Cách sử dụng

1. **Xem thông tin**: Dữ liệu được tự động load khi vào trang
2. **Chỉnh sửa thông tin cá nhân**: 
   - Click "Chỉnh sửa" ở tab "Thông tin cá nhân"
   - Thay đổi tên/email
   - Click "Lưu"
3. **Chỉnh sửa thông tin sức khỏe**:
   - Click "Chỉnh sửa" hoặc "Tạo mới" ở tab "Thông tin sức khỏe"
   - Điền thông tin
   - Click "Lưu"

## Error Handling

- **Network errors**: Hiển thị thông báo lỗi và nút "Thử lại"
- **Validation errors**: Hiển thị toast error
- **Loading states**: Disable button và hiển thị spinner

## Dependencies

- `@tanstack/react-query` - Data fetching và caching
- `axios` - HTTP client
- `sonner` - Toast notifications
- `lucide-react` - Icons
