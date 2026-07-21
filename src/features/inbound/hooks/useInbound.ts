import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInbound,
  getInboundById,
  createInbound,
  updateInbound,
  deleteInbound,
  type InboundQueryParams,
} from "@/service/inbound";
import type { CreateLotForm } from "../schema/inbound.schema";
import type { AppliedFilters } from "../types";

export const inboundKeys = {
  all: ["inbound"] as const,
  list: (params: InboundQueryParams) => ["inbound", "list", params] as const,
  detail: (id: string) => ["inbound", id] as const,
};

/** Convert AppliedFilters (UI state) → flat query params for the API */
function toQueryParams(filters: AppliedFilters): InboundQueryParams {
  const params: InboundQueryParams = {};

  if (filters.searchQuery.trim()) {
    params.search = filters.searchQuery.trim();
  }

  if (filters.suppliers.length > 0) {
    params.supplier = filters.suppliers.join(",");
  }

  if (filters.statuses.length > 0) {
    params.status = filters.statuses.join(",");
  }

  if (filters.locations.length > 0) {
    params.location = filters.locations.join(",");
  }

  return params;
}

export function useInbound(
  filters?: AppliedFilters,
  pagination?: { page: number; limit: number },
) {
  const params: InboundQueryParams = filters ? toQueryParams(filters) : {};
  if (pagination) {
    params.page = pagination.page;
    params.limit = pagination.limit;
  }
  return useQuery({
    queryKey: inboundKeys.list(params),
    queryFn: () => getInbound(params),
  });
}


export function useInboundById(id: string | undefined) {
  return useQuery({
    queryKey: inboundKeys.detail(id ?? ""),
    queryFn: () => getInboundById(id!),
    enabled: !!id,
  });
}

export function useCreateInbound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLotForm) => createInbound(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboundKeys.all });
    },
  });
}

export function useUpdateInbound(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateLotForm>) => updateInbound(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboundKeys.all });
      queryClient.invalidateQueries({ queryKey: inboundKeys.detail(id) });
    },
  });
}

export function useDeleteInbound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInbound(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboundKeys.all });
    },
  });
}
