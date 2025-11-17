import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/services/api"
import { MovimentacoesTable } from "./MovimentacoesTable"
import { useMovimentacoes, type Movement } from "./useMovimentacoes"
import { InfiniteProductSelect } from "./InfiniteProductSelect"

export default function MovimentacoesPage() {
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Movement | null>(null)

    const [reload, setReload] = useState(0)

    const [productId, setProductId] = useState("")
    const [movementType, setMovementType] = useState<"ENTRY" | "EXIT">("ENTRY")
    const [quantity, setQuantity] = useState("")
    const [movementDate, setMovementDate] = useState("")

    const { data } = useMovimentacoes(reload)

    const resetForm = () => {
        setProductId("")
        setQuantity("")
        setMovementType("ENTRY")
        setMovementDate("")
        setEditing(null)
    }

    const openEditor = (m: Movement) => {
        setEditing(m)
        setProductId(String(m.product.id))
        setMovementType(m.movementType)
        setQuantity(String(m.quantity))
        setMovementDate(m.movementDate)
        setOpen(true)
    }

    const handleSave = async () => {
        try {
            const payload = {
                productId: Number(productId),
                quantity: Number(quantity),
                movementType,
                movementDate,
            }

            if (editing) {
                await api.put(`/movements/${editing.id}`, payload)
                toast.success("Movimentação atualizada!", { position: "bottom-right" })
            } else {
                await api.post("/movements", payload)
                toast.success("Movimentação criada!", { position: "bottom-right" })
            }

            resetForm()
            setOpen(false)
            setReload(r => r + 1)
        } catch {
            toast.error("Erro ao salvar movimentação", { position: "bottom-right" })
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Movimentações</h2>
                    <p className="text-gray-500">Controle de entradas e saídas</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Registrar movimentação
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar movimentação" : "Nova movimentação"}</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3 mt-2">
                            <div>
                                <Label className="pb-1">Produto</Label>
                                <InfiniteProductSelect value={productId} onChange={setProductId} />
                            </div>

                            <div>
                                <Label className="pb-1">Tipo</Label>
                                <Select value={movementType} onValueChange={(v: any) => setMovementType(v as "ENTRY" | "EXIT")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENTRY">Entrada</SelectItem>
                                        <SelectItem value="EXIT">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="pb-1">Quantidade</Label>
                                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                            </div>

                            <div>
                                <Label className="pb-1">Data</Label>
                                <Input type="date" value={movementDate} onChange={(e) => setMovementDate(e.target.value)} />
                            </div>

                            <Button className="w-full mt-2" onClick={handleSave}>Salvar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <MovimentacoesTable data={data} reload={() => setReload(r => r + 1)} onEdit={openEditor} />
        </div>
    )
}
