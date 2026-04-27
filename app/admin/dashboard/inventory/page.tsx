"use client";

import { useEffect, useState } from "react";
import { createClientClient } from "@/lib/graphql/client";
import {
  INVENTORY_TRENDS_QUERY,
  MOVEMENTS_REPORT_QUERY,
  PRODUCTS_QUERY,
} from "@/lib/graphql/queries";
import AdminChart from "@/app/components/AdminChart";
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Search, 
  Activity,
  ArrowRightLeft
} from "lucide-react";
import toast from "react-hot-toast";

const InventoryPanel = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [trendData, setTrendData] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const client = createClientClient();
      
      const pData: any = await client.request(PRODUCTS_QUERY);
      setProducts(pData.products);
      
      if (pData.products.length > 0 && !selectedProductId) {
        setSelectedProductId(pData.products[0].id);
      }

      const movData: any = await client.request(MOVEMENTS_REPORT_QUERY, {
        productId: selectedProductId || undefined,
        type: filterType || undefined
      });
      setMovements(movData.movements);

      if (selectedProductId) {
        const tData: any = await client.request(INVENTORY_TRENDS_QUERY, { productId: selectedProductId });
        setTrendData({
          labels: tData.inventoryTrends.labels,
          datasets: [{
            label: "Nivel de Stock",
            data: tData.inventoryTrends.values,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4
          }]
        });
      }
    } catch (error) {
      toast.error("Error al cargar datos de inventario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProductId, filterType]);

  const criticalProducts = products.filter(p => p.stock < 10);
  const topRotation = products.slice().sort((a, b) => b.stock - a.stock).slice(0, 5);

  const rotationData = {
    labels: topRotation.map(p => p.name),
    datasets: [{
      label: "Stock Actual",
      data: topRotation.map(p => p.stock),
      backgroundColor: "rgba(59, 130, 246, 0.6)",
      borderRadius: 8,
    }]
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Resumen y Alertas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-emerald-400" />
              Tendencia de Stock
            </h3>
            <select 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {trendData ? (
            <AdminChart type="line" data={trendData} height={300} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/20">
              Selecciona un producto para ver su tendencia
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/5 bg-red-500/5 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-400" />
            Alertas de Stock Crítico
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {criticalProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-white text-sm">{p.name}</p>
                  <p className="text-xs text-white/30">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-red-400">{p.stock}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/20">Unidades</p>
                </div>
              </div>
            ))}
            {criticalProducts.length === 0 && (
              <div className="text-center py-12 text-white/20 text-sm">Todo el stock está en niveles óptimos</div>
            )}
          </div>
        </div>
      </div>

      {/* Rotación y Búsqueda */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
          <h3 className="mb-8 text-lg font-bold text-white">Productos con Mayor Existencia</h3>
          <AdminChart type="bar" data={rotationData} height={300} />
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-xl">
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white">Filtros de Movimiento</h3>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text"
                  placeholder="Buscar producto o notas..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-white focus:outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="entrada">Entradas</option>
                <option value="salida">Salidas</option>
              </select>
            </div>
            
            <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              <div className="space-y-3">
                {movements
                  .filter(m => m.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.notes?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((mov) => (
                  <div key={mov.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className={`p-2 rounded-xl ${mov.type === 'entrada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {mov.type === 'entrada' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{mov.product.name}</p>
                      <p className="text-[10px] text-white/30">{new Date(parseInt(mov.createdAt)).toLocaleString()} • {mov.registeredBy.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${mov.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {mov.type === 'entrada' ? '+' : '-'}{mov.quantity}
                      </p>
                      <p className="text-[10px] text-white/20 uppercase tracking-tighter">Stock: {mov.stockAfter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
