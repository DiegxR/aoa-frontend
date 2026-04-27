"use client";

import { useEffect, useState } from "react";
import { createClientClient } from "@/lib/graphql/client";
import {
  SALES_STATS_QUERY,
  SALES_BY_MONTH_QUERY,
  SALES_BY_CATEGORY_QUERY,
  MOVEMENTS_REPORT_QUERY,
} from "@/lib/graphql/queries";
import AdminChart from "@/app/components/AdminChart";
import { TrendingUp, DollarSign, ShoppingBag, Users, Filter, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const SalesPanel = () => {
  const [stats, setStats] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const client = createClientClient();
      
      const [sData, mData, cData, movData]: any = await Promise.all([
        client.request(SALES_STATS_QUERY),
        client.request(SALES_BY_MONTH_QUERY),
        client.request(SALES_BY_CATEGORY_QUERY),
        client.request(MOVEMENTS_REPORT_QUERY, { type: "salida", ...filters }),
      ]);

      setStats(sData.salesStats);
      
      setMonthlyData({
        labels: mData.salesByMonth.labels,
        datasets: [{
          label: "Ventas Mensuales ($)",
          data: mData.salesByMonth.values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4
        }]
      });

      setCategoryData({
        labels: cData.salesByCategory.labels,
        datasets: [{
          label: "Ventas por Categoría",
          data: cData.salesByCategory.values,
          backgroundColor: [
            "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
          ],
        }]
      });

      setMovements(movData.movements);
    } catch (error) {
      toast.error("Error al cargar datos de ventas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  if (isLoading && !stats) return <div className="p-8 text-center text-white/50">Cargando panel de ventas...</div>;

  const metricCards = [
    { title: "Ventas Totales", value: `$${stats?.totalSales.toLocaleString()}`, icon: DollarSign, color: "blue" },
    { title: "Ventas del Mes", value: `$${stats?.monthlySales.toLocaleString()}`, icon: TrendingUp, color: "green" },
    { title: "Ticket Promedio", value: `$${stats?.averageTicket.toFixed(2)}`, icon: ShoppingBag, color: "purple" },
    { title: "Total Pedidos", value: stats?.count, icon: Users, color: "orange" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Métricas Clave */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">{card.title}</p>
                <h4 className="mt-2 text-2xl font-black text-white">{card.value}</h4>
              </div>
              <div className={`rounded-2xl bg-${card.color}-500/10 p-3 text-${card.color}-400`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
          <h3 className="mb-6 text-lg font-bold text-white">Evolución de Ventas</h3>
          {monthlyData && <AdminChart type="line" data={monthlyData} height={300} />}
        </div>
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
          <h3 className="mb-6 text-lg font-bold text-white">Distribución por Categoría</h3>
          {categoryData && <AdminChart type="pie" data={categoryData} height={300} />}
        </div>
      </div>

      {/* Tabla de Transacciones Recientes */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-white">Historial de Transacciones</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 border border-white/10">
              <Calendar size={16} className="text-white/30" />
              <input 
                type="date" 
                className="bg-transparent text-sm text-white focus:outline-none"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 border border-white/10">
              <Calendar size={16} className="text-white/30" />
              <input 
                type="date" 
                className="bg-transparent text-sm text-white focus:outline-none"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/30 uppercase text-[10px] font-bold tracking-widest">
                <th className="pb-4 pr-4">Fecha</th>
                <th className="pb-4 pr-4">Cliente</th>
                <th className="pb-4 pr-4">Producto</th>
                <th className="pb-4 pr-4 text-center">Cant.</th>
                <th className="pb-4 pr-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {movements.map((mov) => (
                <tr key={mov.id} className="text-white/70 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pr-4 text-xs">
                    {new Date(parseInt(mov.createdAt)).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4 font-medium text-white">{mov.registeredBy.name}</td>
                  <td className="py-4 pr-4">{mov.product.name}</td>
                  <td className="py-4 pr-4 text-center">{mov.quantity}</td>
                  <td className="py-4 pr-4 text-right font-bold text-blue-400">
                    ${mov.totalValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {movements.length === 0 && (
            <div className="py-12 text-center text-white/20">No hay transacciones registradas</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPanel;
