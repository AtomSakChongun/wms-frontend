# Design Document — Mobile Responsive Design

## Overview

ฟีเจอร์นี้ปรับ WMS Frontend ให้รองรับการแสดงผลบน mobile, tablet และ desktop โดยไม่เปลี่ยน UX บน desktop ที่มีอยู่เดิม กลยุทธ์หลักคือ **Mobile-First Tailwind Classes** — เพิ่ม responsive prefix (`sm:`, `md:`, `lg:`) เข้าไปในไฟล์ที่มีอยู่แล้ว และขยาย Zustand sidebar store ให้รองรับ mobile drawer state

Stack ที่ใช้อยู่แล้ว (`React + TypeScript + Tailwind CSS`) รองรับ responsive design ได้โดยธรรมชาติ ไม่ต้องติดตั้ง dependency ใหม่ใดๆ

---

## Architecture

### Breakpoints (ตาม Tailwind defaults)

| Name | Prefix | Width |
|---|---|---|
| Mobile (default) | *(none)* | 0 – 767px |
| Tablet | `md:` | 768px – 1023px |
| Desktop | `lg:` | 1024px+ |

### State Management Extension

`useSidebarStore` เพิ่ม `mobileOpen` state แยกต่างหากจาก `collapsed` เพื่อให้ desktop collapse behavior กับ mobile drawer behavior ทำงานอิสระจากกัน

```
useSidebarStore
  ├── collapsed: boolean          (desktop only)
  ├── toggle: () => void          (desktop only)
  ├── mobileOpen: boolean         (mobile only) [NEW]
  ├── openMobile: () => void      (mobile only) [NEW]
  └── closeMobile: () => void     (mobile only) [NEW]
```

### Layout Flow

```
Desktop:
  [Sidebar fixed w-20/w-72] [flex-1 content]

Mobile:
  [full-width content]
  [Mobile_Drawer overlay — position:fixed, translate-x-full when closed]
  [Overlay backdrop — fixed inset-0 bg-black/50 when mobileOpen]
```

---

## Components and Interfaces

### 1. `src/stores/sidebar.store.ts`

เพิ่ม 3 fields เข้า interface และ initial state:

```ts
interface SidebarStore {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;          // [NEW]
  openMobile: () => void;       // [NEW]
  closeMobile: () => void;      // [NEW]
}
```

### 2. `src/layouts/Sidebar.tsx`

**Desktop** (`md:` and above): พฤติกรรมเดิม — fixed sidebar ใน document flow

**Mobile** (default, below `md:`): เปลี่ยนเป็น `position: fixed` overlay drawer

Tailwind pattern หลัก:

```
<aside
  // Mobile: fixed overlay drawer
  className={cn(
    "fixed inset-y-0 left-0 z-40 h-screen bg-slate-950 text-white ...",
    "transition-transform duration-300",
    // Mobile: slide in/out
    mobileOpen ? "translate-x-0" : "-translate-x-full",
    // Desktop: always visible, not translated
    "md:relative md:translate-x-0 md:flex md:flex-col",
    collapsed ? "md:w-20" : "md:w-72"
  )}
>
```

Overlay backdrop (mobile only):

```tsx
{/* Overlay — shown only on mobile when mobileOpen */}
{mobileOpen && (
  <div
    className="fixed inset-0 z-30 bg-black/50 md:hidden"
    onClick={closeMobile}
  />
)}
```

SidebarItem ต้องเรียก `closeMobile` เมื่อ navigate (ส่ง `onNavigate` prop หรือใช้ store โดยตรง):

```tsx
// SidebarItem.tsx
const { closeMobile } = useSidebarStore();
// ใน NavLink onClick:
onClick={closeMobile}
```

### 3. `src/layouts/Header.tsx`

เพิ่ม hamburger button (mobile only) และซ่อน user text:

