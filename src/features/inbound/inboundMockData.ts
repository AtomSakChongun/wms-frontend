import type { InboundLot } from "./types";

// Mock flow: receive goods into a lot, then hold the lot at QC before putaway.
export const inboundLots: InboundLot[] = [
  {
    lotId: "INB-2026-0718-001", poNumber: "PO-2026-0701", supplier: "Thai Safety Supply Co., Ltd.",
    warehouseRef: "DOCK-A / QC-HOLD-01", receivedDate: "2026-07-18T09:25:00+07:00", expectedDate: "2026-07-18T08:00:00+07:00",
    status: "Pending QC", createdBy: "Nattapong S.",
    items: [
      { lineNo: 1, sku: "ISH-001", productName: "Industrial Safety Helmet Type II", barcode: "8851234567890", expectedQty: 120, receivedQty: 120, unit: "PCS", unitCost: 650, manufacturerLotNo: "SG-2607-H001", qcStatus: "Pending" },
      { lineNo: 2, sku: "MSK-N95-001", productName: "N95 Dust Mask", barcode: "8851234567906", expectedQty: 500, receivedQty: 500, unit: "PCS", unitCost: 58, expiryDate: "2029-06-30", manufacturerLotNo: "N95-0626-A", qcStatus: "Pending" },
    ],
  },
  {
    lotId: "INB-2026-0718-002", poNumber: "PO-2026-0708", supplier: "Electro Supply (Thailand)",
    warehouseRef: "DOCK-B / QC-HOLD-02", receivedDate: "2026-07-18T10:40:00+07:00", expectedDate: "2026-07-18T10:00:00+07:00",
    status: "Quarantine", createdBy: "Kanya P.", qcNote: "รอผู้ขายยืนยันผลทดสอบแรงดันของเครื่องชาร์จ",
    items: [
      { lineNo: 1, sku: "CAB-2.5-001", productName: "Power Cable 2.5 sq.mm", barcode: "8851234567913", expectedQty: 40, receivedQty: 40, unit: "ROLL", unitCost: 820, manufacturerLotNo: "CB-2607-18", qcStatus: "Passed", qcNote: "ตรวจขนาดและฉนวนผ่าน" },
      { lineNo: 2, sku: "CHG-FLT-001", productName: "Forklift Battery Charger", barcode: "8851234567920", expectedQty: 2, receivedQty: 2, unit: "PCS", unitCost: 14500, manufacturerLotNo: "FC-2607-02", qcStatus: "Quarantine", qcNote: "พบค่าแรงดันผิดปกติ 1 เครื่อง" },
    ],
  },
  {
    lotId: "INB-2026-0717-003", poNumber: "PO-2026-0698", supplier: "PackRight Co., Ltd.",
    warehouseRef: "DOCK-C", receivedDate: "2026-07-17T14:10:00+07:00", expectedDate: "2026-07-17T13:00:00+07:00",
    status: "QC Passed", createdBy: "Somchai W.", qcNote: "จำนวนและสภาพสินค้าตรงตาม PO พร้อมโอนเข้า putaway",
    items: [
      { lineNo: 1, sku: "TPE-48-001", productName: "Packing Tape 48mm x 100m", barcode: "8851234567937", expectedQty: 300, receivedQty: 300, unit: "ROLL", unitCost: 42, manufacturerLotNo: "TP-2606-88", qcStatus: "Passed" },
      { lineNo: 2, sku: "BOX-L-001", productName: "Corrugated Box Large", barcode: "8851234567944", expectedQty: 150, receivedQty: 148, unit: "PCS", unitCost: 36, qcStatus: "Passed", qcNote: "รับเข้า 148 ชิ้น; เสียหายระหว่างขนส่ง 2 ชิ้น" },
    ],
  },
  {
    lotId: "INB-2026-0716-004", poNumber: "PO-2026-0692", supplier: "ToolMart International", warehouseRef: "DOCK-A",
    receivedDate: "2026-07-16T11:20:00+07:00", expectedDate: "2026-07-16T09:00:00+07:00", status: "QC Failed", createdBy: "Pimchanok R.",
    qcNote: "ปฏิเสธทั้งล็อตตาม SOP เนื่องจากด้ามค้อนแตกร้าว", items: [
      { lineNo: 1, sku: "HAM-001", productName: "Claw Hammer 16oz", barcode: "8851234567951", expectedQty: 20, receivedQty: 20, unit: "PCS", unitCost: 390, manufacturerLotNo: "HM-2607-15", qcStatus: "Failed", qcNote: "พบด้ามแตกร้าว 3 ชิ้น" },
    ],
  },
  {
    lotId: "INB-2026-0715-005", supplier: "WoodWorks Supply", warehouseRef: "RACK-A-01", receivedDate: "2026-07-15T16:30:00+07:00", expectedDate: "2026-07-15T14:00:00+07:00", status: "Putaway", createdBy: "Nattapong S.", qcNote: "ตรวจผ่านและจัดเก็บเข้าพื้นที่แล้ว", items: [
      { lineNo: 1, sku: "PAL-001", productName: "Wooden Pallet", barcode: "8851234567968", expectedQty: 80, receivedQty: 80, unit: "PCS", unitCost: 720, manufacturerLotNo: "WP-2607-05", qcStatus: "Passed" },
    ],
  },
  {
    lotId: "INB-2026-0715-006", poNumber: "PO-2026-0687", supplier: "FreshClean Chemicals", warehouseRef: "DOCK-B / QC-HOLD-03", receivedDate: "2026-07-15T09:05:00+07:00", expectedDate: "2026-07-15T09:00:00+07:00", status: "Pending QC", createdBy: "Kanya P.", items: [
      { lineNo: 1, sku: "CLN-5L-001", productName: "Industrial Cleaner 5L", barcode: "8851234567975", expectedQty: 60, receivedQty: 60, unit: "CAN", unitCost: 285, expiryDate: "2028-06-30", manufacturerLotNo: "FC-2606-112", qcStatus: "Pending" },
    ],
  },
];
