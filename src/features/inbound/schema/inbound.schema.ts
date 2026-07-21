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
  receivingLocation: z.string().min(1, "Location is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  status: lotStatusSchema,
  qcNote: z.string().optional(),
  items: z
    .array(
      z.object({
        // lineNo, unit, and qcStatus aren't part of the backend's item shape —
        // it never returns them on GET, so they must stay optional or editing
        // an existing lot fails validation silently (fields come back undefined)
        lineNo: z.coerce.number().min(1).optional(),
        productId: z.string().optional(),
        sku: z.string().min(1, "SKU is required"),
        name: z.string().min(1, "Product is required"),
        barcode: z.string().optional(),
        expectedQty: z.coerce.number().min(1, "Expected quantity is required"),
        receivedQty: z.coerce.number().min(0, "Received quantity is required"),
        unit: z.string().optional(),
        unitCost: z.coerce.number().min(0, "Unit cost is required"),
        manufacturerLotNo: z.string().optional(),
        expiryDate: z.string().optional(),
        qcStatus: itemQcStatusSchema.optional(),
        qcNote: z.string().optional(),
      }),
    )
    .min(1, "At least one item is required"),
});

export type CreateLotForm = z.infer<typeof createLotSchema>;
