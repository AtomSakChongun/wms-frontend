import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { CreateLotForm, LotItemForm } from "../schema/inbound.schema";
import LotItemDialog from "./LotItemDialog";

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

export default function LotItemsTable() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateLotForm>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [dialogDefaults, setDialogDefaults] = useState<LotItemForm>(emptyItem());

  const watchedItems = watch("items");

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

  const handleConfirm = (data: LotItemForm) => {
    if (editIndex !== null) {
      update(editIndex, data);
    } else {
      append(data);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Lot Items
            </h2>
            <div className="h-px flex-1 bg-slate-200" />
            {fields.length > 0 && (
              <span className="text-xs text-slate-400 shrink-0">
                {fields.length} item{fields.length !== 1 ? "s" : ""}
              </span>
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

        {/* Validation error */}
        {errors.items && !Array.isArray(errors.items) && (
          <p className="mb-4 text-xs text-red-500">
            {(errors.items as { message?: string }).message}
          </p>
        )}

        {/* Empty state */}
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
                      <tr
                        key={field.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-slate-400">{index + 1}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-slate-700">
                            {item?.sku || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700 max-w-[160px] truncate">
                          {item?.productName || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell font-mono">
                          {item?.barcode || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold">
                          <span
                            className={
                              item?.expectedQty === item?.receivedQty
                                ? "text-emerald-600"
                                : "text-orange-500"
                            }
                          >
                            {item?.expectedQty ?? 0} / {item?.receivedQty ?? 0} {item?.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell">
                          ${Number(item?.unitCost ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
                          {item?.expiryDate ? (
                            new Date(item.expiryDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
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

      {/* Dialog is rendered outside the section but inside FormProvider */}
      <LotItemDialog
        open={dialogOpen}
        editIndex={editIndex}
        defaultValues={dialogDefaults}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
