import { z } from "zod";

const STATUS_OPTIONS = ["In Stock", "Out of Stock", "Discontinued", "Low Stock"] as const;
const BARCODE_TYPES = ["EAN13", "CODE128", "QR"] as const;
const UNIT_OPTIONS = ["PCS", "KG", "BOX"] as const;

export const productSchema = z.object({
  // ── Identity ──────────────────────────────────────────────
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),

  status: z.enum(STATUS_OPTIONS, { required_error: "Status is required" }),
  unit: z.string().min(1, "Unit is required"),

  // ── Barcode ───────────────────────────────────────────────
  barcode: z.string().min(1, "Barcode is required"),
  barcodeType: z.enum(BARCODE_TYPES),

  // ── Pricing ───────────────────────────────────────────────
  cost: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
  sellingPrice: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
  taxRate: z.number().min(0).max(100),

  // ── Physical ──────────────────────────────────────────────
  weight: z.number().positive("Must be > 0"),
  length: z.number().positive("Must be > 0"),
  width: z.number().positive("Must be > 0"),
  height: z.number().positive("Must be > 0"),

  // ── Inventory ─────────────────────────────────────────────
  stock: z.number().int().min(0),
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  leadTime: z.number().int().min(0),
  shelfLife: z.number().int().min(0).nullable(),

  // ── Supplier ──────────────────────────────────────────────
  supplier: z.string().min(1, "Supplier is required"),
  supplierSku: z.string().min(1, "Supplier SKU is required"),
});

export type ProductForm = z.infer<typeof productSchema>;

// Type that maps 1-to-1 with the backend CreateProductDto
export type CreateProductDto = ProductForm;
