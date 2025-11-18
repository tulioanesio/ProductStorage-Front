import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
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
  TrendingDown,
  TrendingUp,
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { api } from "@/services/api"
import { useMovimentacoes, type Movement } from "@/hooks/useMovimentacoes"
import { useDebounce } from "@/hooks/useDebounce"

export function MovimentacoesTable({
  onEdit,
  reload,
}: {
  onEdit: (m: Movement) => void
  reload: number
}) {
  const [page, setPage] = React.useState(0)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [movementToDelete, setMovementToDelete] = React.useState<Movement | null>(null)
  const [nameFilter, setNameFilter] = React.useState("")

  const debouncedNameFilter = useDebounce(nameFilter, 500)
  const pageSize = 10

  const { data, totalPages, loading, refetch } = useMovimentacoes(
    reload,
    page,
    pageSize,
    debouncedNameFilter
  )

  React.useEffect(() => {
    setPage(0)
  }, [debouncedNameFilter])


  const columns: ColumnDef<Movement>[] = [
    {
      accessorKey: "movementDate",
      header: "Data",
      cell: ({ row }) => {
        const date = new Date(row.getValue("movementDate") as string)
        return date.toLocaleDateString("pt-BR")
      },
    },
    {
      accessorKey: "productName",
      header: "Produto",
      cell: ({ row }) => row.original.product.name,
    },
    {
      accessorKey: "movementType",
      header: "Tipo de movimentação",
      cell: ({ row }) => {
        const type = row.getValue("movementType")
        return type === "ENTRY" ? (
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp size={16} /> Entrada
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <TrendingDown size={16} /> Saída
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantidade",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const bgClass =
          status === "Normal" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
        return <span className={`py-1 px-2 rounded-md ${bgClass}`}>{status}</span>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const movement = row.original
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
                    navigator.clipboard.writeText(movement.id.toString())
                    toast.success("ID copiado!", { position: "bottom-right" })
                  }}
                >
                  Copiar ID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onEdit(movement)}>
                  Editar movimentação
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setMovementToDelete(movement)}
                  className="text-red-600"
                >
                  Excluir movimentação
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
              open={movementToDelete?.id === movement.id}
              onOpenChange={(open: any) => !open && setMovementToDelete(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Tem certeza que deseja excluir a movimentação{" "}
                    <strong>{movement.id}</strong>?
                    <br />
                    <span className="block mt-2">
                      <strong>Atenção:</strong> ao confirmar, a alteração de estoque
                      do produto <strong>{movement.product.name}</strong> causada por
                      esta movimentação será desfeita.
                    </span>
                  </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      try {
                        await api.delete(`/movements/${movement.id}`)
                        toast.success("Movimentação excluída!", {
                          position: "bottom-right",
                        })
                        setMovementToDelete(null)
                        refetch()
                      } catch {
                        toast.error("Erro ao excluir movimentação")
                      }
                    }}
                  >
                    Excluir
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
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: page, pageSize },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  })

  if (loading) return <p>Carregando...</p>

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
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
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
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
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                  Nenhuma movimentação encontrada.
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
          disabled={page === 0}
        >
          <ArrowLeft size={20} /> Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page + 1 >= totalPages}
        >
          Próxima <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}
