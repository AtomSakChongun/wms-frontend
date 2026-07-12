import { z } from "zod";

export const lotItemSchema = z.object({
  sku: z.string().min(1, "SKU required"),
  productName: z.string().min(1, "Product name required"),
  barcode: z.string().optional(),
  barcodeType: z.enum(["EAN-13", "CODE128", "QR", "NONE"]),
  expectedQty: z.number({ coerce: true }).min(1, "Must be ≥ 1"),
  receivedQty: z.number({ coerce: true }).min(0),
  unitCost: z.number({ coerce: true }).min(0),
  unit: z.string().min(1),
  expiryDate: z.string().optional(),
  lotNo: z.string().optional(),
  note: z.string().optional(),
});

export const createLotSchema = z.object({
  poNumber: z.string().optional(),
  supplier: z.string().min(1, "Supplier is required"),
  warehouseRef: z.string().min(1, "Dock / location is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  note: z.string().optional(),
  items: z.array(lotItemSchema).min(1, "Add at least one item"),
});

export type LotItemForm = z.infer<typeof lotItemSchema>;
export type CreateLotForm = z.infer<typeof createLotSchema>;
