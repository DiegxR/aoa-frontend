"use client";

import { createClientClient } from "@/lib/graphql/client";
import { ME_QUERY } from "@/lib/graphql/queries";
import { useEffect, useState } from "react";
import { gql } from "graphql-request";

const USER_MOVEMENTS_QUERY = gql`
  query UserMovements {
    movements {
      id
      product {
        name
        image
      }
      type
      quantity
      unitPrice
      totalValue
      createdAt
    }
  }
`;

const PurchasesPage = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const client = createClientClient();
        const data: any = await client.request(USER_MOVEMENTS_QUERY);
        // Filtrar solo salidas (compras)
        setMovements(data.movements.filter((m: any) => m.type === "salida"));
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Mis Compras</h1>
        <p className="text-white/60">Historial de productos adquiridos.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-white/40 uppercase text-[10px] font-bold tracking-wider">
              <th className="p-4">Producto</th>
              <th className="p-4 text-center">Cantidad</th>
              <th className="p-4 text-right">Precio Unit.</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {movements.map((movement) => (
              <tr key={movement.id} className="text-white/80 hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                      {movement.product.image ? (
                        <img src={movement.product.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px]">N/A</div>
                      )}
                    </div>
                    <span className="font-medium">{movement.product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center font-bold text-white">{movement.quantity}</td>
                <td className="p-4 text-right text-blue-400">${movement.unitPrice.toFixed(2)}</td>
                <td className="p-4 text-right font-black text-white">${movement.totalValue.toFixed(2)}</td>
                <td className="p-4 text-right text-white/40">
                  {new Date(parseInt(movement.createdAt)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {movements.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-white/40">Aún no has realizado ninguna compra.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
