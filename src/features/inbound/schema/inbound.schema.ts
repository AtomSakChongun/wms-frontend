import { z } from "zod";

const lotStatusSchema = z.enum([
  "รอส่ง QC",
  "Pending QC",
  "QC Passed",
  "QC Failed",
  "Quarantine",
  "Putaway",
]);

const itemQcStatusSchema = z.enum(["Pending", "Passed", "Failed", "Quarantine"]);

export const createLotSchema = z.object({
  poNumber: z.string().optional(),
  supplier: z.string().min(1, "Supplier is required"),
  warehouseRef: z.string().min(1, "Location is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  status: lotStatusSchema,
  qcNote: z.string().optional(),
  items: z
    .array(
      z.object({
        lineNo: z.coerce.number().min(1),
        sku: z.string().min(1, "SKU is required"),
        productName: z.string().min(1, "Product is required"),
        barcode: z.string().optional(),
        expectedQty: z.coerce.number().min(1, "Expected quantity is required"),
        receivedQty: z.coerce.number().min(0, "Received quantity is required"),
        unit: z.string().min(1),
        unitCost: z.coerce.number().min(0, "Unit cost is required"),
        manufacturerLotNo: z.string().optional(),
        expiryDate: z.string().optional(),
        qcStatus: itemQcStatusSchema,
        qcNote: z.string().optional(),
      }),
    )
    .min(1, "At least one item is required"),
});

export type CreateLotForm = z.infer<typeof createLotSchema>;
