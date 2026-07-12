// ─── QC / Lot status ─────────────────────────────────────────────────────────

export type LotStatus =
  | "Pending QC"
  | "QC Passed"
  | "QC Failed"
  | "Putaway"
  | "Cancelled";

// ─── QC status per item line ──────────────────────────────────────────────────

export type ItemQcStatus =
  | "Pending"     // ยังไม่ตรวจ
  | "Passed"      // ผ่าน QC
  | "Failed"      // ไม่ผ่าน QC
  | "Quarantine"; // แยกกัก รอตัดสินใจ

// ─── Item inside a lot ────────────────────────────────────────────────────────

export interface LotItem {
  lineNo: number;
  sku: string;
  productName: string;
  barcode: string;
  barcodeType: string;
  expectedQty: number;
  receivedQty: number;
  unitCost: number;
  unit: string;
  expiryDate?: string;   // ISO date string, optional
  lotNo?: string;        // manufacturer lot number, optional
  note?: string;
  qcStatus: ItemQcStatus;
  qcNote?: string;       // note from QC officer per item
}

// ─── Inbound Lot ─────────────────────────────────────────────────────────────

export interface InboundLot {
  lotId: string;           // e.g. LOT-2025-001
  poNumber?: string;       // Purchase Order reference
  supplier: string;
  warehouseRef: string;    // receiving dock / location
  receivedDate: string;    // ISO date
  expectedDate: string;    // ISO date
  status: LotStatus;
  qcNote?: string;
  createdBy: string;
  items: LotItem[];
}
