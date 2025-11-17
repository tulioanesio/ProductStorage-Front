import { useEffect, useState } from "react"
import { api } from "@/services/api"

export function useCategorias(page: number, size: number, refresh: number) {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 const refetch = () => {
  setLoading(true)
  api
   .get("/categories", { params: { page, size } })
   .then(res => setData(res.data))
   .finally(() => setLoading(false))
 }

 useEffect(() => {
  refetch()
 }, [page, size, refresh])

 return { data, loading, refetch }
}
