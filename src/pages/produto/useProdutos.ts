import { useEffect, useState } from "react";
import type { PageResponse, ProdutoType } from "@/@types/types";
import { api } from "@/services/api";

export function useProdutos(page: number, size: number) {
 const [data, setData] = useState<PageResponse<ProdutoType>>();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(true);

  api
   .get(`/products?page=${page}&size=${size}`)
   .then((res) => setData(res.data))
   .finally(() => setLoading(false));
 }, [page, size]);

 return { data, loading };
}