```tsx
// Hamburger — แสดงเฉพาะ mobile
<button
  className="md:hidden p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px]"
  onClick={openMobile}
  aria-label="Open navigation"
>
  <Menu size={20} />
</button>

// Breadcrumb — truncate on mobile
<nav className="flex items-center gap-2 text-sm min-w-0">
  <Link className="text-slate-400 ... truncate max-w-[100px] md:max-w-none">
    {breadcrumb.sectionTitle}
  </Link>
  ...
  <span className="text-slate-800 font-semibold truncate">
    {breadcrumb.pageLabel}
  </span>
</nav>

// User info — ซ่อน text บน mobile
<div className="flex items-center gap-2">
  <UserCircle2 size={34} />
  {/* ซ่อนบน mobile, แสดงบน md+ */}
  <div className="hidden md:block text-right">
    <p className="text-sm font-semibold">Atom</p>
    <p className="text-xs text-slate-500">Administrator</p>
  </div>
</div>
```

### 4. `src/layouts/MainLayout.tsx`

บน mobile Sidebar ออกจาก document flow (fixed positioned) แล้ว ดังนั้น MainLayout ไม่ต้องเปลี่ยนมากนัก แต่ต้องป้องกัน content ซ่อนใต้ drawer:

```tsx
export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />  {/* mobile: fixed overlay, desktop: flex item */}

      {/* md:ml-0 เพราะ sidebar เป็น relative ใน md+ */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

`min-w-0` บน content wrapper ป้องกัน flexbox overflow

### 5. `src/features/products/ProductPage.tsx` และ `src/features/inventory/InventoryPage.tsx`

**Page header** — stack บน mobile:

```tsx
{/* เปลี่ยนจาก: flex items-start justify-between */}
<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
  <div>...</div>
  {/* Action buttons — wrap บน mobile */}
  <div className="flex flex-wrap items-center gap-2">
    ...buttons...
  </div>
