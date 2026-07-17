import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

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
import { products } from "@/features/products/mock";

export default function ProductCreatePage() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const product = products.find((item) => item.sku === sku);
  const isEdit = Boolean(sku && product);

  const defaultValues: ProductForm = product
    ? {
        sku: product.sku,
        productName: product.name,
        categoryId: product.category,
        description: product.description ?? "",
        status: product.status === "Inactive" ? "INACTIVE" : "ACTIVE",
        unit: product.unit ?? "PCS",
        barcode: product.barcode,
        barcodeType: product.barcodeType === "CODE128" ? "CODE128" : product.barcodeType === "QR" ? "QR" : "EAN13",
        unitCost: product.cost,
        sellingPrice: product.sellingPrice ?? 0,
        taxRate: product.taxRate ?? 7,
        weight: product.weight ?? 0,
        length: product.length ?? 0,
        width: product.width ?? 0,
        height: product.height ?? 0,
        minStock: product.minStock ?? 0,
        maxStock: product.maxStock ?? 0,
        reorderPoint: product.reorderPoint ?? 0,
        leadTime: product.leadTime ?? 0,
        shelfLife: product.shelfLife ?? 0,
        supplierId: product.supplier ?? "",
        supplierSku: product.supplierSku ?? "",
      }
    : {
        sku: "", productName: "", categoryId: "", description: "", status: "ACTIVE", unit: "PCS", barcode: "", barcodeType: "EAN13",
        unitCost: 0, sellingPrice: 0, taxRate: 7, weight: 0, length: 0, width: 0, height: 0,
        minStock: 0, maxStock: 0, reorderPoint: 0, leadTime: 0, shelfLife: 0, supplierId: "", supplierSku: "",
      };

  const methods = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    mode: "onChange",

    defaultValues,
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

      if (isEdit && product) navigate(`/products/${product.sku}`);
      else reset();
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
        <ProductHeader isEdit={isEdit} sku={product?.sku} />

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
          isEdit={isEdit}
          onCancel={() => isEdit && product ? navigate(`/products/${product.sku}`) : reset()}
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
