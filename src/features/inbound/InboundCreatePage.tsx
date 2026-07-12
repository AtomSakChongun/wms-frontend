import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Pencil } from "lucide-react";
import { FormInput, FormSelect, FormTextarea } from "@/components/form";
import FormNumberInput from "@/components/form/FormNumberInput";
import SectionTitle from "@/components/form/SectionTitle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import InboundHeader from "./InboundHeader";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const lotItemSchema = z.object({
  sku: z.string().min(1, "SKU required"),
  productName: z.string().min(1, "Product name required"),
  barcode: z.string().optional(),
  barcodeType: z.enum(["EAN-13", "CODE128", "QR", "NONE"]),
  expectedQty: z.number().min(1, "Must be ≥ 1"),
  receivedQty: z.number().min(0),
  unitCost: z.number().min(0),
  unit: z.string().min(1),
  expiryDate: z.string().optional(),
  lotNo: z.string().optional(),
  note: z.string().optional(),
});

const createLotSchema = z.object({
  poNumber: z.string().optional(),
  supplier: z.string().min(1, "Supplier is required"),
  warehouseRef: z.string().min(1, "Dock / location is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  note: z.string().optional(),
  items: z.array(lotItemSchema).min(1, "Add at least one item"),
});

type LotItemForm = z.infer<typeof lotItemSchema>;
type CreateLotForm = z.infer<typeof createLotSchema>;

const emptyItem = (): LotItemForm => ({
  sku: "",
  productName: "",
  barcode: "",
  barcodeType: "EAN-13",
  expectedQty: 1,
  receivedQty: 0,
  unitCost: 0,
  unit: "PCS",
  expiryDate: "",
  lotNo: "",
  note: "",
});

// ─── Column factory (needs edit/remove callbacks) ─────────────────────────────

function createItemColumns(
  onEdit: (index: number) => void,
  onRemove: (index: number) => void
): ColumnDef<LotItemForm & { _index: number }>[] {
  return [
    {
      id: "lineNo",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-400 text-xs">{row.original._index + 1}</span>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.original.sku || "—"}
        </span>
      ),
    },
    {
      accessorKey: "productName",
      header: "PRODUCT NAME",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 max-w-[160px] truncate block">
          {row.original.productName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "barcode",
      header: "BARCODE",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">{row.original.barcode || "—"}</span>
      ),
      meta: { hideOnMobile: true },
    },
    {
      id: "qty",
      header: "EXP / RCV",
      cell: ({ row }) => {
        const { expectedQty, receivedQty, unit } = row.original;
        return (
          <span className={`text-xs font-semibold ${expectedQty === receivedQty ? "text-emerald-600" : "text-orange-500"}`}>
            {expectedQty} / {receivedQty} {unit}
          </span>
        );
      },
    },
    {
      accessorKey: "unitCost",
      header: "UNIT COST",
      cell: ({ row }) => `$${Number(row.original.unitCost ?? 0).toFixed(2)}`,
      meta: { hideOnMobile: true },
    },
    {
      accessorKey: "expiryDate",
      header: "EXPIRY",
      cell: ({ row }) =>
        row.original.expiryDate ? (
          new Date(row.original.expiryDate).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })
        ) : (
          <span className="text-slate-300">—</span>
        ),
      meta: { hideOnMobile: true },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(row.original._index)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit item"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(row.original._index)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Remove item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Add / Edit Item Dialog ───────────────────────────────────────────────────

interface ItemDialogProps {
  open: boolean;
  editIndex: number | null;
  defaultValues: LotItemForm;
  onClose: () => void;
  onConfirm: (data: LotItemForm) => void;
}

function ItemDialog({ open, editIndex, defaultValues, onClose, onConfirm }: ItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LotItemForm>({
    resolver: zodResolver(lotItemSchema),
    defaultValues,
  });

  // Reset when dialog opens
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) reset(defaultValues);
  }

  const onSubmit = (data: LotItemForm) => {
    onConfirm(data);
    onClose();
  };

  // FormSelect reads from FormProvider context — provide one for the dialog form
  const dialogMethods = useForm<LotItemForm>({
    resolver: zodResolver(lotItemSchema),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editIndex !== null ? `Edit Item #${editIndex + 1}` : "Add Item to Lot"}
          </DialogTitle>
        </DialogHeader>

        {/* Use a single FormProvider that wraps the form */}
        <FormProvider {...{ ...dialogMethods, register, handleSubmit, reset, control, formState: dialogMethods.formState }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

            {/* ── Barcode & Identification ── */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Barcode & Identification
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="SKU"
                  required
                  register={register("sku")}
                  placeholder="e.g. ISH-001"
                  error={errors.sku?.message}
                />
                <FormInput
                  label="Product Name"
                  required
                  register={register("productName")}
                  placeholder="Full product name"
                  error={errors.productName?.message}
                />
                <FormInput
                  label="Barcode"
                  register={register("barcode")}
                  placeholder="e.g. 8901234567890"
                />
                <FormSelect
                  label="Barcode Type"
                  name="barcodeType"
                  options={[
                    { label: "EAN-13", value: "EAN-13" },
                    { label: "CODE128", value: "CODE128" },
                    { label: "QR Code", value: "QR" },
                    { label: "None", value: "NONE" },
                  ]}
                />
              </div>
            </div>

            {/* ── Quantity & Pricing ── */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Quantity & Pricing
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormNumberInput label="Expected Qty" register={register("expectedQty")} />
                <FormNumberInput label="Received Qty" register={register("receivedQty")} />
                <FormNumberInput label="Unit Cost" register={register("unitCost")} prefix="$" />
                <FormSelect
                  label="Unit"
                  name="unit"
                  options={[
                    { label: "PCS", value: "PCS" },
                    { label: "ROLL", value: "ROLL" },
                    { label: "BOX", value: "BOX" },
                    { label: "KG", value: "KG" },
                    { label: "PAIR", value: "PAIR" },
                    { label: "CAN", value: "CAN" },
                  ]}
                />
              </div>
            </div>

            {/* ── Lot Tracking ── */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Lot Tracking (Optional)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput
                  label="Manufacturer Lot No."
                  register={register("lotNo")}
                  placeholder="Mfr. batch number"
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    {...register("expiryDate")}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <FormInput
                  label="QC Note"
                  register={register("note")}
                  placeholder="e.g. damaged, short-shipped…"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {editIndex !== null ? "Save Changes" : "Add Item"}
              </button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InboundCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [dialogDefaults, setDialogDefaults] = useState<LotItemForm>(emptyItem());

  const methods = useForm<CreateLotForm>({
    resolver: zodResolver(createLotSchema),
    defaultValues: {
      poNumber: "",
      supplier: "",
      warehouseRef: "",
      expectedDate: "",
      receivedDate: new Date().toISOString().slice(0, 10),
      note: "",
      items: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, watch } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const openAddDialog = () => {
    setEditIndex(null);
    setDialogDefaults(emptyItem());
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setEditIndex(index);
    setDialogDefaults({ ...fields[index] } as LotItemForm);
    setDialogOpen(true);
  };

  const handleDialogConfirm = (data: LotItemForm) => {
    if (editIndex !== null) {
      update(editIndex, data);
    } else {
      append(data);
    }
  };

  const onSubmit = async (data: CreateLotForm) => {
    setSubmitting(true);
    try {
      console.log("New lot:", data);
      navigate("/inbound");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const watchedItems = watch("items");

  // Prepare data for DataTable — add _index for callbacks
  const tableData = (watchedItems ?? []).map((item, i) => ({ ...item, _index: i }));
  const itemColumns = createItemColumns(openEditDialog, remove);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Page header ── */}
        <InboundHeader />

        {/* ── Basic Information ── */}
        <SectionTitle title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="PO Number" register={register("poNumber")} placeholder="PO-2025-001 (optional)" />
            <FormInput label="Supplier" required register={register("supplier")} placeholder="Supplier name" error={errors.supplier?.message} />
            <FormInput label="Dock / Receiving Location" required register={register("warehouseRef")} placeholder="e.g. DOCK-A" error={errors.warehouseRef?.message} />
            <div />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Expected Date <span className="text-red-500">*</span></label>
              <input type="date" {...register("expectedDate")} max={today} className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              {errors.expectedDate && <p className="text-xs text-red-500">{errors.expectedDate.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Received Date <span className="text-red-500">*</span></label>
              <input type="date" {...register("receivedDate")} className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              {errors.receivedDate && <p className="text-xs text-red-500">{errors.receivedDate.message}</p>}
            </div>
            <div className="col-span-1 md:col-span-2">
              <FormTextarea label="Remarks / Notes" register={register("note")} placeholder="General notes about this delivery…" />
            </div>
          </div>
        </SectionTitle>

        {/* ── Lot Items ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Lot Items</h2>
              <div className="h-px flex-1 bg-slate-200" />
              {fields.length > 0 && (
                <span className="text-xs text-slate-400 shrink-0">{fields.length} item{fields.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <button
              type="button"
              onClick={openAddDialog}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus size={13} />
              Add Item
            </button>
          </div>

          {errors.items && !Array.isArray(errors.items) && (
            <p className="mb-4 text-xs text-red-500">{(errors.items as { message?: string }).message}</p>
          )}

          {fields.length === 0 ? (
            <button
              type="button"
              onClick={openAddDialog}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 py-10 flex flex-col items-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Plus size={24} />
              <span className="text-sm font-semibold">Add your first item</span>
              <span className="text-xs">Click to open item form</span>
            </button>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden sm:table-cell">Barcode</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Exp / Rcv</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden md:table-cell">Unit Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden lg:table-cell">Expiry</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const item = watchedItems?.[index];
                      return (
                        <tr key={field.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-slate-400">{index + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-slate-700">{item?.sku || "—"}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 max-w-[160px] truncate">{item?.productName || "—"}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell font-mono">{item?.barcode || "—"}</td>
                          <td className="px-4 py-3 text-xs font-semibold">
                            <span className={item?.expectedQty === item?.receivedQty ? "text-emerald-600" : "text-orange-500"}>
                              {item?.expectedQty ?? 0} / {item?.receivedQty ?? 0} {item?.unit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell">
                            ${Number(item?.unitCost ?? 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
                            {item?.expiryDate
                              ? new Date(item.expiryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditDialog(index)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="Edit item"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={openAddDialog}
                className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + Add another item
              </button>
            </>
          )}
        </section>

        {/* ── QC Status notice ── */}
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-start gap-3">
          <span className="mt-0.5 text-yellow-500 text-lg">⏳</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Status will be set to <span className="font-bold">Pending QC</span></p>
            <p className="mt-0.5 text-xs text-yellow-700">After saving, this lot will be queued for QC inspection.</p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 md:flex-row md:justify-end rounded-2xl border bg-white p-5 shadow-lg">
          <button
            type="button"
            onClick={() => navigate("/inbound")}
            className="inline-flex justify-center items-center gap-2 px-5 py-2.5 min-h-[44px] w-full md:w-auto border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center items-center gap-2 px-5 py-2.5 min-h-[44px] w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
          >
            {submitting ? "Saving…" : "✓ Create Lot (Pending QC)"}
          </button>
        </div>
      </form>

      {/* ── Add / Edit Item Dialog ── */}
      <ItemDialog
        open={dialogOpen}
        editIndex={editIndex}
        defaultValues={dialogDefaults}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDialogConfirm}
      />
    </FormProvider>
  );
}
