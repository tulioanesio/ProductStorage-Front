import { useEffect, useState } from "react"
import { api } from "@/services/api"

export type Movement = {
 id: number
 product: {
  id: number
  name: string
 }
 movementDate: string
 quantity: number
 movementType: "ENTRY" | "EXIT"
 status: string
}

type MovementsResponse = {
 content: Movement[]
 totalPages: number
 totalElements: number
 number: number
 size: number
}

export function useMovimentacoes(reload: number, page: number = 0, size: number = 10) {
 const [data, setData] = useState<Movement[]>([])
 const [totalPages, setTotalPages] = useState(0)
 const [loading, setLoading] = useState(true)

 const load = async () => {
  try {
   setLoading(true)
   const res = await api.get<MovementsResponse>("/movements", {
    params: { page, size },
   })

   setData(res.data.content)
   setTotalPages(res.data.totalPages)
  } finally {
   setLoading(false)
  }
 }

 useEffect(() => {
  load()
 }, [reload, page])

 return { data, totalPages, loading }
}
