import { useFormContext } from "react-hook-form";
import { FormNumberInput, SectionTitle } from "@/components/form";

export default function ProductPhysical() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Physical Specifications">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <FormNumberInput
          label="Weight (kg)"
          register={register("weight", { valueAsNumber: true })}
        />

        <FormNumberInput
          label="Length (cm)"
          register={register("length", { valueAsNumber: true })}
        />

        <FormNumberInput
          label="Width (cm)"
          register={register("width", { valueAsNumber: true })}
        />

        <FormNumberInput
          label="Height (cm)"
          register={register("height", { valueAsNumber: true })}
        />

      </div>
    </SectionTitle>
  );
}
