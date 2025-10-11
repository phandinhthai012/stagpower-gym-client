# Sửa lỗi thiếu field Gender

## Vấn đề
**400 Bad Request** khi tạo health info do thiếu field `gender` required.

### Nguyên nhân
- **Server validation**: `validateHealthProfileCreate` middleware yêu cầu field `gender` là required
- **Frontend**: Không gửi field `gender` trong request

## Giải pháp

### 1. Thêm field Gender vào form
```tsx
// ✅ Thêm field gender vào form
<div className="space-y-2">
  <Label>Giới tính</Label>
  <select
    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
    value={(isEditingHealth ? editedHealth?.gender : healthInfo?.gender) as string}
    onChange={(e) => handleHealthChange('gender', e.target.value)}
    disabled={!isEditingHealth}
  >
    <option value="male">Nam</option>
    <option value="female">Nữ</option>
  </select>
</div>
```

### 2. Thêm gender vào initialHealth
```typescript
// ✅ Thêm gender vào initialHealth
const initialHealth = {
  height: healthInfo?.height ?? '',
  weight: healthInfo?.weight ?? '',
  gender: healthInfo?.gender ?? userData?.gender ?? 'male', // ✅ Thêm gender
  goal: healthInfo?.goal ?? 'weightLoss',
  experience: healthInfo?.experience ?? 'beginner',
  fitnessLevel: healthInfo?.fitnessLevel ?? 'low',
  preferredTime: healthInfo?.preferredTime ?? 'morning',
  weeklySessions: healthInfo?.weeklySessions ?? '1-2',
  medicalHistory: healthInfo?.medicalHistory ?? '',
  allergies: healthInfo?.allergies ?? ''
};
```

## Server Validation Requirements

### validateHealthProfileCreate
```javascript
body('gender')
    .notEmpty().withMessage('Gender is required')
    .trim()
    .isIn(['male', 'female']).withMessage('Gender must be male or female'),
```

### HealthInfo Model
```javascript
gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
},
```

## Các file đã sửa

1. **`src/features/member/pages/MemberProfile.tsx`**
   - Thêm field gender vào form UI
   - Thêm gender vào initialHealth object
   - Sử dụng userData.gender làm default value

## Kết quả

### ✅ Trước khi sửa:
- ❌ 400 Bad Request - Validation failed
- ❌ Server reject request do thiếu gender
- ❌ Form không thể save

### ✅ Sau khi sửa:
- ✅ Tạo health info thành công
- ✅ Server accept request với đầy đủ fields
- ✅ Form save hoạt động bình thường
- ✅ Gender được lưu vào database

## Test Cases

### 1. Tạo Health Info với Gender
```typescript
// Data được gửi
{
  memberId: "68e5ce6ab4e76ec359980252",
  data: {
    height: 180,
    weight: 80,
    gender: "male",        // ✅ Required field
    goal: "weightLoss",
    experience: "beginner",
    fitnessLevel: "low",
    preferredTime: "morning",
    weeklySessions: "1-2",
    medicalHistory: "",
    allergies: ""
  }
}
```

### 2. Validation Success
- ✅ Server accept tất cả required fields
- ✅ Gender validation pass
- ✅ Data được lưu vào database
- ✅ BMI được tính tự động

## Lưu ý

### 1. Required Fields
- `height` - Required, number
- `weight` - Required, number  
- `gender` - Required, enum ['male', 'female']
- `goal` - Required, string
- `experience` - Required, enum ['beginner', 'intermediate', 'advanced']
- `fitnessLevel` - Required, enum ['low', 'medium', 'high']

### 2. Optional Fields
- `age` - Optional, number
- `bodyFatPercent` - Optional, number
- `preferredTime` - Optional, enum ['morning', 'afternoon', 'evening']
- `weeklySessions` - Optional, enum ['1-2', '3-4', '5+']
- `medicalHistory` - Optional, string
- `allergies` - Optional, string

### 3. Default Values
- Gender default từ userData.gender hoặc 'male'
- Các enum values phải match với server schema
- Sử dụng lowercase values cho consistency
