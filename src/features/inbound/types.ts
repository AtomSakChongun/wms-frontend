export type LotStatus = "รอส่ง QC" | "Pending QC" | "QC Passed" | "QC Failed" | "Putaway" | "Quarantine";

export type ItemQcStatus = "Pending" | "Passed" | "Failed" | "Quarantine";

export interface LotItem {
  // lineNo, unit, and qcStatus aren't returned by the backend — display-only
  // fallbacks are needed wherever these are read
  lineNo?: number;
  productId?: string;
  sku: string;
  name: string;
  barcode?: string;
  expectedQty: number;
  receivedQty: number;
  unit?: string;
  unitCost: number;
  manufacturerLotNo?: string;
  expiryDate?: string;
  qcStatus?: ItemQcStatus;
  qcNote?: string;
}

export interface InboundLot {
  _id: string;
  lotId: string;
  poNumber?: string;
  supplier: string;
  receivingLocation: string;
  receivedDate: string;
  expectedDate: string;
  status: LotStatus;
  createdBy: string;
  qcNote?: string;
  items: LotItem[];
}

export interface AppliedFilters {
  searchQuery: string;
  suppliers: string[];
  statuses: string[];
  locations: string[];
}
export interface InboundFiltersProps {
  appliedFilters: AppliedFilters;
  onApplyFilters: (filters: AppliedFilters) => void;
  suppliersList: string[];
  statusesList: string[];
  locationsList: string[];
}