</div>
```

**Stat grid** — 2 cols บน mobile, 4 cols บน desktop:

```tsx
{/* เปลี่ยนจาก: grid grid-cols-4 gap-4 */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

### 6. `src/features/dashboard/DashboardPage.tsx`

Stat grid — 1 col mobile, 2 cols tablet, 4 cols desktop:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

### 7. `src/components/table/DataTable.tsx`

**Horizontal scroll wrapper:**

```tsx
{/* เปลี่ยนจาก: <div className="overflow-hidden rounded-xl border ..."> */}
<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full">
      ...
    </table>
  </div>
  ...pagination...
</div>
```

**Pagination** — stack บน mobile (ใช้อยู่แล้วบางส่วน):

```tsx
{/* ตรวจสอบว่ามี flex-col gap-3 md:flex-row md:items-center md:justify-between แล้ว */}
<div className="flex flex-col gap-3 border-t bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
```

**Column visibility — `meta.hideOnMobile`:**

```tsx
// ใน DataTable.tsx — กรอง columns ตาม meta flag
// ใช้ columnVisibility state ของ TanStack Table
const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

// ตัดสินใจ visibility จาก window width หรือ CSS class
// วิธีที่ clean ที่สุดคือใช้ CSS class บน <th>/<td> ตาม meta:
// column.columnDef.meta?.hideOnMobile -> add className "hidden md:table-cell"
```

Pattern สำหรับ hide column:

```tsx
<th
  className={cn(
    "px-5 py-4 ...",
    header.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell"
  )}
>

<td
  className={cn(
    "px-5 py-4",
    cell.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell"
  )}
>
```

ต้อง extend ColumnMeta type:

```ts
// src/types/table.d.ts หรือใน DataTable.tsx
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    hideOnMobile?: boolean;
  }
}
```

### 8. `src/features/productDetail/component/ProductBasicInfo.tsx` (และ form sections อื่นๆ)

```tsx
{/* เปลี่ยนจาก: grid grid-cols-2 gap-6 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  ...
  {/* col-span-2 → col-span-1 md:col-span-2 */}
  <div className="col-span-1 md:col-span-2">
    <FormInput label="Product Name" ... />
  </div>
</div>
```

Pattern เดียวกันนี้ใช้กับทุก form section ใน ProductDetail (`ProductPricing`, `ProductPhysical`, `ProductSupplier`, `ProductBarcode`, `ProductInventory`)

### 9. `src/features/productDetail/component/ProductHeader.tsx`

```tsx
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  {/* stack บน mobile, row บน md+ */}
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3">
      <PackagePlus className="h-8 w-8 text-indigo-600 shrink-0" />
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Create Product</h1>
        <p className="text-sm text-slate-500">...</p>
      </div>
    </div>
    {/* Action buttons slot (ถ้ามี) */}
  </div>
</div>
```

### 10. `src/features/productDetail/component/ProductFooter.tsx`

```tsx
<div className="sticky bottom-0 flex flex-col-reverse gap-3 md:flex-row md:justify-end rounded-2xl border bg-white p-5 shadow-lg">
  <button
    type="button"
    className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-5 py-3 min-h-[44px] ..."
  >
    Cancel
  </button>
  <button
    type="submit"
    className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-5 py-3 min-h-[44px] ..."
  >
    {loading ? "Saving..." : "✓ Create Product"}
  </button>
</div>
```

`flex-col-reverse` ทำให้ Submit button อยู่บนสุดบน mobile (ตาม UX best practice)

### 11. FilterPanel (`inventoryFilters.tsx` / `ProductFilters.tsx`)

FilterPanel ใช้ `grid-cols-1 md:grid-cols-4` อยู่แล้ว (`grid grid-cols-1 md:grid-cols-4 gap-4`). ตรวจสอบว่า TextField/Autocomplete ของ MUI มี `fullWidth` prop แล้ว ดังนั้นจะยืดเต็ม column โดยอัตโนมัติ

---

## Data Models

### Extended SidebarStore

```ts
interface SidebarStore {
  // Desktop state
  collapsed: boolean;
  toggle: () => void;

  // Mobile drawer state
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

// Implementation
export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),

  mobileOpen: false,
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
}));
```

### ColumnMeta Extension

```ts
// Augment TanStack Table ColumnMeta
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    hideOnMobile?: boolean;
  }
}
```

Usage ใน column definitions:

```ts
{
  accessorKey: "barcode",
  header: "Barcode",
  meta: { hideOnMobile: true },  // ซ่อนบน mobile
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

ฟีเจอร์นี้เป็น UI/layout responsive feature ซึ่งส่วนใหญ่เป็น CSS class changes และ component rendering ที่ขึ้นอยู่กับ breakpoint สำหรับ property-based testing มีสองส่วนที่มี universal property ชัดเจน:

### Property 1: Mobile Sidebar Store Round-Trip

*For any* sequence of openMobile and closeMobile calls on the useSidebarStore, calling closeMobile should always result in `mobileOpen === false`, and calling openMobile should always result in `mobileOpen === true`, regardless of prior state.

**Validates: Requirements 1.7**

### Property 2: hideOnMobile Column Suppression

*For any* column definition array where at least one column has `meta.hideOnMobile: true`, and any non-empty dataset, the DataTable rendered at mobile viewport width (< 768px) should not render any `<th>` or `<td>` elements that correspond to columns with `meta.hideOnMobile: true`.

**Validates: Requirements 6.4**

### Property 3: No Horizontal Page Overflow on Mobile

*For any* page component rendered at a viewport width between 320px and 767px (inclusive), the root content container's scrollWidth should equal its clientWidth — i.e., no horizontal overflow occurs.

**Validates: Requirements 2.3, 9.1**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `mobileOpen` ยังเป็น `true` เมื่อ resize ไป desktop | `md:hidden` class บน overlay ซ่อน backdrop โดยอัตโนมัติ; `md:translate-x-0` บน sidebar ทำให้ sidebar แสดงผลถูกต้องแม้ state ยังไม่ reset |
| Column `meta` ไม่ได้ set `hideOnMobile` | Default `undefined` → falsy → column แสดงปกติ ไม่มี side effect |
| SidebarItem navigate แล้ว `closeMobile` ไม่ถูกเรียก | NavLink `onClick` handler เรียก `closeMobile` เสมอ; ถ้า `mobileOpen` เป็น `false` อยู่แล้ว Zustand `set` ไม่ trigger re-render |
| Overflow content ใน DataTable บน mobile | `overflow-x-auto` wrapper จำกัด scroll ไว้ใน table container ไม่ให้ page-level scroll เกิด |

---

## Testing Strategy

ฟีเจอร์นี้เป็น UI/layout changes ที่ใช้ Tailwind CSS เป็นหลัก กลยุทธ์การ test แบ่งเป็น 3 ระดับ:

### Unit Tests (Example-Based)

ทดสอบ store logic และ component rendering ด้วยตัวอย่างเฉพาะเจาะจง:

**Store Tests (`sidebar.store.test.ts`)**
- `openMobile()` sets `mobileOpen` to `true`
- `closeMobile()` sets `mobileOpen` to `false`
- `toggle()` ยังทำงานปกติโดยไม่กระทบ `mobileOpen`
- Initial state: `collapsed: false`, `mobileOpen: false`

**Component Rendering Tests**
- `Header` แสดง hamburger button เมื่อ render ที่ `window.innerWidth < 768`
- `Header` ซ่อน user text (ชื่อ + role) บน mobile
- `Sidebar` มี `-translate-x-full` class เมื่อ `mobileOpen: false`
- `Sidebar` มี `translate-x-0` class เมื่อ `mobileOpen: true`
- `Overlay` backdrop render เมื่อ `mobileOpen: true`; click ซ่อน drawer
- `ProductFooter` มี `w-full` บน buttons เมื่อ mobile
- `ProductBasicInfo` grid container มี `grid-cols-1` class

**DataTable Tests**
- Table element อยู่ใน `overflow-x-auto` container
- Column ที่มี `meta.hideOnMobile: true` มี `hidden md:table-cell` class บน `<th>` และ `<td>`
- Pagination container มี `flex-col` class (mobile) และ `md:flex-row`

### Property-Based Tests (เฉพาะจุดที่เหมาะสม)

ใช้ **Vitest + fast-check** เป็น property-based testing library

```ts
// ติดตั้ง: npm install --save-dev fast-check
```

**Property Test 1: Sidebar Store Round-Trip**
```
Feature: mobile-responsive-design, Property 1: Mobile Sidebar Store Round-Trip
```
- Generate random sequences of `openMobile` / `closeMobile` calls (min 100 iterations)
- Assert: `openMobile()` → `mobileOpen === true` invariant
- Assert: `closeMobile()` → `mobileOpen === false` invariant
- Assert: `mobileOpen` และ `collapsed` เปลี่ยนแปลงอิสระจากกัน

**Property Test 2: hideOnMobile Column Suppression**
```
Feature: mobile-responsive-design, Property 2: hideOnMobile Column Suppression
```
- Generate arbitrary column arrays (subset มี `meta.hideOnMobile: true`)
- Generate arbitrary row data arrays
- Render `DataTable` จำลอง mobile viewport
- Assert: ไม่มี `<th>` หรือ `<td>` ที่ correspond กับ hidden columns ใน DOM

**Property Test 3: No Horizontal Overflow**
```
Feature: mobile-responsive-design, Property 3: No Horizontal Page Overflow on Mobile
```
- Generate viewport widths ในช่วง 320–767 (integer)
- Render แต่ละ page component ที่ความกว้างนั้น
- Assert: `container.scrollWidth <= container.clientWidth`

แต่ละ property test ต้องรัน **อย่างน้อย 100 iterations**

### Integration / Manual QA

- ทดสอบ hamburger → drawer open → overlay click → drawer close บน Chrome DevTools device simulation
- ทดสอบ resize จาก mobile → desktop ว่า sidebar กลับมาปกติ
- ทดสอบ navigation item click ปิด drawer
- ทดสอบ DataTable horizontal scroll บน viewport 375px
- ทดสอบ ProductDetail form บน viewport 375px ว่าทุก field เต็มความกว้าง
- ทดสอบ touch target ขนาด ≥ 44px ด้วย Chrome DevTools accessibility inspector
