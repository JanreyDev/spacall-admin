# AI Coding Agent Instructions

## Project Overview

**Spacall Admin Dashboard** is a Next.js 16 admin interface for managing a therapist booking marketplace. It provides core admin features: therapist/client management, bookings, payments, disputes, messaging, analytics, and platform administration.

## Architecture & Key Patterns

### Stack

- **Framework**: Next.js 16 with TypeScript (strict mode)
- **Styling**: Tailwind CSS + Class Variance Authority (CVA) for component variants
- **UI Components**: Radix UI primitives (accessible, unstyled)
- **Forms**: React Hook Form with @hookform/resolvers
- **Theme**: next-themes for dark/light mode support
- **Icons**: Lucide React

### Directory Structure

```
app/                    # Next.js App Router pages
  admin/               # Protected admin routes with layout
  (auth)/login/        # Public auth route
components/
  ui/                  # Radix-based primitive components (button, table, card, etc.)
  layout/             # Reusable header/sidebar components
  analytics/          # Dashboard analytics components
  message-logs/       # Message viewer components
lib/
  mock-data.ts        # Data types & mock data (primary data source)
  utils.ts            # cn() function for Tailwind merging
```

### Layout Architecture

- **Admin Layout** (`app/admin/layout.tsx`): Collapsible sidebar + header, responsive padding transitions
- **Responsive Design**: Sidebar collapses on desktop (pl-16/pl-64), mobile drawer triggered from header
- **Navigation**: Centralized nav items in [sidebar.tsx](components/sidebar.tsx#L23) with Next.js Link + active route highlighting via `usePathname()`

### Component Design Patterns

#### UI Components (`components/ui/`)

- **Built with Radix UI primitives** - Headless, composable, accessible
- **CVA Variants**: Button uses CVA for variant/size combinations (e.g., `variant="default"`, `size="sm"`)
- **Styling**: All use Tailwind classes; `cn()` utility merges className conflicts
- **Slot Pattern**: Accepts `asChild` prop to render as different elements (Button can be a Link)

#### Data Display Components

- **Tables**: Use native `<Table>` with `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- **Status Badges**: Style using status-specific CSS classes stored in `statusStyles` object
- **Date Formatting**: Consistent use of `toLocaleTimeString()` / `toLocaleDateString()` with fixed options

#### Theme Integration

- Expect CSS variables: `--color-primary`, `--color-background`, `--color-card`, `--color-border`, etc.
- Tables reference colors via `var(--color-*)` for theme compatibility
- Next-themes provider at root enables dark mode toggling

## Data Flow

### Data Source

- **No API layer yet** - all data comes from [lib/mock-data.ts](lib/mock-data.ts)
- Mock data includes interfaces: `Therapist`, `Client`, `Booking`, `Payout`, `Message`, `Review`, `Alert`, `Dispute`
- Mock collections: `mockTherapists`, `mockClients`, `mockBookings`, `mockAlerts`, `mockDashboardMetrics`
- When building features, import mock data and types from `@/lib/mock-data`

### Data Integration Strategy

1. Import mock data and interfaces in page components
2. Pass data to table/list components as props
3. When API is ready, replace mock data imports with API calls in page-level `getServerSideProps` or React Server Components

## Development Workflow

### Commands

```bash
npm run dev    # Development server (localhost:3000)
npm run build  # Production build
npm run lint   # ESLint check (Next.js + TypeScript rules)
npm run start   # Production server
```

### Key Developer Notes

- **TypeScript strict mode**: All types must be explicit; avoid `any`
- **Build errors ignored**: `next.config.ts` has `typescript.ignoreBuildErrors: true` (review & fix when onboarding)
- **Unoptimized images**: `images.unoptimized: true` (for mock deployment)
- **ESLint**: Uses Next.js core-web-vitals and TypeScript configs

## Conventions & Patterns

### Naming & Organization

- **Page components**: Always place in `app/[section]/page.tsx` (e.g., `app/admin/therapists/page.tsx`)
- **Reusable components**: Place in `components/` with clear naming (e.g., `booking-table.tsx`, `revenue-chart.tsx`)
- **Interfaces**: Define in `lib/mock-data.ts` (e.g., `Booking`, `Therapist`)
- **Import paths**: Use `@/` alias for all imports (e.g., `@/components/ui/button`)

### Component Props & Types

- Always define explicit prop interfaces (e.g., `interface BookingTableProps { bookings: Booking[]; compact?: boolean }`)
- Props should be optional (`?`) when they have defaults
- Use discriminated unions for status enums (e.g., `"Verified" | "Pending" | "Rejected"`)

### Styling Conventions

- **Spacing**: Use Tailwind utilities (p-6, gap-4, etc.)
- **Responsive**: Use Tailwind breakpoints (md:, lg:, etc.)
- **Colors**: Reference CSS variables in tables, use Tailwind color names in components
- **Typography**: Use semantic sizes (text-sm, font-medium, etc.)
- **Status Styling**: Define as `Record<StatusType, { bg: string; text: string }>` objects (see booking-table.tsx)

### Client-Side Components

- Mark interactive components with `"use client"` directive
- Use `useState` for UI state (sidebar collapse, mobile drawer, etc.)
- Use `usePathname()` for active route detection
- Form components use React Hook Form

### Page Structure

- Server components by default (no `"use client"` unless needed)
- Import data from mock-data
- Import reusable components from `components/`
- Layout typically: metrics grid → main content grid (e.g., chart + sidebar, table, etc.)

## Integration Points & Extensibility

### Adding New Pages

1. Create `app/admin/[section]/page.tsx`
2. Import mock data and interfaces from `@/lib/mock-data`
3. Import reusable components from `@/components/`
4. Use consistent grid layouts (md:grid-cols-2, lg:grid-cols-3, etc.)

### Adding New Data Types

1. Add interface to `lib/mock-data.ts`
2. Add mock data collection (e.g., `mockNewFeature: NewFeature[]`)
3. Import and use in page components

### Adding New Table/List Components

1. Create component in `components/` with name ending in `-table.tsx` or `-list.tsx`
2. Accept data array + optional `compact` boolean as props
3. Use consistent table structure with dropdowns for actions
4. Apply status styling pattern from booking-table.tsx

## Testing & Debugging

- Run `npm run lint` before committing
- Check TypeScript errors: `npm run build` (currently ignores build errors)
- Mock data has realistic sample data for all features
- Responsive design: Test at md (768px) and lg (1024px) breakpoints

## External Dependencies Worth Knowing

- **Radix UI**: Accessible component primitives (all in `components/ui/`)
- **next-themes**: Dark mode detection & toggling
- **date-fns**: Not currently used heavily, but available for date manipulation
- **React Hook Form**: Form state management (imported but not heavily used yet)
- **Embla Carousel**: Available for carousel components
