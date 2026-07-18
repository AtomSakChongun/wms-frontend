import * as z from "zod";

export const QcItemSchema = z.object({
  lineNo: z.number(),
  qcStatus: z.enum(["Pending", "Passed", "Failed", "Quarantine"]),
  qcNote: z.string().optional(),
});

export const QcLotApprovalSchema = z.object({
  lotId: z.string().min(1, "Lot ID required"),
  finalStatus: z.enum(["QC Passed", "QC Failed"]),
  qcNote: z.string().min(1, "QC note is required"),
  items: z.array(QcItemSchema).min(1, "At least one item required"),
});

export type QcItemFormData = z.infer<typeof QcItemSchema>;
export type QcLotApprovalFormData = z.infer<typeof QcLotApprovalSchema>;
