"use client";

import { useProductsContext } from "@/app/context/ProductsContext";
import { fetchProducts } from "@/lib/features/productsSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart, setCartOpen } from "@/lib/features/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Image from "next/image";

const UserDashboardPage = () => {
  const { products, isLoading } = useProductsContext();
  const dispatch = useAppDispatch();
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts()); 
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    setAddingId(product.id);
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      unitPrice: product.unitPrice,
      image: product.image,
      stock: product.stock
    }));
    
    toast.success(`${product.name} añadido al carrito`, {
      icon: '🛒',
      style: {
        borderRadius: '1rem',
        background: '#1a2235',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
    
    setTimeout(() => {
      setAddingId(null);
      dispatch(setCartOpen(true));
    }, 500);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
        <p className="text-white/60">Explora y adquiere nuestros productos disponibles.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`group relative flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 ${
              product.active 
                ? "border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.1)]" 
                : "border-white/5 bg-white/[0.02] grayscale opacity-70"
            }`}
          >
            {/* Badge de Estado/Categoría */}
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
              <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                {product.category}
              </span>
              {!product.active && (
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 backdrop-blur-md border border-red-500/30">
                  Descatalogado
                </span>
              )}
            </div>

            {/* Contenedor de Imagen con Efectos */}
            <div className="relative h-[250px] overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Overlay Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              
              {/* Precio Flotante */}
              <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded-2xl bg-blue-600 px-4 py-2 text-xl font-black text-white shadow-xl">
                  ${product.unitPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Contenido Detallado */}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                  {product.name}
                </h3>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Ref: {product.code}
                </p>
              </div>
              
              <p className="mb-6 text-sm leading-relaxed text-white/50 line-clamp-2">
                {product.description || "Este producto no tiene una descripción detallada todavía."}
              </p>

              {/* Footer de la Card */}
              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Disponibilidad</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      product.stock === 0 ? 'bg-red-500' : product.stock <= product.minStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500'
                    }`} />
                    <span className={`text-sm font-bold ${
                      product.stock === 0 ? 'text-red-400' : product.stock <= product.minStock ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingId === product.id || !product.active || product.stock === 0}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                    !product.active || product.stock === 0
                      ? "bg-white/5 text-white/10 cursor-not-allowed"
                      : "bg-white text-black hover:bg-blue-500 hover:text-white shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
                  }`}
                  title={!product.active ? "Producto no disponible" : product.stock === 0 ? "Sin existencias" : "Añadir al carrito"}
                >
                  {addingId === product.id ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <div className="mb-4 rounded-full bg-white/5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No hay productos disponibles</h3>
          <p className="text-white/40">Vuelve más tarde para ver nuestras novedades.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
