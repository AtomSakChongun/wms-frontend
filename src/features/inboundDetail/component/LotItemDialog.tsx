import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormSelect } from "@/components/form";
import FormNumberInput from "@/components/form/FormNumberInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { lotItemSchema, type LotItemForm } from "../schema/inbound.schema";

interface Props {
  open: boolean;
  editIndex: number | null;
  defaultValues: LotItemForm;
  onClose: () => void;
  onConfirm: (data: LotItemForm) => void;
}

export default function LotItemDialog({
  open,
  editIndex,
  defaultValues,
  onClose,
  onConfirm,
}: Props) {
  const methods = useForm<LotItemForm>({
    resolver: zodResolver(lotItemSchema) as any,
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Reset form when dialog opens with new defaults
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) reset(defaultValues);
  }

  const onSubmit = (data: LotItemForm) => {
    onConfirm(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>
            {editIndex !== null ? `Edit Item #${editIndex + 1}` : "Add Item to Lot"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5 pt-1">

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
                <FormNumberInput
                  label="Expected Qty"
                  register={register("expectedQty", { valueAsNumber: true })}
                />
                <FormNumberInput
                  label="Received Qty"
                  register={register("receivedQty", { valueAsNumber: true })}
                />
                <FormNumberInput
                  label="Unit Cost"
                  register={register("unitCost", { valueAsNumber: true })}
                  prefix="$"
                />
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
                  <label className="text-sm font-semibold text-slate-700">
                    Expiry Date
                  </label>
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
