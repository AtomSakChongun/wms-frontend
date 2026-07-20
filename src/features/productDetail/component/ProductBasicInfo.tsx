import { useFormContext } from "react-hook-form";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  SectionTitle,
} from "@/components/form";

export default function ProductBasicInfo() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Product Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="SKU"
          required
          register={register("sku")}
          placeholder="SKU001"
        />

        <FormSelect
          label="Status"
          name="status"
          options={[
            { label: "In Stock", value: "In Stock" },
            { label: "Low Stock", value: "Low Stock" },
            { label: "Out of Stock", value: "Out of Stock" },
            { label: "Discontinued", value: "Discontinued" },
          ]}
        />

        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="Product Name"
            required
            register={register("name")}
          />
        </div>

        <FormSelect
          label="Category"
          name="category"
          placeholder="— Select category —"
          options={[
            { label: "PPE", value: "PPE" },
            { label: "Electrical", value: "Electrical" },
            { label: "Tools", value: "Tools" },
          ]}
        />

        <FormSelect
          label="Unit of Measure"
          name="unit"
          options={[
            { label: "PCS", value: "PCS" },
            { label: "KG", value: "KG" },
            { label: "BOX", value: "BOX" },
          ]}
        />

        <div className="col-span-1 md:col-span-2">
          <FormTextarea
            label="Description"
            register={register("description")}
            placeholder="Specifications, standards, notes, variants..."
          />
        </div>

      </div>
    </SectionTitle>
  );
}
