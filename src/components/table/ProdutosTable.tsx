import * as React from "react";
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
} from "@tanstack/react-table";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MoreHorizontal,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { ProdutoType } from "@/@types/types";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useProdutos } from "@/hooks/useProdutos";

export function ProdutosTable({
  onEdit,
  reload,
}: {
  onEdit?: (p: ProdutoType) => void;
  reload: number;
}) {
  const [page, setPage] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const [productToDelete, setProductToDelete] = React.useState<ProdutoType | null>(null);

  const pageSize = 20;

  const { data, loading, refetch } = useProdutos(page, pageSize, reload);

  React.useEffect(() => {
    refetch();
  }, [reload]);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}`);
      toast.success("Produto deletado com sucesso!", { position: "bottom-right" });

      setProductToDelete(null);
      refetch();

    } catch {
      toast.error("Erro ao deletar produto", { position: "bottom-right" });
    }
  };

  const columns: ColumnDef<ProdutoType>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const produto = row.original;
        const min = produto.minQuantity ?? 0;
        const max = produto.maxQuantity ?? Infinity;
        const estoque = produto.availableStock ?? 0;

        const isBelowMin = estoque < min;
        const isAboveMax = estoque > max;

        return (
          <div className="flex items-center gap-2">
            <span className="capitalize">{produto.name}</span>

            {(isBelowMin || isAboveMax) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {(isBelowMin) && (
                      <CircleArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    {(isAboveMax) && (
                      <CircleArrowUp className="h-4 w-4 text-red-600" />
                    )}
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      O estoque deste produto está {isBelowMin ? "abaixo" : "acima"} do limite permitido
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "unitPrice",
      header: "Preço unitário",
      cell: ({ getValue }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(getValue())),
    },

    {
      accessorKey: "unitOfMeasure",
      header: "Unidade de medida",
      cell: ({ getValue }) => String(getValue()),
    },

    {
      accessorKey: "availableStock",
      header: "Estoque disponível",
      cell: ({ getValue }) => Number(getValue()),
    },

    {
      id: "minStockQuantity",
      header: "Qtd. mínima",
      accessorFn: (row) => row.minQuantity ?? 0,
      cell: ({ getValue }) => Number(getValue()),
    },

    {
      id: "maxStockQuantity",
      header: "Qtd. máxima",
      accessorFn: (row) => row.maxQuantity ?? 0,
      cell: ({ getValue }) => Number(getValue()),
    },

    {
      id: "categoryName",
      header: "Categoria",
      accessorFn: (row) => row.category?.name ?? "",
      cell: ({ getValue }) => (
        <div className={getValue() != "" ? "inline-flex items-center px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-800" : ""}>
          {String(getValue())}
        </div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const produto = row.original;

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
                    navigator.clipboard.writeText(produto.id.toString());
                    toast.success("ID copiado para a área de transferência com sucesso", { position: "bottom-right" });
                  }}
                >
                  Copiar ID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onEdit?.(produto)}>
                  Editar produto
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setProductToDelete(produto)}>
                  <p className="text-red-500">
                    Excluir produto
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
              open={productToDelete?.id === produto.id}
              onOpenChange={(open: boolean) => !open && setProductToDelete(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o produto{" "}
                    <strong>{produto.name}</strong>? Esta ação não pode ser revertida.
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
        );
      },
    },
  ];

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
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum produto encontrado.
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
  );
}
