# Member Feature

## Cấu trúc thư mục (Refactored theo pattern YBA)

```
src/features/member/
├── api/                 # API Layer
│   ├── healthInfo.api.ts
│   ├── healthInfo.queries.ts
│   ├── user.api.ts
│   ├── user.queries.ts
│   └── index.ts
├── components/          # UI Components
│   ├── MemberLayout.tsx
│   ├── MemberSidebar.tsx
│   ├── MemberTable.tsx
│   ├── ModalCreateScheduleWithPT.tsx
│   ├── ModalPayment.tsx
│   └── index.ts
├── config/             # Configuration
│   ├── healthInfo-form-fields.ts
│   ├── user-form-fields.ts
│   └── index.ts
├── docs/               # Documentation
│   └── API_INTEGRATION.md
├── pages/              # Page Components
│   ├── MemberDashboard.tsx
│   ├── MemberProfile.tsx
│   ├── MemberCheckin.tsx
│   ├── MemberPackages.tsx
│   ├── MemberPayments.tsx
│   ├── MemberSchedule.tsx
│   ├── MemberHistory.tsx
│   ├── MemberNotifications.tsx
│   ├── MemberSuggestions.tsx
│   └── index.ts
├── schemas/            # Validation Schemas
│   ├── healthInfo.schema.ts
│   ├── user.schema.ts
│   └── index.ts
├── transformers/       # Data Transformers
│   ├── healthInfo.transformers.ts
│   ├── user.transformers.ts
│   └── index.ts
├── types/              # TypeScript Types
├── utils/              # Utility Functions
│   ├── healthInfo.utils.ts
│   ├── user.utils.ts
│   └── index.ts
├── index.ts            # Main exports
└── README.md           # This file
```

## API Layer

### HealthInfo API
- **File**: `api/healthInfo.api.ts`
- **Chức năng**: API functions cho health info
- **Methods**:
  - `getMyHealthInfo()` - Lấy thông tin sức khỏe hiện tại
  - `getHealthInfoByMemberId(memberId)` - Lấy thông tin sức khỏe theo member ID
  - `createHealthInfo(memberId, data)` - Tạo thông tin sức khỏe mới
  - `updateHealthInfo(healthInfoId, data)` - Cập nhật thông tin sức khỏe
  - `getHealthInfoById(healthInfoId)` - Lấy thông tin sức khỏe theo ID

### User API
- **File**: `api/user.api.ts`
- **Chức năng**: API functions cho user
- **Methods**:
  - `getMe()` - Lấy thông tin user hiện tại
  - `getUserById(userId)` - Lấy thông tin user theo ID
  - `updateMyProfile(data)` - Cập nhật profile hiện tại
  - `updateUser(userId, data)` - Cập nhật user khác
  - `changeUserStatus(userId, status)` - Thay đổi trạng thái user
  - `getMembers(page, limit)` - Lấy danh sách members
  - `getStaffs()` - Lấy danh sách staff
  - `getUsersWithPagination(page, limit)` - Lấy users với phân trang

## React Query Hooks

### HealthInfo Queries
- **File**: `api/healthInfo.queries.ts`
- **Chức năng**: React Query hooks cho health info
- **Hooks**:
  - `useHealthInfo(memberId?)` - Query hook
  - `useCreateHealthInfo()` - Mutation hook tạo mới
  - `useUpdateHealthInfo()` - Mutation hook cập nhật

### User Queries
- **File**: `api/user.queries.ts`
- **Chức năng**: React Query hooks cho user
- **Hooks**:
  - `useMe()` - Query hook lấy thông tin hiện tại
  - `useUser(userId)` - Query hook lấy user theo ID
  - `useUpdateMyProfile()` - Mutation hook cập nhật profile
  - `useUpdateUser()` - Mutation hook cập nhật user
  - `useChangeUserStatus()` - Mutation hook thay đổi trạng thái

## Schemas (Validation)

