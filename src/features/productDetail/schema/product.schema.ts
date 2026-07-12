import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
  unit: z.string().min(1),

  barcode: z.string().optional(),
  barcodeType: z.enum(["EAN13", "CODE128", "QR"]),

  unitCost: z.number().min(0),
  sellingPrice: z.number().min(0),
  taxRate: z.number().min(0).max(100),

  weight: z.number().min(0),
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),

  minStock: z.number().min(0),
  maxStock: z.number().min(0),
  reorderPoint: z.number().min(0),
  leadTime: z.number().min(0),
  shelfLife: z.number().min(0),

  supplierId: z.string().optional(),
  supplierSku: z.string().optional(),
});

export type ProductForm = z.infer<typeof productSchema>;
