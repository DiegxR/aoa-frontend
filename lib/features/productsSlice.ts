import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createClientClient } from "@/lib/graphql/client";
import {
  CREATE_PRODUCT_MUTATION,
  PRODUCTS_QUERY,
  UPDATE_PRODUCT_MUTATION,
} from "@/lib/graphql/queries";
import type { ProductItem } from "@/lib/reducers/productsReducer";

interface ProductsState {
  products: ProductItem[];
  isLoading: boolean;
  error: string | null;
}

interface CreateProductPayload {
  name: string;
  code: string;
  description?: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  category: string;
  image?: string;
}

interface UpdateProductPayload {
  id: string;
  name?: string;
  description?: string;
  minStock?: number;
  unitPrice?: number;
  category?: string;
  active?: boolean;
  image?: string;
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (active?: boolean) => {
    const client = createClientClient();
    const data = await client.request(PRODUCTS_QUERY, { active });
    return data.products as ProductItem[];
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload: CreateProductPayload) => {
    const client = createClientClient();
    const data = await client.request(CREATE_PRODUCT_MUTATION, payload);
    return data.createProduct as ProductItem;
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (payload: UpdateProductPayload) => {
    const client = createClientClient();
    const data = await client.request(UPDATE_PRODUCT_MUTATION, payload);
    return data.updateProduct as ProductItem;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "No se pudieron obtener productos";
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "No se pudo crear el producto";
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "No se pudo actualizar el producto";
      });
  },
});

export default productsSlice.reducer;
