"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProductItem } from "@/lib/reducers/productsReducer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createProduct as createProductAction,
  fetchProducts,
  updateProduct as updateProductAction,
} from "@/lib/features/productsSlice";

interface ProductFormValues {
  name: string;
  code: string;
  description: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  category: string;
  image?: string;
}

interface ProductsContextValue {
  products: ProductItem[];
  editingProduct: ProductItem | null;
  isLoading: boolean;
  createProduct: (values: ProductFormValues) => Promise<void>;
  updateProduct: (id: string, values: ProductFormValues) => Promise<void>;
  deactivateProduct: (id: string) => Promise<void>;
  startEditingProduct: (product: ProductItem) => void;
  cancelEditingProduct: () => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const isLoading = useAppSelector((state) => state.products.isLoading);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const contextValue = useMemo<ProductsContextValue>(
    () => ({
      products,
      editingProduct,
      isLoading,
      createProduct: async (values) => {
        await dispatch(
          createProductAction({
            ...values,
            description: values.description || undefined,
          }),
        ).unwrap();
      },
      updateProduct: async (id, values) => {
        await dispatch(
          updateProductAction({
            id,
            ...values,
            description: values.description || undefined,
            image: values.image || undefined,
          }),
        ).unwrap();
      },
      deactivateProduct: async (id) => {
        await dispatch(
          updateProductAction({
            id,
            active: false,
          }),
        ).unwrap();
      },
      startEditingProduct: (product) => setEditingProduct(product),
      cancelEditingProduct: () => setEditingProduct(null),
    }),
    [dispatch, editingProduct, isLoading, products],
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within ProductsProvider");
  }
  return context;
}
