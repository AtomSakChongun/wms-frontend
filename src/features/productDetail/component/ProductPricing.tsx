import { useFormContext } from "react-hook-form";
import { FormNumberInput, SectionTitle } from "@/components/form";

export default function ProductPricing() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Pricing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <FormNumberInput
            label="Unit Cost (USD)"
            register={register("cost", { valueAsNumber: true })}
            prefix="$"
          />
        </div>

        <div>
          <FormNumberInput
            label="Selling Price (USD)"
            register={register("sellingPrice", { valueAsNumber: true })}
            prefix="$"
          />
          <p className="mt-1 text-xs text-slate-400">Leave 0 if not sold directly</p>
        </div>

        <div>
          <FormNumberInput
            label="Tax Rate (%)"
            register={register("taxRate", { valueAsNumber: true })}
            suffix="%"
          />
          <p className="mt-1 text-xs text-slate-400">Applied to selling price</p>
        </div>

      </div>
    </SectionTitle>
  );
}
