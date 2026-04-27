"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import DashboardButton from "./DashboardButton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCartOpen } from "@/lib/features/cartSlice";
import CartSidebar from "./CartSidebar";

export interface NavItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  sectionTitle?: string;
  logoSrc?: string;
  logoAlt?: string;
}

const DashboardTemplate = ({
  children,
  navItems,
  sectionTitle = "Gestión",
  logoSrc = "/logo.png",
  logoAlt = "AOA",
}: DashboardLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cerrar menú al redimensionar a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevenir scroll del body cuando el menú está abierto en móvil
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <div className="flex w-full overflow-hidden min-h-screen bg-[#0f1623]">
      {/* Header superior con logo y botón hamburguesa */}
      <header
        className="fixed top-0 left-0 w-full h-[150px] z-30 flex items-center justify-between
                   bg-[#151d2e] border-b border-white/5 shadow-xl px-6 lg:px-20"
      >
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa (solo visible en móvil) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 rounded-md
                       hover:bg-white/10 transition-colors"
            aria-label="Menú"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white my-1 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>

          {/* Logo */}
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={120}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        {/* Carrito y Avatar */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => dispatch(setCartOpen(true))}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 hover:border-blue-500/50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold shadow-lg shadow-blue-600/40">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartSidebar />

      {/* Overlay (fondo oscuro cuando menú está abierto en móvil) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar (menú lateral) */}
      <aside
        className={`
          fixed top-0 lg:mt-[150px] lg:h-[80vh] left-0 z-50 w-72 h-full
          transform transition-transform duration-300 ease-in-out
          bg-[#151d2e] border-r border-white/5
          flex flex-col pt-8 pb-6 px-4 shadow-2xl
          lg:translate-x-0 lg:static lg:z-10
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo dentro del menú (solo visible en móvil) */}
        <div className="lg:hidden flex justify-center mb-6">
          <Image src={logoSrc} alt={logoAlt} width={100} height={50} />
        </div>

        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4 px-3">
          {sectionTitle}
        </h3>

        <nav className="flex flex-col gap-3 flex-1">
          {navItems.map((item) => (
            <DashboardButton
              key={item.path}
              icon={item.icon}
              name={item.name}
              path={item.path}
              onClick={() => setIsMenuOpen(false)} // cierra menú al navegar (móvil)
            />
          ))}
        </nav>

        {/* Help card inferior */}
        <div className="mx-1 rounded-xl bg-white/5 border border-white/10 p-4">
          <p className="text-xs font-medium text-white/60 mb-1">
            ¿Necesitas ayuda?
          </p>
          <p className="text-xs text-white/30">
            Consulta la documentación
          </p>
        </div>
      </aside>

      {/* Contenido principal */}
      <main
        className={`
          w-full transition-all duration-300
          pt-[170px] p-8 h-full overflow-hidden
          ${isMenuOpen ? "overflow-hidden" : ""}
        `}
      >
        <div className="bg-[#1a2235] rounded-2xl border border-white/5 shadow-inner p-6 h-[75vh] text-white overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardTemplate;