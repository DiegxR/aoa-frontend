export interface ProductItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  stock: number;
  minStock: number;
  unitPrice: number;
  category: string;
  active: boolean;
  image?: string | null;
  createdAt: string;
}
