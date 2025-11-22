# StagPower Gym Management System - Frontend

Hệ thống quản lý phòng gym thông minh - Phần Frontend

## 🚀 Công nghệ sử dụng

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ESLint** - Code quality
- **Create React App** - Build tool và dev server
- **Radix UI** - UI component library
- **Lucide React** - Icon library
- **React Hook Form** - Form handling

## 📦 Cài đặt

```bash
npm install
```

## 🏃‍♂️ Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:5173](http://localhost:5173)

## 🛠️ Scripts có sẵn

- `npm run dev` - Chạy development server (port 5173)
- `npm run build` - Build cho production
- `npm start` - Chạy development server (port 3000)
- `npm run lint` - Kiểm tra code quality
- `npm run lint:fix` - Tự động fix lỗi ESLint
- `npm run type-check` - Kiểm tra TypeScript

## 📁 Cấu trúc thư mục

```
src/
├── components/           # React components
│   └── ui/              # UI components (Button, Input, Card, etc.)
├── features/            # Feature modules
│   └── landing/         # Landing page feature
│       ├── components/  # Landing page components
│       └── page/        # Landing page main component
├── pages/               # Page components
│   ├── AuthPage.tsx     # Login/Register page
│   ├── MemberPage.tsx   # Member dashboard
│   └── RegistrationSuccessPage.tsx
├── mockdata/            # Mock data for demo
│   ├── users.ts         # User mock data
│   ├── packages.ts      # Package mock data
│   └── branches.ts      # Branch mock data
├── assets/              # Static assets
│   ├── Logo_dumbbell.png
│   └── Logo_StagPower_4x.png
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## 🎨 Design System

Project sử dụng Tailwind CSS với:
- **Color Scheme**: Orange (#FF6B35) làm primary, Gray/Black cho text
- **Typography**: Inter font family
- **Components**: Radix UI components với Tailwind styling
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design approach

## 🔧 Cấu hình

- **Create React App**: `package.json` - Build tool configuration
- **Tailwind CSS**: `tailwind.config.js` - Styling configuration
- **ESLint**: `.eslintrc.js` - Code quality rules
- **TypeScript**: `tsconfig.json` - TypeScript configuration
- **PostCSS**: `postcss.config.js` - CSS processing

## ⚙️ Environment Variables (.env)

Project sử dụng file `.env` để quản lý các cấu hình API và environment variables.

### Thiết lập nhanh

1. **Copy file template**:
   ```bash
   copy .env.example .env
   ```
   Hoặc xem file `ENV_SETUP.md` để copy nội dung

2. **File `.env` hiện tại đã có sẵn với giá trị mặc định cho development**

Xem chi tiết: [ENV_SETUP.md](./ENV_SETUP.md)

## 🚀 Deploy miễn phí

Xem hướng dẫn deploy chi tiết: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Tóm tắt**: 
- Frontend: **Vercel** (miễn phí, tốt nhất cho React)
- Backend: **Render** (free tier) hoặc **Railway** ($5 credit/tháng)
- Database: **MongoDB Atlas** (free tier)

## ✨ Tính năng hiện tại

### 🏠 Landing Page
- **Hero Section** với call-to-action buttons
- **Features Section** giới thiệu 6 ưu điểm chính
- **Packages Section** hiển thị 3 gói tập phổ biến
- **Gym Info Section** với thống kê ấn tượng
- **Testimonials Section** với đánh giá từ hội viên
- **FAQ Section** với 10 câu hỏi thường gặp
- **Footer** với thông tin liên hệ và social links

### 🔐 Authentication System
- **AuthPage** với tab switching (Login/Register)
- **Form validation** với error handling
<!-- - **Mock data integration** cho demo -->
- **Role-based navigation** (Member, Trainer, Staff, Admin)

### 📱 Responsive Design
- **Mobile-first** approach
- **Smooth scrolling** navigation
- **Interactive elements** với hover effects
- **Optimized images** và lazy loading

## 📝 Ghi chú

- Đảm bảo chạy `npm run lint` trước khi commit
- Sử dụng TypeScript strict mode
- Tuân thủ ESLint rules
- Responsive design với Tailwind CSS
- **Demo mode**: Sử dụng mock data, không kết nối API thực

## 🚀 Development Workflow

1. **Clone repository** và cài đặt dependencies
2. **Chạy dev server**: `npm run dev`
3. **Mở browser**: [http://localhost:5173](http://localhost:5173)
4. **Landing Page** sẽ hiển thị làm trang chủ
5. **Navigation**: Sử dụng header menu hoặc CTA buttons để chuyển trang

## 🎯 User Journey

```
Landing Page (Homepage)
    ↓
[Đăng Ký] → AuthPage (Register tab)
[Đăng Nhập] → AuthPage (Login tab)
    ↓
[Submit] → RegistrationSuccessPage / MemberPage
```

## 📊 Mock Data

- **Users**: 3 demo accounts (admin, trainer, member)
- **Packages**: 3 gói tập (Trial, 3 tháng, 12 tháng)
- **Branches**: 4 chi nhánh tại TP.HCM
- **Testimonials**: 6 đánh giá từ hội viên thực tế
