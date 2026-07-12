import { useFormContext } from "react-hook-form";
import { FormInput, SectionTitle } from "@/components/form";

export default function ProductSupplier() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Supplier Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <FormInput
            label="Primary Supplier"
            register={register("supplierId")}
            placeholder="Supplier company name"
          />
        </div>

        <div>
          <FormInput
            label="Supplier SKU"
            register={register("supplierSku")}
            placeholder="Supplier part #"
          />
          <p className="mt-1 text-xs text-slate-400">Supplier part number</p>
        </div>

      </div>
    </SectionTitle>
  );
}
