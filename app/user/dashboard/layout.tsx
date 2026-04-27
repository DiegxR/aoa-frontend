"use client";

import DashboardTemplate from "@/app/components/DashboardTamplate";
import { ProductsProvider } from "@/app/context/ProductsContext";
import React from "react";

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "Catálogo", icon: "🛍️", path: "/user/dashboard" },
    { name: "Mis Compras", icon: "📜", path: "/user/dashboard/purchases" },
  ];

  return (
    <ProductsProvider>
      <DashboardTemplate navItems={navItems}>{children}</DashboardTemplate>
    </ProductsProvider>
  );
}
