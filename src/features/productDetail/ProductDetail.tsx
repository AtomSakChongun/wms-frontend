import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductHeader from "./component/ProductHeader";
import ProductBasicInfo from "./component/ProductBasicInfo";
import ProductBarcode from "./component/ProductBarcode";
import ProductPricing from "./component/ProductPricing";
import ProductPhysical from "./component/ProductPhysical";
import ProductInventory from "./component/ProductInventory";
import ProductSupplier from "./component/ProductSupplier";
import ProductFooter from "./component/ProductFooter";

import { productSchema, type ProductForm } from "./schema/product.schema";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/features/products/hooks/useProducts";

const DEFAULT_VALUES: ProductForm = {
  sku: "",
  name: "",
  category: "",
  description: "",
  status: "In Stock",
  unit: "PCS",
  barcode: "",
  barcodeType: "EAN13",
  cost: 0,
  sellingPrice: 0,
  taxRate: 7,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  stock: 0,
  minStock: 0,
  maxStock: 0,
  reorderPoint: 0,
  leadTime: 0,
  shelfLife: 0,
  supplier: "",
  supplierSku: "",
};

export default function ProductCreatePage() {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();

  const isEdit = Boolean(_id);

  // Fetch existing product when editing
  const { data: product, isLoading: isLoadingProduct } = useProduct(
    isEdit ? _id : undefined
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(_id ?? "");

  const methods = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: product
      ? {
          sku: product.sku,
          name: product.name,
          category: product.category,
          description: product.description ?? "",
          status: product.status as ProductForm["status"],
          unit: product.unit ?? "PCS",
          barcode: product.barcode,
          barcodeType: (product.barcodeType ?? "EAN13") as ProductForm["barcodeType"],
          cost: product.cost,
          sellingPrice: product.sellingPrice ?? 0,
          taxRate: product.taxRate ?? 7,
          weight: product.weight ?? 0,
          length: product.length ?? 0,
          width: product.width ?? 0,
          height: product.height ?? 0,
          stock: product.stock ?? 0,
          minStock: product.minStock ?? 0,
          maxStock: product.maxStock ?? 0,
          reorderPoint: product.reorderPoint ?? 0,
          leadTime: product.leadTime ?? 0,
          shelfLife: product.shelfLife ?? 0,
          supplier: product.supplier ?? "",
          supplierSku: product.supplierSku ?? "",
        }
      : DEFAULT_VALUES,
  });

  const { handleSubmit, reset } = methods;

  // No useEffect needed — form only mounts after product data is ready

  const onSubmit = async (data: ProductForm) => {
    // shelfLife: treat 0 as null (non-perishable) to match DTO
    const dto = { ...data, shelfLife: data.shelfLife === 0 ? null : data.shelfLife };

    try {
      if (isEdit && _id) {
        await updateMutation.mutateAsync(dto);
        toast.success("Product updated successfully");
        navigate(`/products/${_id}`);
      } else {
        const created = await createMutation.mutateAsync(dto);
        toast.success(`Product "${created.name}" created successfully`);
        reset(DEFAULT_VALUES);
        navigate('/products');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(`Failed to ${isEdit ? "update" : "create"} product: ${message}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 text-sm">
        Loading product...
      </div>
    );
  }

  // Don't mount the form until edit data is ready — prevents Select components
  // from initialising with empty values before reset() can populate them.
  if (isEdit && !product) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ProductHeader isEdit={isEdit} sku={product?.sku} />
        <ProductBasicInfo />
        <ProductBarcode />
        <ProductPricing />
        <ProductPhysical />
        <ProductInventory />
        <ProductSupplier />
        <ProductFooter
          loading={isPending}
          isEdit={isEdit}
          onCancel={() =>
            isEdit && _id ? navigate(`/products/${_id}`) : reset(DEFAULT_VALUES)
          }
        />
      </form>
    </FormProvider>
  );
}
