import type { PageResponse, ProdutoType } from "@/@types/types";
import { useEffect, useState } from "react";

export function useProdutos(page: number, size: number) {
 const [data, setData] = useState<PageResponse<ProdutoType>>();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(true);

  const allItems: ProdutoType[] = Array.from({ length: 24 }, (_, i) => ({
   id: i + 1,
   name: `Notebook Dell Inspiron ${i + 1}`,
   unitPrice: 4299.99 + i,
   unitOfMeasure: "unidade",
   availableStock: 20 + i,
   minQuantity: 5,
   maxQuantity: 50,
   category: {
    id: 1,
    name: "Eletrônicos",
    size: "15 polegadas",
    packaging: "Caixa",
   },
  }));

  const start = page * 20;
  const end = start + 20;
  const pagedContent = allItems.slice(start, end);

  const mock: PageResponse<ProdutoType> = {
   content: pagedContent,
   totalElements: 24,
   totalPages: Math.ceil(24 / 20),
   number: page,
   size: 20,
   first: page === 0,
   last: page === Math.ceil(24 / 20) - 1,
  };

  setTimeout(() => {
   setData(mock);
   setLoading(false);
  }, 400);
 }, [page, size]);

 return { data, loading };
}
