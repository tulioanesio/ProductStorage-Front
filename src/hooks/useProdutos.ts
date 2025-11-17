import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function useProdutos(page: number, size: number, refresh: number, nameFilter: string = "") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    const params: any = { page, size };
    if (nameFilter) params.name = nameFilter;

    api
      .get("/products", { params })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, [page, size, refresh, nameFilter]);

  return { data, loading, refetch };
}
