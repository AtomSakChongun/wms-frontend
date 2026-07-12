# Implementation Plan: Mobile Responsive Design

## Overview

ปรับ WMS Frontend ให้รองรับ mobile, tablet และ desktop โดยใช้ Mobile-First Tailwind CSS classes เป็นหลัก ขยาย Zustand sidebar store สำหรับ mobile drawer state และเพิ่ม ColumnMeta type extension สำหรับ column visibility บน mobile

## Tasks

- [ ] 1. ขยาย useSidebarStore ให้รองรับ mobile drawer state
  - [ ] 1.1 เพิ่ม `mobileOpen`, `openMobile`, `closeMobile` เข้า `useSidebarStore` ใน `src/stores/sidebar.store.ts`
    - เพิ่ม interface `SidebarStore` ด้วย fields: `mobileOpen: boolean`, `openMobile: () => void`, `closeMobile: () => void`
    - ตั้ง initial state `mobileOpen: false`
    - implement `openMobile` ด้วย `set({ mobileOpen: true })`
    - implement `closeMobile` ด้วย `set({ mobileOpen: false })`
    - ตรวจสอบว่า `toggle()` ที่มีอยู่แล้วยังทำงานปกติโดยไม่กระทบ `mobileOpen`
    - _Requirements: 1.7_
  - [ ]* 1.2 Write property test for sidebar store round-trip
    - **Property 1: Mobile Sidebar Store Round-Trip**
    - **Validates: Requirements 1.7**
    - ใช้ Vitest + fast-check สร้าง test ใน `src/stores/sidebar.store.test.ts`
    - generate random sequences ของ `openMobile` / `closeMobile` calls (min 100 iterations)
    - assert: `openMobile()` → `mobileOpen === true` invariant
    - assert: `closeMobile()` → `mobileOpen === false` invariant
    - assert: `mobileOpen` และ `collapsed` เปลี่ยนแปลงอิสระจากกัน

- [ ] 2. เพิ่ม ColumnMeta type extension สำหรับ hideOnMobile
  - [ ] 2.1 สร้าง type declaration สำหรับ TanStack Table ColumnMeta ใน `src/types/table.d.ts`
    - declare module `"@tanstack/react-table"` และ extend `ColumnMeta<TData, TValue>` ด้วย `hideOnMobile?: boolean`
    - _Requirements: 6.4_

- [ ] 3. แก้ Layout Components (Sidebar, Header, MainLayout)
  - [ ] 3.1 แก้ `src/layouts/Sidebar.tsx` ให้รองรับ mobile drawer overlay
    - import `useSidebarStore` และ destructure `mobileOpen`, `closeMobile`
    - ปรับ `<aside>` className ด้วย pattern: `fixed inset-y-0 left-0 z-40 ... transition-transform duration-300` และ `mobileOpen ? "translate-x-0" : "-translate-x-full"` สำหรับ mobile
    - เพิ่ม `md:relative md:translate-x-0 md:flex md:flex-col` และ `collapsed ? "md:w-20" : "md:w-72"` สำหรับ desktop
    - เพิ่ม overlay backdrop `<div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={closeMobile} />` เมื่อ `mobileOpen === true`
    - _Requirements: 1.1, 1.3, 1.4, 1.6_
  - [ ] 3.2 แก้ `src/layouts/Header.tsx` ให้รองรับ mobile
    - import `useSidebarStore` และ destructure `openMobile`
    - เพิ่ม hamburger button `className="md:hidden p-2 rounded-lg min-h-[44px] min-w-[44px]"` ด้วย `onClick={openMobile}` และ `<Menu size={20} />`
    - เพิ่ม `truncate` และ `max-w-[100px] md:max-w-none` บน breadcrumb text elements เพื่อ truncate บน mobile
    - ห่อ user name/role text ด้วย `<div className="hidden md:block text-right">` เพื่อซ่อนบน mobile
    - ตรวจสอบว่า Bell icon และ UserCircle2 icon ยังแสดงทุก breakpoint
    - _Requirements: 1.2, 1.3, 1.6, 3.1, 3.2, 3.3_
  - [ ] 3.3 แก้ `src/layouts/MainLayout.tsx` เพิ่ม `min-w-0` บน content wrapper
    - เพิ่ม `min-w-0` ใน className ของ `<div>` ที่ครอบ `<Header />` และ `<main>`
    - ลด padding ของ `<main>` เป็น `p-4 md:p-6` สำหรับ mobile
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. แก้ SidebarItem ให้ปิด mobile drawer เมื่อ navigate
  - [ ] 4.1 แก้ `src/components/sidebar/SidebarItem.tsx` ให้เรียก `closeMobile` เมื่อ navigate
    - import `useSidebarStore` และ destructure `closeMobile`
    - เพิ่ม `onClick={closeMobile}` ใน NavLink หรือ handler การ navigate
    - _Requirements: 1.5_

