import { useEffect, useState } from "react";
import { api } from "@/services/api";

export interface DashboardData {
 totalProducts: number;
 lowStockProducts: number;
 highStockProducts: number;
 totalStockValue: number;
}

export function useDashboard(refresh: number = 0) {
 const [data, setData] = useState<DashboardData | null>(null);
 const [loading, setLoading] = useState(true);

 const refetch = () => {
  setLoading(true);

  api
   .get("/dashboard")
   .then((res) => setData(res.data))
   .finally(() => setLoading(false));
 };

 useEffect(() => {
  refetch();
 }, [refresh]);

 return { data, loading, refetch };
}
