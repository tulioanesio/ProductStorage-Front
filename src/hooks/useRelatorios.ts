import { useState, useEffect } from "react";
import { api } from "@/services/api";

export type ReportType =
  | "PRICE_LIST"
  | "BALANCE"
  | "LOW_STOCK"
  | "BY_CATEGORY"
  | "MOST_OUTPUT"
  | "MOST_INPUT";

export interface ReportItem {
  [key: string]: any;
}

export interface ReportSummary {
  totalValue?: number;
  [key: string]: any;
}

export interface PageInfo {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
}

export function useRelatorios(
  type: ReportType,
  page: number = 0,
  size: number = 20
) {
  const [data, setData] = useState<ReportItem[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({});
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);
      setSummary({});
      setData([]);
      setPageInfo(null);

      try {
        let response;
        const queryParams = `?page=${page}&size=${size}`;

        switch (type) {
          case "PRICE_LIST":
            response = await api.get(`/reports/price-list${queryParams}`);
            setData(response.data.content);
            setPageInfo({
              totalPages: response.data.totalPages,
              totalElements: response.data.totalElements,
              first: response.data.first,
              last: response.data.last,
              number: response.data.number,
              size: response.data.size,
            });
            break;

          case "BALANCE":
            response = await api.get(
              `/reports/inventory-balance${queryParams}`
            );
            setSummary({ totalValue: response.data.stockValue });
            setData(response.data.items.content);
            setPageInfo({
              totalPages: response.data.items.totalPages,
              totalElements: response.data.items.totalElements,
              first: response.data.items.first,
              last: response.data.items.last,
              number: response.data.items.number,
              size: response.data.items.size,
            });
            break;

          case "LOW_STOCK":
            response = await api.get(
              `/reports/low-stock-products${queryParams}`
            );
            setData(response.data.content);
            setPageInfo({
              totalPages: response.data.totalPages,
              totalElements: response.data.totalElements,
              first: response.data.first,
              last: response.data.last,
              number: response.data.number,
              size: response.data.size,
            });
            break;

          case "BY_CATEGORY":
            response = await api.get(
              `/reports/products-by-category${queryParams}`
            );
            setData(response.data.content);
            setPageInfo({
              totalPages: response.data.totalPages,
              totalElements: response.data.totalElements,
              first: response.data.first,
              last: response.data.last,
              number: response.data.number,
              size: response.data.size,
            });
            break;

          case "MOST_OUTPUT":
            response = await api.get("/reports/most-output-product");
            setData(response.data);
            setPageInfo(null);
            break;

          case "MOST_INPUT":
            response = await api.get("/reports/most-input-product");
            setData(response.data);
            setPageInfo(null);
            break;
        }
      } catch (err) {
        console.error(`Erro ao carregar relatório ${type}:`, err);
        setError(
          "Não foi possível carregar os dados do relatório. Verifique se o backend está rodando."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [type, page, size]);

  return { data, summary, pageInfo, loading, error };
}
