# Requirements Document

## Introduction

ฟีเจอร์นี้ทำให้แอปพลิเคชัน WMS Frontend (Warehouse Management System) รองรับการแสดงผลบนหน้าจอมือถือ (Mobile Responsive Design) ครอบคลุมทุกหน้าหลักของระบบ ได้แก่ MainLayout (Sidebar + Header), DashboardPage, ProductPage, InventoryPage และ ProductDetail Form

ปัจจุบัน Layout หลักใช้ Sidebar แบบ fixed width ที่ไม่ยุบตัวบนมือถือ ตารางข้อมูล (DataTable) มี fixed columns ที่ล้นหน้าจอ และ Form grid ใช้ `grid-cols-2` ตายตัวโดยไม่มี responsive breakpoint ทำให้ UX บน viewport ขนาดเล็กใช้งานได้ลำบาก

เป้าหมายคือให้ผู้ใช้สามารถดูและใช้งาน WMS ได้อย่างราบรื่นทั้งบน desktop, tablet และ smartphone โดยไม่ต้อง scroll แนวนอน และยังคง UX ที่ดีบน desktop ไว้เหมือนเดิม

---

## Glossary

- **App**: แอปพลิเคชัน WMS Frontend ที่สร้างด้วย React + TypeScript + Tailwind CSS
- **MainLayout**: Layout หลักที่ประกอบด้วย Sidebar และ Header ครอบ `<Outlet />`
- **Sidebar**: แถบ navigation ด้านซ้ายที่มี menu items และ toggle collapse บน desktop
- **Header**: แถบด้านบนที่มี breadcrumb และ user info
- **Mobile_Drawer**: Sidebar ที่แสดงผลแบบ overlay drawer บนหน้าจอมือถือ ซ่อนอยู่ด้านนอก viewport เมื่อปิด
- **Overlay**: พื้นที่มืดกึ่งโปร่งใสที่คลุมเนื้อหาหลักเมื่อ Mobile_Drawer เปิดอยู่
- **DataTable**: Component ตารางข้อมูลที่ใช้ใน ProductPage และ InventoryPage
- **ProductPage**: หน้าแสดงรายการสินค้าพร้อม filter และ DataTable
- **InventoryPage**: หน้าแสดงรายการ inventory พร้อม filter และ DataTable
- **ProductDetail**: Form สำหรับดู/แก้ไขรายละเอียดสินค้า ประกอบด้วยหลาย section
- **DashboardPage**: หน้าหลักแสดง stat cards และ overview
- **Breakpoint_Mobile**: viewport width < 768px (Tailwind `md` breakpoint)
- **Breakpoint_Tablet**: viewport width >= 768px และ < 1024px (Tailwind `lg` breakpoint)
- **Breakpoint_Desktop**: viewport width >= 1024px
- **StatCard**: Card component แสดง metric เดี่ยว (value + label)
- **FilterPanel**: Component ที่รวม filter controls สำหรับ ProductPage และ InventoryPage
- **useSidebarStore**: Zustand store สำหรับจัดการ state ของ Sidebar

---

## Requirements

### Requirement 1: Mobile Navigation — Drawer Sidebar

**User Story:** As a warehouse staff member using a smartphone, I want to open and close the navigation menu through a hamburger button, so that the navigation does not permanently occupy screen space on small devices.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE App SHALL hide the Sidebar from the normal document flow and render it as a Mobile_Drawer that slides in from the left edge.
2. WHEN the viewport is at Breakpoint_Mobile, THE Header SHALL display a hamburger menu button (☰) on the left side.
3. WHEN the user taps the hamburger button while the Mobile_Drawer is closed, THE App SHALL open the Mobile_Drawer and display the Overlay behind it.
4. WHEN the user taps the Overlay while the Mobile_Drawer is open, THE App SHALL close the Mobile_Drawer and hide the Overlay.
5. WHEN the user selects a navigation item inside the Mobile_Drawer, THE App SHALL close the Mobile_Drawer automatically.
6. WHEN the viewport is at Breakpoint_Tablet or Breakpoint_Desktop, THE App SHALL display the Sidebar in its normal fixed position and SHALL NOT display the hamburger button.
7. THE useSidebarStore SHALL expose a `mobileOpen` boolean state and `openMobile` / `closeMobile` actions to manage Mobile_Drawer visibility independently from the desktop `collapsed` state.

---

### Requirement 2: Responsive MainLayout

**User Story:** As a user on any device, I want the main content area to always fill the remaining screen width correctly, so that there is no horizontal overflow or wasted space.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE MainLayout SHALL render with zero Sidebar width offset so the main content occupies 100% of the viewport width.
2. WHEN the viewport is at Breakpoint_Desktop, THE MainLayout SHALL render with the Sidebar occupying its configured width (collapsed: 80px, expanded: 288px) and the main content filling the remaining space.
3. THE MainLayout SHALL NOT produce a horizontal scrollbar at any Breakpoint_Mobile viewport width between 320px and 767px.

---

