export interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
  sku: string;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

