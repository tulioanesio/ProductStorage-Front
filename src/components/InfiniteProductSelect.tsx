import { useCallback, useEffect, useRef, useState } from "react"
import {
 Command,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/services/api"

type Product = {
 id: number
 name: string
}

type Props = {
 value: string
 onChange: (v: string) => void
}

export function InfiniteProductSelect({ value, onChange }: Props) {
 const [open, setOpen] = useState(false)
 const [items, setItems] = useState<Product[]>([])
 const [page, setPage] = useState(0)
 const [hasMore, setHasMore] = useState(true)
 const [loading, setLoading] = useState(false)
 const [search, setSearch] = useState("")

 const observerRef = useRef<HTMLDivElement | null>(null)

 const fetchProducts = useCallback(async () => {
  if (loading) return
  setLoading(true)

  try {
   const { data } = await api.get("/products", {
    params: { page, size: 20, name: search || undefined },
   })

   const content = Array.isArray(data.content) ? data.content : []

   setItems(prev => (page === 0 ? content : [...prev, ...content]))
   setHasMore(!data.last)
  } catch {
   setItems(prev => (page === 0 ? [] : prev))
   setHasMore(false)
  } finally {
   setLoading(false)
  }
 }, [page, search, loading])

 useEffect(() => {
  fetchProducts()
 }, [page, search])

 useEffect(() => {
  const target = observerRef.current
  if (!target) return

  const parent = target.parentElement
  if (!parent) return

  const io = new IntersectionObserver(
   entries => {
    if (entries[0].isIntersecting && hasMore && !loading) {
     setPage(p => p + 1)
    }
   },
   { root: parent }
  )

  io.observe(target)
  return () => io.disconnect()
 }, [hasMore, loading])

 const handleSearch = (q: string) => {
  setSearch(q)
  setPage(0)
  setItems([])
  setHasMore(true)
 }

 const selectedLabel = items.find(i => String(i.id) === value)?.name

 return (
  <Popover open={open} onOpenChange={setOpen}>
   <PopoverTrigger asChild>
    <Button
     variant="outline"
     role="combobox"
     className="w-full justify-between"
    >
     {selectedLabel || "Selecione um produto"}
     <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
    </Button>
   </PopoverTrigger>

   <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
    <Command shouldFilter={false}>

     <CommandInput
      placeholder="Buscar..."
      onValueChange={handleSearch}
     />

     <CommandEmpty className="py-4 text-center text-sm">
      Nenhum produto encontrado.
     </CommandEmpty>

     <CommandGroup className="max-h-72 overflow-auto">
      {items.map(p => (
       <CommandItem
        key={p.id}
        value={String(p.id)}
        onSelect={() => {
         onChange(String(p.id))
         setOpen(false)
        }}
       >
        <Check
         className={cn(
          "mr-2 h-4 w-4",
          value === String(p.id) ? "opacity-100" : "opacity-0"
         )}
        />
        <span className="truncate">{p.name}</span>
       </CommandItem>
      ))}

      <div
       ref={observerRef}
       className="py-2 text-center text-sm text-muted-foreground"
      >
       {loading ? "Carregando..." : !hasMore ? "Fim da lista" : ""}
      </div>
     </CommandGroup>

    </Command>
   </PopoverContent>
  </Popover>
 )
}
