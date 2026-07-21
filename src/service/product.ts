import apiClient from "@/api/axios";
import type { Product } from "@/features/products/types";
import type { CreateProductDto } from "@/features/productDetail/schema/product.schema";
import type { PageParams, PaginatedResponse } from "@/types/pagination";

export interface ProductQueryParams extends PageParams {
  search?: string;
  category?: string;
  status?: string;
  stockFilter?: string; // "in-stock" | "low-stock" | "out-of-stock"
}

export async function getProducts(
  params?: ProductQueryParams,
): Promise<PaginatedResponse<Product>> {
  const response = await apiClient.get<PaginatedResponse<Product>>("/products", { params });
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const response = await apiClient.post<Product>("/products", dto);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function updateProduct(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
  const response = await apiClient.patch<Product>(`/products/${id}`, dto);
  return response.data;
}
