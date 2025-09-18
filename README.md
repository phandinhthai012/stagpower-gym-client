# StagPower Gym Management System - Frontend

Hệ thống quản lý phòng gym thông minh - Phần Frontend

## 🚀 Công nghệ sử dụng

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ESLint** - Code quality
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling

## 📦 Cài đặt

```bash
npm install
```

## 🏃‍♂️ Chạy development server

```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts có sẵn

- `npm start` - Chạy development server
- `npm build` - Build cho production
- `npm test` - Chạy tests
- `npm run lint` - Kiểm tra code quality
- `npm run lint:fix` - Tự động fix lỗi ESLint
- `npm run type-check` - Kiểm tra TypeScript

## 📁 Cấu trúc thư mục

```
src/
├── components/     # React components
│   ├── common/     # Components dùng chung
│   ├── layout/     # Layout components
│   └── features/   # Feature-specific components
├── features/       # Features page
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── store/          # State management
└── assets/         # Static assets
```

## 🎨 Design System

Project sử dụng Tailwind CSS với custom design tokens cho:
- Colors
- Typography
- Spacing
- Components

## 🔧 Cấu hình

- **Tailwind CSS**: `tailwind.config.js`
- **ESLint**: `.eslintrc.js`
- **TypeScript**: `tsconfig.json`
- **PostCSS**: `postcss.config.js`

## 📝 Ghi chú

- Đảm bảo chạy `npm run lint` trước khi commit
- Sử dụng TypeScript strict mode
- Tuân thủ ESLint rules
- Responsive design với Tailwind CSS
