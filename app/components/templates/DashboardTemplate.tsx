"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import NavLink from "@/app/components/atoms/NavLink";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCartOpen } from "@/lib/features/cartSlice";
import CartSidebar from "@/app/components/organisms/CartSidebar";
import { NavItem } from "@/app/types/ui";
import { Menu, X, ShoppingCart, HelpCircle } from "lucide-react";

interface DashboardTemplateProps {
  children: React.ReactNode;
  navItems: NavItem[];
  sectionTitle?: string;
  logoSrc?: string;
  logoAlt?: string;
}

/**
 * Template Component: DashboardTemplate
 * Provides the main layout for the administrative and user dashboards.
 * Refactored for better modularity and responsive design.
 */
const DashboardTemplate = ({
  children,
  navItems,
  sectionTitle = "Gestión",
  logoSrc = "/logo.png",
  logoAlt = "AOA",
}: DashboardTemplateProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  return (
    <div className="flex w-full h-screen overflow-y-hidden bg-[#0f1623] text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full h-24 z-40 flex items-center justify-between bg-[#151d2e]/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="relative h-10 w-24">
            <Image src={logoSrc} alt={logoAlt} fill className="object-contain" priority />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setCartOpen(true))}
            className="relative p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartSidebar />

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 left-0 z-50 w-72 h-[99vh] pt-32 pb-8 px-6 bg-[#151d2e] border-r border-white/5
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-10
        ${isMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6 px-4">
            {sectionTitle}
          </h3>

          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>

          <div className="mt-auto p-5 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/[0.07] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <HelpCircle size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">Soporte</p>
                <p className="text-[10px] text-white/30">Documentación y ayuda</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w- mt-[80px] h-[95vh] pt-32 p-6 lg:p-12 overflow-hidden">
        <div className="h-full bg-[#1a2235]/50 rounded-[2.5rem] border border-white/5 shadow-2xl p-8 overflow-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardTemplate;