### HealthInfo Schema
- **File**: `schemas/healthInfo.schema.ts`
- **Chức năng**: Zod validation schemas cho health info
- **Schemas**:
  - `healthInfoSchema` - Schema chính
  - `createHealthInfoSchema` - Schema tạo mới
  - `updateHealthInfoSchema` - Schema cập nhật

### User Schema
- **File**: `schemas/user.schema.ts`
- **Chức năng**: Zod validation schemas cho user
- **Schemas**:
  - `userProfileSchema` - Schema profile cơ bản
  - `memberInfoSchema` - Schema thông tin member
  - `trainerInfoSchema` - Schema thông tin trainer
  - `staffInfoSchema` - Schema thông tin staff
  - `adminInfoSchema` - Schema thông tin admin

## Transformers

### HealthInfo Transformers
- **File**: `transformers/healthInfo.transformers.ts`
- **Chức năng**: Transform data giữa API và UI
- **Methods**:
  - `toDisplay()` - Transform cho hiển thị
  - `toApi()` - Transform cho API
  - `toForm()` - Transform cho form

### User Transformers
- **File**: `transformers/user.transformers.ts`
- **Chức năng**: Transform data giữa API và UI
- **Methods**:
  - `toDisplay()` - Transform cho hiển thị
  - `toApi()` - Transform cho API
  - `toForm()` - Transform cho form

## Utils

### HealthInfo Utils
- **File**: `utils/healthInfo.utils.ts`
- **Chức năng**: Utility functions cho health info
- **Methods**:
  - `calculateBMI()` - Tính BMI
  - `getBMICategory()` - Lấy danh mục BMI
  - `getBMIColor()` - Lấy màu BMI
  - `getGoalText()` - Lấy text mục tiêu
  - `validateHealthInfo()` - Validate dữ liệu

### User Utils
- **File**: `utils/user.utils.ts`
- **Chức năng**: Utility functions cho user
- **Methods**:
  - `getStatusText()` - Lấy text trạng thái
  - `getRoleText()` - Lấy text vai trò
  - `getInitials()` - Lấy chữ cái đầu
  - `calculateAge()` - Tính tuổi
  - `validateUser()` - Validate dữ liệu

## Config

### Form Fields Config
- **File**: `config/healthInfo-form-fields.ts`
- **Chức năng**: Cấu hình form fields cho health info
- **File**: `config/user-form-fields.ts`
- **Chức năng**: Cấu hình form fields cho user

## Pages

### MemberProfile
- **File**: `pages/MemberProfile.tsx`
- **Chức năng**: Màn hình thông tin cá nhân và sức khỏe
- **Tính năng**:
  - Hiển thị thông tin cá nhân từ API
  - Hiển thị thông tin sức khỏe từ API
  - Chỉnh sửa thông tin cá nhân
  - Tạo/cập nhật thông tin sức khỏe
  - Loading states và error handling
  - Toast notifications

## Cách sử dụng

### Import Services
```typescript
import { healthInfoApi, userApi } from '@/features/member/api';
```

### Import Hooks
```typescript
import { useHealthInfo, useMe, useUpdateMyProfile } from '@/features/member/hooks';
```

### Import Components
```typescript
import { MemberProfile } from '@/features/member/pages';
```

## API Endpoints

### Health Info
- `GET /api/health-info/me` - Lấy thông tin sức khỏe hiện tại
- `GET /api/health-info/member/{memberId}` - Lấy thông tin sức khỏe theo member ID
- `POST /api/health-info/{memberId}` - Tạo thông tin sức khỏe mới
- `PUT /api/health-info/{healthInfoId}` - Cập nhật thông tin sức khỏe

### User
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/user/me/profile` - Cập nhật profile hiện tại
- `GET /api/user/{userId}` - Lấy thông tin user theo ID
- `PUT /api/user/{userId}` - Cập nhật user
- `PUT /api/user/{userId}/status` - Thay đổi trạng thái user

## Dependencies

- `@tanstack/react-query` - Data fetching và caching
- `axios` - HTTP client
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `react-hook-form` - Form handling
- `zod` - Validation