import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type { Movement } from "./useMovimentacoes"
import React from "react"

type Props = {
  data: Movement[]
  onEdit: (m: Movement) => void
  reload: () => void
}

export const columns: ColumnDef<Movement>[] = [
  {
    accessorKey: "movementType",
    header: "Tipo de movimentação",
    cell: ({ row }) => {
      const type = row.getValue("movementType")
      return (
        <span
          className={`${type === "ENTRY"
            ? "py-1 px-2 rounded-md bg-green-200 text-green-800"
            : "py-1 px-2 rounded-md bg-red-200 text-red-800"
            }`}
        >
          {type === "ENTRY" ? "Entrada" : "Saída"}
        </span>
      )
    },
  },
  {
    accessorKey: "product",
    header: "Produto",
    cell: ({ row }) => row.original.product.name,
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "movementDate",
    header: "Data",
    cell: ({ row }) => {
      const raw = row.getValue("movementDate") as string
      const date = new Date(raw)
      return date.toLocaleDateString("pt-BR")
    },
  },
]

export function MovimentacoesTable({ data, onEdit, reload }: Props) {
  const [movementToDelete, setMovementToDelete] = React.useState<Movement | null>(null)

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: "actions",
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
                      toast.success("ID copiado para a área de transferência com sucesso", { position: "bottom-right" })
                    }}
                  >
                    Copiar ID
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => onEdit(movement)}>
                    Editar movimentação
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setMovementToDelete(movement)} className="text-red-600">
                    Excluir movimentação
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog
                open={movementToDelete?.id === movement.id}
                onOpenChange={(open: any) => {
                  if (!open) setMovementToDelete(null)
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Tem certeza que deseja excluir a movimentação <strong>{movement.id}</strong> do produto <strong>{movement.product.name}</strong>?
                      <br />
                      <span className="block mt-2">
                        <strong>Atenção:</strong> ao confirmar, a alteração de estoque do produto <strong>{movement.product.name}</strong> causada por esta movimentação será desfeita.
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
                          toast.success("Movimentação excluída! Estoque ajustado.", { position: "bottom-right" })
                          setMovementToDelete(null)
                          reload()
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
    ],
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded border">
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
            {data.length ? (
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
                <TableCell colSpan={columns.length} className="text-center h-24">
                  Nenhuma movimentação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft /> Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima <ArrowRight />
        </Button>
      </div>
    </div>
  )
}
