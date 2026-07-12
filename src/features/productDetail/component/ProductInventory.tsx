import { useFormContext } from "react-hook-form";
import { FormNumberInput, SectionTitle } from "@/components/form";

export default function ProductInventory() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Inventory Rules">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <FormNumberInput
            label="Min Stock Level"
            register={register("minStock")}
          />
          <p className="mt-1 text-xs text-slate-400">Alert below this</p>
        </div>

        <div>
          <FormNumberInput
            label="Max Stock Level"
            register={register("maxStock")}
          />
          <p className="mt-1 text-xs text-slate-400">Upper target</p>
        </div>

        <div>
          <FormNumberInput
            label="Reorder Point"
            register={register("reorderPoint")}
          />
          <p className="mt-1 text-xs text-slate-400">Trigger auto-reorder</p>
        </div>

        <div>
          <FormNumberInput
            label="Lead Time (days)"
            register={register("leadTime")}
          />
          <p className="mt-1 text-xs text-slate-400">Avg. supplier delivery time</p>
        </div>

        <div>
          <FormNumberInput
            label="Shelf Life (days)"
            register={register("shelfLife")}
          />
          <p className="mt-1 text-xs text-slate-400">Leave blank if not perishable</p>
        </div>

      </div>
    </SectionTitle>
  );
}
