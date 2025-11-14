import * as React from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowLeft, ArrowRight, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Movement = {
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

const MOCK_MOVEMENTS: Movement[] = [
    {
        id: 10,
        product: { id: 1, name: "Notebook Dell Inspiron 15" },
        movementDate: "2025-11-04",
        quantity: 15,
        movementType: "ENTRY",
        status: "Normal"
    },
    {
        id: 11,
        product: { id: 2, name: "Mouse Logitech M170" },
        movementDate: "2025-11-05",
        quantity: 5,
        movementType: "EXIT",
        status: "Normal"
    },
]

export const columns: ColumnDef<Movement>[] = [
    {
        accessorKey: "movementType",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("movementType")
            return (
                <span className={`font-medium ${type === "ENTRY" ? "py-1 px-2 rounded bg-green-200 text-green-600" : "p-1 rounded bg-red-200 text-red-600"}`}>
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
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const movement = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(movement.id))}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Excluir movimentação</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function MovementPage() {
    const [data, setData] = React.useState<Movement[]>(MOCK_MOVEMENTS)
    const [open, setOpen] = React.useState(false)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [type, setType] = React.useState<"ENTRY" | "EXIT">("ENTRY")
    const [product, setProduct] = React.useState("")
    const [quantity, setQuantity] = React.useState("")
    const [date, setDate] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        state: { sorting },
    })

    function handleSave() {
        const newMovement: Movement = {
            id: Math.floor(Math.random() * 9999),
            product: { id: 1, name: product },
            movementDate: date || new Date().toISOString(),
            quantity: Number(quantity),
            movementType: type,
            status: "Normal",
        }

        setData((prev) => [newMovement, ...prev])
        setOpen(false)
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Movimentações</h2>
                    <p className="text-gray-500 mb-6">Registre e acompanhe as entradas e saídas de estoque</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova movimentação
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar movimentação</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3 mt-4">
                            <Select value={type} onValueChange={(v: "ENTRY" | "EXIT") => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de movimentação" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENTRY">Entrada</SelectItem>
                                    <SelectItem value="EXIT">Saída</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Nome do produto"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                            />

                            <Input
                                type="number"
                                placeholder="Quantidade"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />

                            <Input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            <Button onClick={handleSave}>Salvar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Buscar por produto..."
                    value={(table.getColumn("product")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("product")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ArrowLeft size={20} /> Anterior
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Próxima <ArrowRight size={20} />
                </Button>
            </div>
        </div>
    )
}