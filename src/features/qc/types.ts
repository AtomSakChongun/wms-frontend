import type { ItemQcStatus } from "../inbound/types";

export interface QcItemReview {
  lineNo: number;
  sku: string;
  productName: string;
  barcode: string;
  expectedQty: number;
  receivedQty: number;
  unit: string;
  manufacturerLotNo?: string;
  expiryDate?: string;
  qcStatus: ItemQcStatus;
  qcNote?: string;
}

export interface QcLotReview {
  lotId: string;
  poNumber?: string;
  supplier: string;
  warehouseRef: string;
  receivedDate: string;
  status: "Pending QC" | "Quarantine";
  createdBy: string;
  qcNote?: string;
  items: QcItemReview[];
}

export interface QcCheckResult {
  lotId: string;
  finalStatus: "QC Passed" | "QC Failed";
  approvedBy: string;
  approvalDate: string;
  qcNote: string;
}
