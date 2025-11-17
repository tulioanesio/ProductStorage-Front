import * as React from "react"
import {
 type ColumnDef,
 type ColumnFiltersState,
 type SortingState,
 type VisibilityState,
 getCoreRowModel,
 getFilteredRowModel,
 getSortedRowModel,
 getPaginationRowModel,
 useReactTable,
 flexRender,
} from "@tanstack/react-table"

import {
 ArrowLeft,
 ArrowRight,
 ChevronDown,
 MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
 DropdownMenu,
 DropdownMenuCheckboxItem,
 DropdownMenuContent,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table"

import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { api } from "@/services/api"
import { useCategorias } from "./useCategorias"

export function CategoriasTable({
 onEdit,
 reload,
}: {
 onEdit?: (p: any) => void
 reload: number
}) {
 const [page, setPage] = React.useState(0)
 const [sorting, setSorting] = React.useState<SortingState>([])
 const [columnFilters, setColumnFilters] =
  React.useState<ColumnFiltersState>([])
 const [columnVisibility, setColumnVisibility] =
  React.useState<VisibilityState>({})

 const [categoryToDelete, setCategoryToDelete] = React.useState<any | null>(
  null
 )

 const pageSize = 20

 const { data, loading, refetch } = useCategorias(page, pageSize, reload)

 React.useEffect(() => {
  refetch()
 }, [reload])

 const confirmDelete = async () => {
  if (!categoryToDelete) return
  try {
   await api.delete(`/categories/${categoryToDelete.id}`)
   toast.success("Categoria deletada!", { position: "bottom-right" })
   setCategoryToDelete(null)
   refetch()
  } catch {
   toast.error("Erro ao deletar categoria", { position: "bottom-right" })
  }
 }

 const columns: ColumnDef<any>[] = [
  {
   accessorKey: "name",
   header: "Nome",
   cell: ({ row }) => <span className="capitalize">{row.original.name}</span>,
  },
  {
   accessorKey: "size",
   header: "Tamanho",
   cell: ({ row }) => <span className="capitalize">{row.original.size}</span>,
  },
  {
   accessorKey: "packaging",
   header: "Embalagem",
   cell: ({ row }) => <span className="capitalize">{row.original.packaging}</span>,
  },
  {
   id: "actions",
   enableHiding: false,
   cell: ({ row }) => {
    const cat = row.original

    return (
     <>
      <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
         <MoreHorizontal />
        </Button>
       </DropdownMenuTrigger>

       <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>

        <DropdownMenuItem
         onClick={() => {
          navigator.clipboard.writeText(cat.id.toString());
          toast.success("ID copiado para a área de transferência com sucesso", { position: "bottom-right" });
         }}
        >
         Copiar ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onEdit?.(cat)}>
         Editar categoria
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setCategoryToDelete(cat)}>
         <p className="text-red-500">
          Excluir categoria
         </p>
        </DropdownMenuItem>
       </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
       open={categoryToDelete?.id === cat.id}
       onOpenChange={(o: any) => !o && setCategoryToDelete(null)}
      >
       <AlertDialogContent>
        <AlertDialogHeader>
         <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
         <AlertDialogDescription>
          Tem certeza que deseja excluir{" "}
          <strong>{cat.name}</strong>? Esta ação é irreversível.
         </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
         <AlertDialogCancel>Cancelar</AlertDialogCancel>
         <AlertDialogAction onClick={confirmDelete}>
          Confirmar
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     </>
    )
   },
  },
 ]

 const table = useReactTable({
  data: data?.content ?? [],
  columns,

  manualPagination: true,
  pageCount: data?.totalPages ?? -1,

  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onColumnVisibilityChange: setColumnVisibility,

  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),

  state: {
   sorting,
   columnFilters,
   columnVisibility,
   pagination: {
    pageIndex: page,
    pageSize,
   },
  },
 })

 if (loading) return <p>Carregando...</p>

 return (
  <div className="w-full">
   <div className="flex items-center py-4">
    <Input
     placeholder="Filtrar por nome..."
     value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
     onChange={(e) =>
      table.getColumn("name")?.setFilterValue(e.target.value)
     }
     className="max-w-sm"
    />

    <DropdownMenu>
     <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
       Exibição das colunas
       <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
     </DropdownMenuTrigger>

     <DropdownMenuContent align="end">
      {table
       .getAllColumns()
       .filter((column) => column.getCanHide())
       .map((column) => (
        <DropdownMenuCheckboxItem
         key={column.id}
         checked={column.getIsVisible()}
         onCheckedChange={(value) =>
          column.toggleVisibility(!!value)
         }
        >
         {typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : column.id}
        </DropdownMenuCheckboxItem>
       ))}
     </DropdownMenuContent>
    </DropdownMenu>
   </div>

   <div className="overflow-hidden rounded-md border">
    <Table>
     <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
       <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
         <TableHead key={header.id}>
          {header.isPlaceholder
           ? null
           : flexRender(header.column.columnDef.header, header.getContext())}
         </TableHead>
        ))}
       </TableRow>
      ))}
     </TableHeader>

     <TableBody>
      {table.getRowModel().rows.length ? (
       table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
         {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
           {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
         ))}
        </TableRow>
       ))
      ) : (
       <TableRow>
        <TableCell className="h-24 text-center" colSpan={columns.length}>
         Nenhuma categoria encontrada.
        </TableCell>
       </TableRow>
      )}
     </TableBody>
    </Table>
   </div>

   <div className="flex items-center justify-end space-x-2 py-4">
    <Button
     variant="outline"
     size="sm"
     onClick={() => setPage((p) => Math.max(p - 1, 0))}
     disabled={data?.first}
    >
     <ArrowLeft size={20} /> Anterior
    </Button>

    <Button
     variant="outline"
     size="sm"
     onClick={() => setPage((p) => p + 1)}
     disabled={data?.last}
    >
     <ArrowRight size={20} /> Próxima
    </Button>
   </div>
  </div>
 )
}
