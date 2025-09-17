# Component Migration from yba-zma to StagPower Gym Client

This document outlines the components that have been migrated from the `yba-zma` project to the `stagpower-gym-client` project.

## 🎯 Migration Overview

The migration focused on essential components needed for a gym management system, including:
- UI components for building forms and interfaces
- Data table components for managing members, packages, and subscriptions
- Layout components for admin dashboard
- Common utilities and helpers

## 📦 Dependencies Added

The following dependencies were added to support the migrated components:

### Core UI Libraries
- `@radix-ui/*` - Headless UI components for accessibility
- `class-variance-authority` - For component variants
- `clsx` & `tailwind-merge` - For conditional styling
- `lucide-react` - Icon library

### Data Management
- `@tanstack/react-table` - Advanced data table functionality
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling
- `zod` - Schema validation

### Utilities
- `date-fns` - Date manipulation
- `zustand` - State management
- `sonner` - Toast notifications

## 🧩 Migrated Components

### UI Components (`src/components/ui/`)
- **Button** - Versatile button component with variants
- **Input** - Form input component
- **Label** - Form label component
- **Card** - Container component with header, content, footer
- **Badge** - Status and category indicators
- **Table** - Basic table structure
- **Select** - Dropdown selection component

### Data Table Components (`src/components/ui/data-table/`)
- **DataTable** - Main data table with sorting, filtering, pagination
- **DataTablePagination** - Pagination controls
- **lib.ts** - Utility functions for table styling

### Layout Components (`src/components/layout/`)
- **AdminLayout** - Main admin dashboard layout
- **AdminHeader** - Top navigation with search and user menu
- **AdminSidebar** - Side navigation with menu items

### Common Components (`src/components/common/`)
- **LoadingSpinner** - Loading indicator
- **ProtectedRoute** - Route protection wrapper

## 🛠️ Utilities (`src/lib/`)
- **utils.ts** - General utility functions (cn, gradient text)
- **date-utils.ts** - Date formatting and manipulation helpers

## 📊 Example Implementation

A sample member management table has been created to demonstrate the components:

```typescript
// src/features/member/components/MemberTable.tsx
import { DataTable } from '../../../components/ui/data-table';
import { mockUsers } from '../../../mockdata';

export function MemberTable() {
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}
```

## 🎨 Styling

The components use Tailwind CSS with a consistent design system:
- **Colors**: Primary, secondary, destructive, muted variants
- **Spacing**: Consistent padding and margins
- **Typography**: Standardized text sizes and weights
- **Shadows**: Subtle shadows for depth
- **Borders**: Rounded corners and border styles

## 🔧 Configuration

### Tailwind Configuration
The project uses Tailwind CSS v3.4+ with custom configuration for:
- Component variants
- Color schemes
- Spacing and sizing
- Animation utilities

### TypeScript Configuration
Enhanced TypeScript support with:
- Strict type checking
- Path mapping for imports
- Component prop types
- Generic type support for data tables

## 🚀 Usage Examples

### Basic Button
```tsx
import { Button } from './components/ui';

<Button variant="default" size="lg">
  Click me
</Button>
```

### Data Table
```tsx
import { DataTable } from './components/ui/data-table';
import { useReactTable } from '@tanstack/react-table';

const table = useReactTable({
  data: yourData,
  columns: yourColumns,
  getCoreRowModel: getCoreRowModel(),
});

<DataTable table={table} />
```

### Layout
```tsx
import { AdminLayout } from './components/layout';

function App() {
  return (
    <AdminLayout>
      {/* Your page content */}
    </AdminLayout>
  );
}
```

## 📋 Next Steps

### Remaining Components to Migrate
1. **Authentication Components** - Login forms, auth providers
2. **Form Components** - Advanced form handling with validation
3. **Modal/Dialog Components** - For member details, package creation
4. **Chart Components** - For reports and analytics
5. **File Upload Components** - For member photos, documents

### Integration Tasks
1. Set up React Query for API calls
2. Implement authentication context
3. Create API service layers
4. Add form validation schemas
5. Implement error handling
6. Add loading states and error boundaries

## 🔍 File Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── common/             # Common utilities
├── features/
│   └── member/             # Feature-specific components
├── lib/                    # Utility functions
├── mockdata/               # Mock data for development
└── pages/                  # Page components
```

## 🎯 Benefits

1. **Consistency**: Unified design system across the application
2. **Accessibility**: Radix UI components provide excellent accessibility
3. **Performance**: Optimized components with proper memoization
4. **Developer Experience**: TypeScript support and clear component APIs
5. **Maintainability**: Modular structure with clear separation of concerns

The migrated components provide a solid foundation for building the StagPower Gym Management System with modern React patterns and best practices.
