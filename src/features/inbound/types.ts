export type LotStatus = "รอส่ง QC" | "Pending QC" | "QC Passed" | "QC Failed" | "Putaway" | "Quarantine";

export type ItemQcStatus = "Pending" | "Passed" | "Failed" | "Quarantine";

export interface LotItem {
  lineNo: number;
  sku: string;
  productName: string;
  barcode: string;
  expectedQty: number;
  receivedQty: number;
  unit: string;
  unitCost: number;
  manufacturerLotNo?: string;
  expiryDate?: string;
  qcStatus: ItemQcStatus;
  qcNote?: string;
}

export interface InboundLot {
  lotId: string;
  poNumber?: string;
  supplier: string;
  warehouseRef: string;
  receivedDate: string;
  expectedDate: string;
  status: LotStatus;
  createdBy: string;
  qcNote?: string;
  items: LotItem[];
}
