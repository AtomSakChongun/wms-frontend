import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductBySku } from "@/service/product";

export const productKeys = {
  all: ["products"] as const,
  detail: (sku: string) => ["products", sku] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  });
}

export function useProduct(sku: string) {
  return useQuery({
    queryKey: productKeys.detail(sku),
    queryFn: () => getProductBySku(sku),
    enabled: !!sku,
  });
}
