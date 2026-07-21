export interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;
  barcode: string;
  barcodeType?: string;
  cost: number;
  sellingPrice?: number;
  taxRate?: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  leadTime?: number;
  shelfLife?: number;
  status: string;
  unit?: string;
  description?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  supplier?: string;
  supplierSku?: string;
}
