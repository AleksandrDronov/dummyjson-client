import { httpGet } from './httpClient';
import type { ProductsResponse } from '../types/product';

const DEFAULT_LIMIT = 5;

export interface FetchProductsParams {
  searchQuery?: string;
  skip?: number;
  limit?: number;
}

export function fetchProducts({
  searchQuery,
  skip = 0,
  limit = DEFAULT_LIMIT,
}: FetchProductsParams): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (searchQuery && searchQuery.trim().length > 0) {
    params.set('q', searchQuery.trim());
    return httpGet<ProductsResponse>(`/api/products/search?${params.toString()}`);
  }

  return httpGet<ProductsResponse>(`/api/products?${params.toString()}`);
}
