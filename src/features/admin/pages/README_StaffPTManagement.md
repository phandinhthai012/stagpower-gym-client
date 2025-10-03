# Admin Staff & PT Management Screen

## 📋 Tổng quan

Màn hình **Quản lý Nhân viên & PT** (`AdminStaffPTManagement`) cung cấp đầy đủ chức năng CRUD (Create, Read, Update, Delete) cho việc quản lý thông tin nhân viên và huấn luyện viên trong hệ thống StagPower Gym.

## 🎯 Chức năng chính

### 1. **Xem danh sách** 
- Hiển thị tất cả nhân viên và PT
- Tìm kiếm theo tên, email, số điện thoại
- Lọc theo vai trò (PT/Nhân viên) và trạng thái
- Phân trang dữ liệu

### 2. **Thêm mới**
- Form thêm nhân viên/PT mới
- Thông tin cơ bản: tên, email, SĐT, ngày sinh, giới tính, CCCD
- Thông tin riêng cho PT: kinh nghiệm, giờ làm việc, chuyên môn, chứng chỉ
- Thông tin riêng cho nhân viên: chi nhánh, vị trí

### 3. **Chỉnh sửa**
- Cập nhật thông tin nhân viên/PT
- Validation dữ liệu đầu vào
- Lưu thay đổi vào hệ thống

### 4. **Xem chi tiết**
- Modal hiển thị thông tin đầy đủ
- Thống kê công việc
- Lịch sử hoạt động gần đây

### 5. **Xóa**
- Xóa nhân viên/PT khỏi hệ thống
- Xác nhận trước khi xóa

## 🏗️ Cấu trúc Component

```
AdminStaffPTManagement.tsx
├── Header (Tiêu đề + Nút thêm mới)
├── Search & Filter (Tìm kiếm và lọc)
├── Add/Edit Form (Form thêm/sửa)
├── Data Table (Bảng danh sách)
└── StaffPTDetailModal (Modal xem chi tiết)
```

## 📊 Dữ liệu quản lý

### Thông tin cơ bản
- **Họ và tên** (bắt buộc)
- **Email** (bắt buộc, unique)
- **Số điện thoại** (bắt buộc, unique)
- **Ngày sinh**
- **Giới tính** (Nam/Nữ/Khác)
- **CCCD**
- **Trạng thái** (Hoạt động/Không hoạt động/Tạm ngưng)

### Thông tin PT
- **Số năm kinh nghiệm**
- **Giờ làm việc** (bắt đầu - kết thúc)
- **Chuyên môn** (array)
- **Chứng chỉ** (array)

### Thông tin Nhân viên
- **Chi nhánh** (bắt buộc)
- **Vị trí** (Lễ tân, Quản lý, etc.)

## 🔧 Cách sử dụng

### 1. Truy cập màn hình
```
URL: /admin/staff-pt-management
Menu: Quản lý Nhân viên/PT
```

### 2. Thêm nhân viên/PT mới
1. Click nút **"Thêm mới"**
2. Điền thông tin cơ bản
3. Chọn vai trò (PT/Nhân viên)
4. Điền thông tin riêng theo vai trò
5. Click **"Thêm mới"** để lưu

### 3. Chỉnh sửa thông tin
1. Click nút **"Chỉnh sửa"** (biểu tượng bút) trên dòng cần sửa
2. Cập nhật thông tin trong form
3. Click **"Cập nhật"** để lưu

### 4. Xem chi tiết
1. Click nút **"Xem"** (biểu tượng mắt) trên dòng cần xem
2. Xem thông tin đầy đủ trong modal
3. Click **"Đóng"** để thoát

### 5. Xóa nhân viên/PT
1. Click nút **"Xóa"** (biểu tượng thùng rác) trên dòng cần xóa
2. Xác nhận trong dialog
3. Nhân viên/PT sẽ bị xóa khỏi hệ thống

### 6. Tìm kiếm và lọc
- **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm
- **Lọc vai trò**: Chọn PT hoặc Nhân viên
- **Lọc trạng thái**: Chọn trạng thái hoạt động
- **Đặt lại**: Reset tất cả bộ lọc

## 🎨 UI/UX Features

### Responsive Design
- Tương thích mobile, tablet, desktop
- Layout linh hoạt theo kích thước màn hình

### Visual Indicators
- **Badge trạng thái**: Màu sắc phân biệt trạng thái
- **Badge vai trò**: Phân biệt PT và Nhân viên
- **Icons**: Biểu tượng trực quan cho từng chức năng

### Form Validation
- Validation real-time
- Thông báo lỗi rõ ràng
- Required fields được đánh dấu (*)

## 🔗 Integration

### Mockdata
- Sử dụng `mockUsers` và `mockBranches`
- Dữ liệu mẫu cho development

### Routing
- Route: `/admin/staff-pt-management`
- Protected route (chỉ Admin)

### State Management
- Local state với React hooks
- Form state management
- Modal state control

## 🚀 Future Enhancements

### API Integration
- Thay thế mockdata bằng API calls
- Error handling và loading states
- Optimistic updates

### Advanced Features
- Bulk operations (xóa nhiều, cập nhật hàng loạt)
- Export/Import dữ liệu
- Advanced filtering và sorting
- Audit trail (lịch sử thay đổi)

### Performance
- Virtual scrolling cho danh sách lớn
- Lazy loading
- Caching strategies

## 🐛 Known Issues

1. **Form validation**: Cần cải thiện validation rules
2. **Error handling**: Chưa có error boundary
3. **Loading states**: Chưa có loading indicators
4. **Accessibility**: Cần cải thiện accessibility

## 📝 Notes

- Component sử dụng shadcn/ui components
- Styling với Tailwind CSS
- TypeScript cho type safety
- Responsive design mobile-first
