# Mock Data for StagPower Gym Management System

This directory contains comprehensive mock data for the frontend client development and testing.

## Files Overview

### Core Entities

1. **`users.ts`** - User data with different roles (Member, Trainer, Staff, Admin)
   - 9 users total with role-specific information
   - Includes member_info, trainer_info, staff_info, admin_info

2. **`healthInfo.ts`** - Health information for members
   - 6 health profiles with BMI, goals, experience levels
   - Linked to specific members

3. **`packages.ts`** - Gym packages and pricing
   - 15 different packages (Membership, Combo, PT)
   - Various durations and membership types (Basic, VIP)
   - Trial packages included

4. **`branches.ts`** - Gym branch locations
   - 8 branches across Ho Chi Minh City
   - Different statuses (Active, Maintenance, Closed)

### Business Logic

5. **`subscriptions.ts`** - Member subscriptions
   - 8 subscriptions with different statuses (Active, Expired, Suspended)
   - Includes suspension management and PT session tracking

6. **`payments.ts`** - Payment transactions
   - 10 payments with different methods (Momo, ZaloPay, Cash, Card, BankTransfer)
   - Various payment statuses and discount applications

7. **`discounts.ts`** - Discount and promotion rules
   - 14 discount types (HSSV, VIP, Group, Company, Voucher)
   - Different conditions and package applicability

### Operations

8. **`checkIns.ts`** - Gym check-in/check-out records
   - 21 check-in records with different statuses
   - Includes validation errors and duration tracking

9. **`schedules.ts`** - PT session schedules
   - 17 scheduled PT sessions (Confirmed, Completed, Cancelled)
   - Links members with trainers and subscriptions

10. **`bookingRequests.ts`** - PT booking requests
    - 17 booking requests with different statuses
    - Includes rejection reasons and approval workflow

11. **`aiSuggestions.ts`** - AI-generated workout recommendations
    - 8 personalized workout plans
    - Different goals (WeightLoss, MuscleGain, Health) and levels

## Usage

### Import All Data
```typescript
import { mockData } from './mockdata';
```

### Import Specific Data
```typescript
import { mockUsers, mockPackages } from './mockdata';
```

### Helper Functions
```typescript
import { 
  getMockDataById, 
  getMockDataByMemberId, 
  getMockStats 
} from './mockdata';

// Get specific user
const user = getMockDataById('users', '507f1f77bcf86cd799439011');

// Get all subscriptions for a member
const memberSubscriptions = getMockDataByMemberId('subscriptions', '507f1f77bcf86cd799439011');

// Get statistics
const stats = getMockStats();
```

## Data Relationships

The mock data follows the database schema relationships:

- **Users** → **HealthInfo** (one-to-one for members)
- **Users** → **Subscriptions** (one-to-many)
- **Users** → **Payments** (one-to-many)
- **Users** → **CheckIns** (one-to-many)
- **Users** → **Schedules** (one-to-many as member and trainer)
- **Users** → **BookingRequests** (one-to-many as member and trainer)
- **Users** → **AISuggestions** (one-to-many)
- **Packages** → **Subscriptions** (one-to-many)
- **Branches** → **Subscriptions** (one-to-many)
- **Branches** → **CheckIns** (one-to-many)
- **Branches** → **Schedules** (one-to-many)
- **Subscriptions** → **Payments** (one-to-many)
- **Subscriptions** → **Schedules** (one-to-many)
- **Subscriptions** → **BookingRequests** (one-to-many)

## Sample Data Highlights

### Users
- **Nguyễn Văn An**: VIP member with 12-month subscription
- **Trần Thị Bình**: HSSV member with 3-month Basic subscription
- **Lê Văn Cường**: VIP member with Combo package (6 months + 10 PT sessions)
- **Hoàng Văn Em**: Trainer specializing in Weight Training, Cardio, Yoga
- **Võ Thị Phương**: Trainer specializing in Pilates, Functional Training

### Packages
- **Basic Memberships**: 1, 3, 6, 12 months (Single branch access)
- **VIP Memberships**: 1, 3, 12 months (All branches access)
- **Combo Packages**: Membership + PT sessions
- **PT Only**: Individual PT session packages
- **Trial Packages**: 3 and 7-day trial options

### Business Scenarios
- Active members with regular check-ins
- Expired subscriptions requiring renewal
- Suspended memberships with suspension history
- PT sessions with different statuses
- Various payment methods and discount applications
- AI-generated workout recommendations based on member goals

## Notes

- All timestamps are in ISO format
- Prices are in Vietnamese Dong (VNĐ)
- IDs follow MongoDB ObjectId format
- Data includes realistic Vietnamese names and addresses
- Business rules from the system requirements are reflected in the data
