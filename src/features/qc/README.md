# QC (Quality Control) Module

หน้า Menu สำหรับ QC เพื่อทำการตรวจสอบสถานะสินค้าของ Lot ที่ได้รับจากการ Inbound

## ⚙️ Features

✅ **QC List Page** (`/qc`)

- แสดงรายการ Lots ที่รอ QC inspection
- Filter ตามผู้ส่ง (Supplier), สถานะ, และสถานที่เก็บ
- แสดง Progress สำหรับแต่ละ Lot (จำนวน items ที่รอ review)
- Click เพื่อเข้าไปทำการตรวจสินค้า

✅ **QC Detail Page** (`/qc/:lotId`)

- แสดงรายละเอียดสินค้า (Items) ในแต่ละ Lot
- **Inline Status Update**: เลือกสถานะ QC สำหรับแต่ละ item
  - `Pending`: รอการตรวจสอบ
  - `Passed`: ผ่านการตรวจสอบ
  - `Failed`: ไม่ผ่านการตรวจสอบ
  - `Quarantine`: เก็บแยก (ต้องตรวจสอบเพิ่มเติม)
- เพิ่ม Note สำหรับแต่ละ item
- **Progress Bar**: แสดงความคืบหน้าการตรวจสอบ
- **Conditional Approval/Rejection**: ปุ่ม Approve/Reject เปิดใช้งานได้เฉพาะเมื่อตรวจสินค้าให้หมดแล้ว
- Confirmation Dialog ก่อน Approve/Reject พร้อมการบันทึก Note

## 📊 QC Status Workflow

```
Pending QC/Quarantine (Inbound)
    ↓
QC Inspection (Detail Page)
    ├─ Review all items individually
    └─ Set status for each item
        ↓
    ├─→ All items reviewed?
    │   ├─→ Yes: Unlock Approve/Reject buttons
    │   └─→ No: Buttons disabled
    ↓
    ├─→ Approve Lot → QC Passed → Move to Putaway
    └─→ Reject Lot → QC Failed → Quarantine for review
```

## 📁 File Structure

```
src/features/qc/
├── QcPage.tsx              # QC List Page
├── QcDetailPage.tsx        # QC Detail Page (Inspection)
├── qcFilters.tsx           # Filter Component
├── columns.tsx             # Table Column Definitions
├── qcMockData.ts           # Mock Data
├── types.ts                # TypeScript Types
├── schema/
│   └── qc.schema.ts        # Zod Validation Schemas
└── index.ts                # Exports
```

## 🔄 Conditional Requirements

✅ **ต้องตรวจให้ Product ให้หมดก่อน**

- ไม่สามารถกดปุ่ม Approve/Reject ได้จนกว่าทุก item มี status ที่ไม่ใช่ "Pending"
- Progress bar แสดงความคืบหน้า: "X / Y items reviewed"
- Buttons จะ disabled (gray out) ถ้ายังมี items ที่รอ review

✅ **สามารถ Approve หรือ Reject ได้**

- `Approve Lot`: Item ส่วนใหญ่ Passed → Status: QC Passed → Move to Putaway
- `Reject Lot`: Item มี Failed/Quarantine → Status: QC Failed → Quarantine สำหรับ review เพิ่มเติม
- ต้องเพิ่ม QC Note ก่อน Approve/Reject

## 🎯 Mock Data

Mock data จาก `qcMockData.ts` แสดง Lots ที่พร้อม QC:

| Lot ID            | Supplier                     | Status     | Items | Note                           |
| ----------------- | ---------------------------- | ---------- | ----- | ------------------------------ |
| INB-2026-0718-001 | Thai Safety Supply Co., Ltd. | Pending QC | 2     | All Pending                    |
| INB-2026-0718-002 | Electro Supply (Thailand)    | Quarantine | 2     | Mixed (1 Passed, 1 Quarantine) |
| INB-2026-0719-006 | PackRight Co., Ltd.          | Pending QC | 2     | All Pending                    |

## 🛣️ Routes

| Route        | Component      | Description            |
| ------------ | -------------- | ---------------------- |
| `/qc`        | `QcPage`       | QC Inspection List     |
| `/qc/:lotId` | `QcDetailPage` | QC Detail & Inspection |

## 🎨 UI Components Used

- `DataTable`: Display lots and items
- `StatusBadge`: Show QC status badges
- `Select`: Dropdown for status selection
- `Input`: Text input for notes
- `Dialog`: Confirmation dialog for approval/rejection
- `StatCard`: Display statistics (Pending, Items to Check, Partially Reviewed)

## 📝 Example Usage

### QC List Page

```typescript
import QcPage from '@/features/qc/QcPage';

// ใน router
{
  path: "/qc",
  element: <QcPage />,
}
```

### Access QC Detail

- Click ที่แถวของ Lot ในตาราง QC List
- หรือ Navigate ไปยัง `/qc/{lotId}` โดยตรง

## 🔮 Future Enhancements

- [ ] API Integration สำหรับบันทึก QC Results
- [ ] Batch QC Inspection (หลาย Lots พร้อมกัน)
- [ ] QC History & Report
- [ ] Photo Upload สำหรับเอกสารการตรวจสอบ
- [ ] Barcode Scanning สำหรับ Item Verification
- [ ] Notifications สำหรับ QC Status Changes
- [ ] Export QC Report to PDF/Excel

## 🔐 Validation

- `QcLotApprovalSchema`: Validates approval request
  - All items must have status != "Pending"
  - QC Note is required
  - Final Status must be either "QC Passed" or "QC Failed"

## ⚡ Performance

- Inline state management สำหรับ item edits
- Map-based lookup สำหรับ quick item edits
- Efficient re-renders เฉพาะ affected items

---

**Created**: 2026-07-18  
**Status**: ✅ Complete and Ready to Use
