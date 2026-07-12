import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ProductHeader from "./component/ProductHeader";
import ProductBasicInfo from "./component/ProductBasicInfo";
import ProductBarcode from "./component/ProductBarcode";
import ProductPricing from "./component/ProductPricing";
import ProductPhysical from "./component/ProductPhysical";
import ProductInventory from "./component/ProductInventory";
import ProductSupplier from "./component/ProductSupplier";
import ProductFooter from "./component/ProductFooter";

import {
  productSchema,
  type ProductForm,
} from "./schema/product.schema";

export default function ProductCreatePage() {
  const methods = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    mode: "onChange",

    defaultValues: {
      sku: "",
      productName: "",
      categoryId: "",
      description: "",

      status: "ACTIVE",
      unit: "PCS",

      barcode: "",
      barcodeType: "EAN13",

      unitCost: 0,
      sellingPrice: 0,
      taxRate: 7,

      weight: 0,
      length: 0,
      width: 0,
      height: 0,

      minStock: 0,
      maxStock: 0,
      reorderPoint: 0,
      leadTime: 0,
      shelfLife: 0,

      supplierId: "",
      supplierSku: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ProductForm) => {
    try {
      console.log(data);

      // TODO:
      // await productService.create(data)

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Header */}
        <ProductHeader />

        {/* Product Information */}
        <ProductBasicInfo />

        {/* Barcode */}
        <ProductBarcode />

        {/* Pricing */}
        <ProductPricing />

        {/* Physical */}
        <ProductPhysical />

        {/* Inventory */}
        <ProductInventory />

        {/* Supplier */}
        <ProductSupplier />

        {/* Footer */}
        <ProductFooter
          loading={isSubmitting}
          onCancel={() => reset()}
        />

        {/* หรือใช้แบบนี้แทน ถ้ายังไม่มี ProductFooter */}

        {/*

        <div className="sticky bottom-0 flex justify-end gap-3 rounded-2xl border bg-white p-5 shadow-lg">

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            Reset
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : "Create Product"}
          </Button>

        </div>

        */}
      </form>
    </FormProvider>
  );
}