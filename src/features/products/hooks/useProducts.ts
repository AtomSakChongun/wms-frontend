import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductQueryParams,
} from "@/service/product";
import type { CreateProductDto } from "@/features/productDetail/schema/product.schema";
import type { AppliedFilters } from "@/features/products/ProductFilters";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductQueryParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", id] as const,
};

/** Convert AppliedFilters (UI state) → flat query params for the API */
function toQueryParams(filters: AppliedFilters): ProductQueryParams {
  const params: ProductQueryParams = {};

  if (filters.searchQuery.trim()) {
    params.search = filters.searchQuery.trim();
  }

  // Backend expects a single category / status — send first selected value
  // If you need multi-value support, adjust to match your backend contract
  if (filters.categories.length > 0) {
    params.category = filters.categories.join(",");
  }

  if (filters.statuses.length > 0) {
    params.status = filters.statuses.join(",");
  }

  if (filters.stockFilters.length > 0) {
    params.stockFilter = filters.stockFilters.join(",");
  }

  return params;
}

export function useProducts(
  filters?: AppliedFilters,
  pagination?: { page: number; limit: number },
) {
  const params: ProductQueryParams = filters ? toQueryParams(filters) : {};
  if (pagination) {
    params.page = pagination.page;
    params.limit = pagination.limit;
  }
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateProductDto>) => updateProduct(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
