"use client"

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
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { api } from "@/services/api"
import { MovimentacoesTable } from "../../components/table/MovimentacoesTable"
import { useMovimentacoes, type Movement } from "../../hooks/useMovimentacoes"
import { InfiniteProductSelect } from "../../components/InfiniteProductSelect"

export default function MovimentacoesPage() {
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Movement | null>(null)
    const [reload, setReload] = useState(0)

    const [productId, setProductId] = useState("")
    const [movementType, setMovementType] = useState<"ENTRY" | "EXIT">("ENTRY")
    const [quantity, setQuantity] = useState("")
    const [movementDate, setMovementDate] = useState("")
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const resetForm = () => {
        setProductId("")
        setQuantity("")
        setMovementType("ENTRY")
        setMovementDate("")
        setEditing(null)
        setTouched({})
    }

    const openEditor = (m: Movement) => {
        setEditing(m)
        setProductId(String(m.product.id))
        setMovementType(m.movementType)
        setQuantity(String(m.quantity))
        setMovementDate(m.movementDate)
        setOpen(true)
        setTouched({})
    }

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const validation = useMemo(() => {
        const errors: Record<string, string> = {}

        if (!productId) errors.productId = "Selecione um produto"

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
            errors.quantity = "Quantidade deve ser maior que 0"

        if (!movementDate) {
            errors.movementDate = "Data é obrigatória"
        } else {
            const year = new Date(movementDate).getFullYear()
            if (isNaN(year) || year < 1960) {
                errors.movementDate = "Ano inválido. Deve ser 1960 ou posterior."
            }
        }

        return errors
    }, [productId, quantity, movementDate])

    const isFormValid = useMemo(() => Object.keys(validation).length === 0, [validation])

    const handleSave = async () => {
        try {
            if (!isFormValid) return

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
        } catch (err: any) {
            if (err.response?.data?.apierro?.mensagemDetalhada) {
                toast.error(err.response.data.apierro.mensagemDetalhada, { position: "bottom-right" })
            } else {
                toast.error("Erro ao salvar movimentação", { position: "bottom-right" })
            }
        }
    }

    const renderInput = (label: string, value: string, onChange: (v: any) => void, keyName: string, type: string = "text") => {
        const showError = touched[keyName] && validation[keyName]

        return (
            <div className="grid gap-1">
                <Label className="pb-1">{label}</Label>
                <Input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={() => handleBlur(keyName)}
                    className={showError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                />
                {showError && <span className="text-red-500 text-sm">{validation[keyName]}</span>}
            </div>
        )
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
                            <div className="grid gap-1">
                                <Label className="pb-1">Produto</Label>
                                <div
                                    className={touched.productId && validation.productId ? "border border-red-500 rounded" : ""}
                                    onBlur={() => handleBlur("productId")}
                                >
                                    <InfiniteProductSelect value={productId} onChange={setProductId} />
                                </div>
                                {touched.productId && validation.productId && (
                                    <span className="text-red-500 text-sm">{validation.productId}</span>
                                )}
                            </div>

                            <div>
                                <Label className="pb-1">Tipo</Label>
                                <Select
                                    value={movementType}
                                    onValueChange={(v: any) => setMovementType(v as "ENTRY" | "EXIT")}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENTRY">Entrada</SelectItem>
                                        <SelectItem value="EXIT">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {renderInput("Quantidade", quantity, setQuantity, "quantity", "number")}
                            {renderInput("Data", movementDate, setMovementDate, "movementDate", "date")}

                            <Button
                                className="w-full mt-2"
                                onClick={handleSave}
                                disabled={!isFormValid}
                                variant={!isFormValid ? "outline" : "default"}
                            >
                                Salvar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <MovimentacoesTable reload={reload} onEdit={openEditor} />
        </div>
    )
}
