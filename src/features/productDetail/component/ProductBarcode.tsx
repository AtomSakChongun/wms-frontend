import { useFormContext } from "react-hook-form";
import {
  FormInput,
  FormSelect,
  SectionTitle,
} from "@/components/form";

export default function ProductBarcode() {
  const { register } = useFormContext();

  return (
    <SectionTitle title="Barcode & Identification">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="Barcode Number"
          register={register("barcode")}
          placeholder="e.g. 8901234567890"
        />

        <FormSelect
          label="Barcode Type"
          name="barcodeType"
          options={[
            { label: "EAN-13", value: "EAN13" },
            { label: "CODE128", value: "CODE128" },
            { label: "QR Code", value: "QR" },
          ]}
        />

      </div>

    </SectionTitle>
  );
}
