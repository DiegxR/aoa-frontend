import DashboardTemplate from '@/app/components/templates/DashboardTemplate';
import React from 'react'
import { UsersProvider } from '../../context/UsersContext';
import { ProductsProvider } from '../../context/ProductsContext';
import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3 } from 'lucide-react';

export default function AdminDashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
}>) {
  const navItems = [
    {name: "Productos", icon: <Package size={20} />, path: "/admin/dashboard/products"},
    {name: "Usuarios", icon: <Users size={20} />, path: "/admin/dashboard/users"},
    {name: "Ventas", icon: <BarChart3 size={20} />, path: "/admin/dashboard/sales"},
    {name: "Inventario", icon: <ShoppingCart size={20} />, path: "/admin/dashboard/inventory"},
  ]

  return (
    <div>
      <ProductsProvider>
        <UsersProvider>
          <DashboardTemplate navItems={navItems}>{children}</DashboardTemplate>
        </UsersProvider>
      </ProductsProvider>
    </div>
  )
}