### Requirement 3: Responsive Header

**User Story:** As a user on a smartphone, I want the header to display essential information without overflowing, so that I can see breadcrumbs and user controls clearly.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE Header SHALL limit the breadcrumb text length and truncate overflow with an ellipsis if the text exceeds the available space.
2. WHEN the viewport is at Breakpoint_Mobile, THE Header SHALL hide the user name and role text labels, showing only the UserCircle2 icon to save horizontal space.
3. THE Header SHALL maintain the Bell notification icon and UserCircle2 icon visible at all breakpoints.

---

### Requirement 4: Responsive DashboardPage

**User Story:** As a warehouse manager using a smartphone, I want to see the dashboard stat cards in a readable layout, so that I can quickly view key metrics without scrolling sideways.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE DashboardPage SHALL display StatCards in a single-column grid (1 card per row).
2. WHEN the viewport is at Breakpoint_Tablet, THE DashboardPage SHALL display StatCards in a two-column grid (2 cards per row).
3. WHEN the viewport is at Breakpoint_Desktop, THE DashboardPage SHALL display StatCards in a four-column grid (4 cards per row).

---

### Requirement 5: Responsive ProductPage and InventoryPage

**User Story:** As a warehouse operator using a smartphone, I want to browse and filter product/inventory lists on my phone, so that I can look up product information without needing a desktop.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE ProductPage SHALL display the page title and action buttons (Export, Import, Add Product) in a stacked vertical layout instead of a single row.
2. WHEN the viewport is at Breakpoint_Mobile, THE InventoryPage SHALL display the page title and action buttons in a stacked vertical layout instead of a single row.
3. WHEN the viewport is at Breakpoint_Mobile, THE ProductPage SHALL display StatCards in a two-column grid (2 cards per row).
4. WHEN the viewport is at Breakpoint_Mobile, THE InventoryPage SHALL display StatCards in a two-column grid (2 cards per row).
5. WHEN the viewport is at Breakpoint_Mobile, THE FilterPanel SHALL stack all filter controls (Search, Category, Status, Stock Level) vertically in a single column.
6. WHEN the viewport is at Breakpoint_Desktop, THE FilterPanel SHALL display all filter controls in a four-column grid layout.

---

### Requirement 6: Responsive DataTable

**User Story:** As a warehouse operator using a smartphone, I want to view data tables without horizontal scroll consuming the entire screen, so that I can read row data easily.

#### Acceptance Criteria

1. THE DataTable SHALL wrap its table element in a horizontally scrollable container so that table content does not overflow the viewport on Breakpoint_Mobile.
2. WHEN the viewport is at Breakpoint_Mobile, THE DataTable pagination controls SHALL stack vertically (rows-per-page selector on top, page info in middle, navigation buttons at bottom).
3. WHEN the viewport is at Breakpoint_Desktop, THE DataTable pagination controls SHALL display in a single horizontal row.
4. WHEN a DataTable column definition specifies `meta.hideOnMobile: true`, THE DataTable SHALL hide that column when the viewport is at Breakpoint_Mobile.

---

### Requirement 7: Responsive ProductDetail Form

**User Story:** As a warehouse staff member editing a product on a smartphone, I want the product form to display in a single-column layout, so that each field is wide enough to read and fill in comfortably.

#### Acceptance Criteria

1. WHEN the viewport is at Breakpoint_Mobile, THE ProductDetail form sections SHALL render each field in a single-column layout (full width per row).
2. WHEN the viewport is at Breakpoint_Desktop, THE ProductDetail form sections SHALL render fields in a two-column grid layout as currently designed.
3. WHEN the viewport is at Breakpoint_Mobile, THE ProductDetail page header (ProductHeader component) SHALL stack the title area and action buttons vertically.
4. WHEN the viewport is at Breakpoint_Mobile, THE ProductDetail footer (ProductFooter component) SHALL display action buttons stacked vertically and full-width.

---

### Requirement 8: Touch Interaction Minimum Target Size

**User Story:** As a user on a touchscreen device, I want all interactive elements to be large enough to tap accurately, so that I do not accidentally tap the wrong button.

#### Acceptance Criteria

1. THE App SHALL ensure all interactive elements (buttons, links, select triggers) have a minimum touch target height of 44px on Breakpoint_Mobile viewports.
2. THE App SHALL ensure all form input fields (text inputs, selects, textareas) have a minimum height of 44px on Breakpoint_Mobile viewports.

---

### Requirement 9: No Horizontal Overflow on Any Page

**User Story:** As a user on any mobile device, I want every page to fit within the screen width, so that I never need to scroll horizontally to see content.

#### Acceptance Criteria

1. THE App SHALL render all pages (DashboardPage, ProductPage, InventoryPage, ProductDetail) without producing a horizontal scrollbar at viewport widths of 320px, 375px, and 414px.
2. IF a content element would exceed the viewport width on Breakpoint_Mobile, THEN THE App SHALL either wrap, truncate, or scroll that element within a bounded container so the page-level horizontal scroll is prevented.