- [ ] 5. Checkpoint — ทดสอบ mobile navigation flow
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. แก้ DataTable ให้รองรับ mobile
  - [ ] 6.1 ห่อ `<table>` ด้วย `overflow-x-auto` container ใน `src/components/table/DataTable.tsx`
    - เพิ่ม `<div className="overflow-x-auto">` ครอบ `<table>` element
    - ตรวจสอบว่า pagination container ใช้ `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 6.2 เพิ่ม `hideOnMobile` column visibility logic ใน `src/components/table/DataTable.tsx`
    - ใน `<th>` element เพิ่ม `cn(..., header.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell")`
    - ใน `<td>` element เพิ่ม `cn(..., cell.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell")`
    - _Requirements: 6.4_
  - [ ]* 6.3 Write property test for hideOnMobile column suppression
    - **Property 2: hideOnMobile Column Suppression**
    - **Validates: Requirements 6.4**
    - ใช้ Vitest + fast-check สร้าง test ใน `src/components/table/DataTable.test.tsx`
    - generate arbitrary column arrays ที่ subset มี `meta.hideOnMobile: true`
    - generate arbitrary row data arrays
    - render `DataTable` จำลอง mobile viewport
    - assert: ไม่มี `<th>` หรือ `<td>` ที่ correspond กับ hidden columns ใน DOM

- [ ] 7. แก้ ProductPage และ InventoryPage ให้ responsive
  - [ ] 7.1 แก้ page header layout ใน `src/features/products/ProductPage.tsx`
    - เปลี่ยน page header container จาก `flex items-start justify-between` เป็น `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`
    - ห่อ action buttons ด้วย `flex flex-wrap items-center gap-2`
    - เปลี่ยน stat cards grid จาก `grid-cols-4` เป็น `grid grid-cols-2 lg:grid-cols-4 gap-4`
    - _Requirements: 5.1, 5.3_
  - [ ] 7.2 แก้ page header layout ใน `src/features/inventory/InventoryPage.tsx`
    - เปลี่ยน page header container เป็น `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`
    - ห่อ action buttons ด้วย `flex flex-wrap items-center gap-2`
    - เปลี่ยน stat cards grid เป็น `grid grid-cols-2 lg:grid-cols-4 gap-4`
    - _Requirements: 5.2, 5.4_

- [ ] 8. แก้ DashboardPage ให้ responsive
  - [ ] 8.1 แก้ stat cards grid ใน `src/features/dashboard/DashboardPage.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 9. Checkpoint — ทดสอบหน้า list และ dashboard
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. แก้ ProductDetail Form Sections ให้ responsive
  - [ ] 10.1 แก้ `src/features/productDetail/component/ProductBasicInfo.tsx`
    - เปลี่ยน grid container จาก `grid-cols-2` เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - เปลี่ยน full-width fields จาก `col-span-2` เป็น `col-span-1 md:col-span-2`
    - _Requirements: 7.1, 7.2_
  - [ ] 10.2 แก้ `src/features/productDetail/component/ProductPricing.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - เปลี่ยน full-width fields เป็น `col-span-1 md:col-span-2` (ถ้ามี)
    - _Requirements: 7.1, 7.2_
  - [ ] 10.3 แก้ `src/features/productDetail/component/ProductPhysical.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - _Requirements: 7.1, 7.2_
  - [ ] 10.4 แก้ `src/features/productDetail/component/ProductInventory.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - _Requirements: 7.1, 7.2_
  - [ ] 10.5 แก้ `src/features/productDetail/component/ProductSupplier.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - _Requirements: 7.1, 7.2_
  - [ ] 10.6 แก้ `src/features/productDetail/component/ProductBarcode.tsx`
    - เปลี่ยน grid container เป็น `grid grid-cols-1 md:grid-cols-2 gap-6`
    - _Requirements: 7.1, 7.2_

- [ ] 11. แก้ ProductHeader และ ProductFooter ให้ responsive
  - [ ] 11.1 แก้ `src/features/productDetail/component/ProductHeader.tsx`
    - เปลี่ยน inner layout container เป็น `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`
    - เพิ่ม `shrink-0` บน icon เพื่อป้องกัน icon ถูก squish บน mobile
    - ปรับ heading ด้วย `text-xl md:text-2xl`
    - _Requirements: 7.3_
  - [ ] 11.2 แก้ `src/features/productDetail/component/ProductFooter.tsx`
    - เปลี่ยน container เป็น `flex flex-col-reverse gap-3 md:flex-row md:justify-end`
    - เพิ่ม `w-full md:w-auto` และ `min-h-[44px]` บนทุก button
    - _Requirements: 7.4, 8.1_

- [ ] 12. Checkpoint — ทดสอบ ProductDetail form บน mobile
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. เพิ่ม property test สำหรับ No Horizontal Overflow
  - [ ]* 13.1 Write property test for no horizontal page overflow on mobile
    - **Property 3: No Horizontal Page Overflow on Mobile**
    - **Validates: Requirements 2.3, 9.1**
    - ใช้ Vitest + fast-check สร้าง test ใน `src/__tests__/responsive.test.tsx`
    - generate viewport widths ในช่วง 320–767 (integer)
    - render แต่ละ page component ที่ความกว้างนั้น
    - assert: `container.scrollWidth <= container.clientWidth`
    - รัน minimum 100 iterations

- [ ] 14. Final Checkpoint — ทดสอบทั้งหมดและ verify touch targets
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks ที่มี `*` เป็น optional สามารถข้ามได้สำหรับ MVP ที่เร็วขึ้น
- แต่ละ task อ้างอิง requirements เฉพาะเพื่อ traceability
- Design ใช้ TypeScript + Tailwind CSS ตลอดทั้ง codebase
- Property tests ใช้ Vitest + fast-check ตามที่กำหนดใน design
- Task 2.1 (ColumnMeta type) ต้องเสร็จก่อน Task 6.2 เพื่อให้ TypeScript ไม่ error
- Task 1.1 (sidebar store) ต้องเสร็จก่อน Task 3.1, 3.2, 4.1 ที่ depend on `mobileOpen` state

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "3.1", "3.2", "3.3"] },
    { "id": 2, "tasks": ["4.1", "6.1", "7.1", "7.2", "8.1", "10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "11.1", "11.2"] },
    { "id": 3, "tasks": ["6.2"] },
    { "id": 4, "tasks": ["6.3", "13.1"] }
  ]
}
```
