"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
} from "@/lib/features/cartSlice";
import { createClientClient } from "@/lib/graphql/client";
import { CREATE_MOVEMENT_MUTATION } from "@/lib/graphql/queries";
import { fetchProducts } from "@/lib/features/productsSlice";
import toast from "react-hot-toast";
import { useState } from "react";

const CartSidebar = () => {
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      setIsProcessing(true);
      const client = createClientClient();

      // Procesar cada item como un movimiento de salida
      for (const item of items) {
        await client.request(CREATE_MOVEMENT_MUTATION, {
          productId: item.id,
          type: "salida",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: "Compra masiva desde carrito",
        });
      }

      toast.success("¡Compra realizada con éxito!");
      dispatch(clearCart());
      dispatch(setCartOpen(false));
      dispatch(fetchProducts(true));
    } catch (error: any) {
      const message = error.response?.errors?.[0]?.message || "Error al procesar la compra";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setCartOpen(false))}
      />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-[#151d2e] shadow-2xl border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
              <button
                onClick={() => dispatch(setCartOpen(false))}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 rounded-full bg-white/5 p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-white/40">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/10 text-xs">No img</div>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-bold text-white">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg bg-white/5 p-1 border border-white/10">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            className="p-1 text-white/40 hover:text-white transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="p-1 text-white/40 hover:text-white transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <div className="flex justify-between text-base font-bold text-white mb-6">
                <p>Total</p>
                <p className="text-2xl text-blue-400">${total.toFixed(2)}</p>
              </div>
              <button
                disabled={items.length === 0 || isProcessing}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:grayscale"
              >
                {isProcessing ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pagar Ahora
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-[10px] text-white/20 uppercase font-bold tracking-widest">
                Transacción segura protegida por AOA Systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
