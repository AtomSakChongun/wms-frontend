import { useFormContext } from "react-hook-form";
import { FormNumberInput, SectionTitle } from "@/components/form";

export default function ProductPhysical() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Physical Specifications">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <FormNumberInput
          label="Weight (kg)"
          register={register("weight")}
        />

        <FormNumberInput
          label="Length (cm)"
          register={register("length")}
        />

        <FormNumberInput
          label="Width (cm)"
          register={register("width")}
        />

        <FormNumberInput
          label="Height (cm)"
          register={register("height")}
        />

      </div>
    </SectionTitle>
  );
}
