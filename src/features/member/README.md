# Member Feature - StagPower Gym Management System

## Tổng quan

Feature Member cung cấp giao diện hoàn chỉnh cho hội viên phòng gym với các chức năng quản lý tài khoản, check-in, đặt lịch PT, xem lịch sử và nhận gợi ý AI.

## Cấu trúc thư mục

```
src/features/member/
├── components/
│   ├── MemberLayout.tsx      # Layout chính với sidebar navigation
│   ├── MemberTable.tsx       # Component table cho admin (legacy)
│   └── index.ts
├── pages/
│   ├── MemberDashboard.tsx   # Trang tổng quan
│   ├── MemberProfile.tsx     # Quản lý thông tin cá nhân
│   ├── MemberCheckin.tsx     # Check-in và lịch sử
│   ├── MemberPackages.tsx    # Quản lý gói tập
│   ├── MemberPayments.tsx    # Lịch sử thanh toán
│   ├── MemberSchedule.tsx    # Đặt lịch PT
│   ├── MemberHistory.tsx     # Lịch sử tập luyện
│   ├── MemberNotifications.tsx # Thông báo
│   ├── MemberSuggestions.tsx # Gợi ý AI
│   ├── MemberPage.tsx        # Legacy page
│   └── index.ts
└── index.ts
```

## Routing

Hệ thống sử dụng nested routing với cấu trúc:

```
/member
├── /dashboard          # Trang tổng quan (default)
├── /profile           # Thông tin cá nhân
├── /checkin           # Check-in
├── /packages          # Gói tập
├── /payments          # Thanh toán
├── /schedule          # Đặt lịch PT
├── /history           # Lịch sử tập luyện
├── /notifications     # Thông báo
└── /suggestions       # Gợi ý AI
```

## Các tính năng chính

### 1. MemberDashboard
- **Overview Cards**: Hiển thị thống kê tổng quan
- **Active Subscription**: Thông tin gói tập hiện tại
- **Recent Check-ins**: Lịch sử check-in gần đây
- **Upcoming PT Sessions**: Buổi PT sắp tới
- **AI Suggestions**: Gợi ý AI mới nhất
- **Quick Actions**: Các thao tác nhanh

### 2. MemberProfile
- **Personal Information**: Thông tin cá nhân có thể chỉnh sửa
- **Health Information**: Thông tin sức khỏe và BMI
- **Avatar Management**: Quản lý ảnh đại diện
- **Membership Status**: Trạng thái thành viên

### 3. MemberCheckin
- **QR Code Scanner**: Mô phỏng quét QR code
- **Check-in/Check-out**: Xử lý check-in và check-out
- **Check-in History**: Lịch sử check-in chi tiết
- **Statistics**: Thống kê thời gian tập luyện

### 4. MemberPackages
- **Current Package**: Thông tin gói tập hiện tại
- **Package Progress**: Tiến độ sử dụng gói
- **Available Packages**: Danh sách gói có sẵn
- **Subscription History**: Lịch sử đăng ký gói

### 5. MemberPayments
- **Payment History**: Lịch sử thanh toán chi tiết
- **Payment Methods**: Thống kê phương thức thanh toán
- **Monthly Spending**: Chi tiêu theo tháng
- **Transaction Details**: Chi tiết giao dịch

### 6. MemberSchedule
- **Today's Schedule**: Lịch tập hôm nay
- **Upcoming Sessions**: Buổi PT sắp tới
- **Available Trainers**: Danh sách huấn luyện viên
- **Schedule Management**: Quản lý lịch tập

### 7. MemberHistory
- **Workout Statistics**: Thống kê tập luyện
- **Check-in History**: Lịch sử check-in
- **PT History**: Lịch sử buổi PT
- **Monthly Activity**: Hoạt động theo tháng

### 8. MemberNotifications
- **Notification Management**: Quản lý thông báo
- **Filter Options**: Lọc theo trạng thái
- **Mark as Read**: Đánh dấu đã đọc
- **Notification Types**: Các loại thông báo khác nhau

### 9. MemberSuggestions
- **AI Recommendations**: Gợi ý từ AI
- **Exercise Plans**: Kế hoạch tập luyện
- **Nutrition Plans**: Kế hoạch dinh dưỡng
- **Goal Tracking**: Theo dõi mục tiêu

## Sử dụng Mock Data

Tất cả các trang đều sử dụng mock data từ `src/mockdata/`:

- `mockUsers`: Thông tin người dùng
- `mockSubscriptions`: Thông tin đăng ký gói
- `mockCheckIns`: Lịch sử check-in
- `mockSchedules`: Lịch trình PT
- `mockPayments`: Lịch sử thanh toán
- `mockAISuggestions`: Gợi ý AI
- `mockBranches`: Thông tin chi nhánh
- `mockHealthInfo`: Thông tin sức khỏe

## Components sử dụng

- **shadcn/ui**: Button, Card, Badge, Progress, Input, Label
- **Lucide React**: Icons
- **React Router DOM**: Navigation và routing
- **Tailwind CSS**: Styling

## Responsive Design

Tất cả các trang đều được thiết kế responsive với:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interface
- Optimized for mobile devices

## Authentication

Hệ thống sử dụng `ProtectedRoute` để bảo vệ các trang member:
- Yêu cầu đăng nhập
- Kiểm tra role "Member"
- Redirect về login nếu chưa đăng nhập

## State Management

- Sử dụng React hooks (useState, useMemo, useEffect)
- Context API cho authentication
- Local state cho UI interactions
- Mock data cho demo purposes

## Cách sử dụng

1. Đăng nhập với tài khoản có role "Member"
2. Truy cập `/member` để vào dashboard
3. Sử dụng sidebar để điều hướng giữa các trang
4. Tất cả dữ liệu hiển thị từ mock data

## Tương lai

Khi tích hợp API thật:
- Thay thế mock data bằng API calls
- Thêm error handling
- Thêm loading states
- Thêm real-time updates
- Thêm push notifications
