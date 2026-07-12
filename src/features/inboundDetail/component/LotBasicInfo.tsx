import { useFormContext } from "react-hook-form";
import { FormInput, FormTextarea, SectionTitle } from "@/components/form";
import type { CreateLotForm } from "../schema/inbound.schema";

export default function LotBasicInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateLotForm>();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <SectionTitle title="Basic Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="PO Number"
          register={register("poNumber")}
          placeholder="PO-2025-001 (optional)"
        />

        <FormInput
          label="Supplier"
          required
          register={register("supplier")}
          placeholder="Supplier company name"
          error={errors.supplier?.message}
        />

        <FormInput
          label="Dock / Receiving Location"
          required
          register={register("warehouseRef")}
          placeholder="e.g. DOCK-A"
          error={errors.warehouseRef?.message}
        />

        <div /> {/* spacer */}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Expected Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("expectedDate")}
            max={today}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.expectedDate && (
            <p className="text-xs text-red-500">{errors.expectedDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Received Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("receivedDate")}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.receivedDate && (
            <p className="text-xs text-red-500">{errors.receivedDate.message}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <FormTextarea
            label="Remarks / Notes"
            register={register("note")}
            placeholder="General notes about this delivery…"
          />
        </div>

      </div>
    </SectionTitle>
  );
}
