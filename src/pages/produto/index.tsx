import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useMemo } from "react"
import { ProdutosTable } from "../../components/table/ProdutosTable"
import { toast } from "sonner"
import { api } from "@/services/api"

export default function ProdutosPage() {
    const [open, setOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [reload, setReload] = useState(0)

    const [name, setName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [unitOfMeasure, setUnitOfMeasure] = useState("")
    const [availableStock, setAvailableStock] = useState("")
    const [minQuantity, setMinQuantity] = useState("")
    const [maxQuantity, setMaxQuantity] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

    const [categorias, setCategorias] = useState<any[]>([])
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    useEffect(() => {
        api.get("/categories").then((res) => {
            if (Array.isArray(res.data.content)) setCategorias(res.data.content)
            else setCategorias([])
        })
    }, [])

    const resetForm = () => {
        setName("")
        setUnitPrice("")
        setUnitOfMeasure("")
        setAvailableStock("")
        setMinQuantity("")
        setMaxQuantity("")
        setSelectedCategory(undefined)
        setEditingProduct(null)
        setTouched({})
    }

    const openEditor = (product: any) => {
        setEditingProduct(product)
        setName(product.name)
        setUnitPrice(String(product.unitPrice))
        setUnitOfMeasure(product.unitOfMeasure)
        setAvailableStock(String(product.availableStock))
        setMinQuantity(String(product.minQuantity))
        setMaxQuantity(String(product.maxQuantity))
        setSelectedCategory(String(product.category?.id ?? ""))
        setOpen(true)
        setTouched({})
    }

    const validation = useMemo(() => {
        const errors: Record<string, string> = {}

        if (!name.trim()) errors.name = "Nome é obrigatório"
        if (!unitPrice || isNaN(Number(unitPrice)) || Number(unitPrice) <= 0)
            errors.unitPrice = "Preço deve ser maior que 0"
        if (!unitOfMeasure.trim()) errors.unitOfMeasure = "Unidade de medida é obrigatória"
        if (!availableStock || isNaN(Number(availableStock)) || Number(availableStock) < 0)
            errors.availableStock = "Estoque deve ser 0 ou maior"
        if (!minQuantity || isNaN(Number(minQuantity)) || Number(minQuantity) < 0)
            errors.minQuantity = "Quantidade mínima deve ser 0 ou maior"
        if (!maxQuantity || isNaN(Number(maxQuantity)) || Number(maxQuantity) <= 0)
            errors.maxQuantity = "Quantidade máxima deve ser maior que 0"
        if (!errors.minQuantity && !errors.maxQuantity && Number(minQuantity) > Number(maxQuantity))
            errors.minQuantity = "Min não pode ser maior que Max"
        return errors
    }, [name, unitPrice, unitOfMeasure, availableStock, minQuantity, maxQuantity])

    const isFormValid = useMemo(() => Object.keys(validation).length === 0, [validation])

    const handleSave = async () => {
        try {
            if (!isFormValid) return

            const payload = {
                name,
                unitPrice: Number(unitPrice),
                unitOfMeasure,
                availableStock: Number(availableStock),
                minStockQuantity: Number(minQuantity),
                maxStockQuantity: Number(maxQuantity),
                categoryId: selectedCategory ? Number(selectedCategory) : null,
            }

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload)
                toast.success("Produto atualizado!", { position: "bottom-right" })
            } else {
                await api.post("/products", payload)
                toast.success("Produto criado!", { position: "bottom-right" })
            }

            setOpen(false)
            resetForm()
            setReload((r) => r + 1)
        } catch {
            toast.error("Erro ao salvar produto", { position: "bottom-right" })
        }
    }

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }

    const renderInput = (
        label: string,
        value: string,
        onChange: (v: any) => void,
        nameKey: string,
        type: string = "text"
    ) => {
        const showError = touched[nameKey] && validation[nameKey]

        return (
            <div className="grid gap-1">
                <Label>{label}</Label>
                <Input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => handleBlur(nameKey)}
                    className={showError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                />
                {showError && <span className="text-red-500 text-sm">{validation[nameKey]}</span>}
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Produtos</h2>
                    <p className="text-gray-500">Gerencie todos os produtos do estoque</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Registrar produto
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Editar produto" : "Novo produto"}</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3">
                            {renderInput("Nome do produto", name, setName, "name")}
                            {renderInput("Preço unitário", unitPrice, setUnitPrice, "unitPrice", "number")}
                            {renderInput("Unidade de medida", unitOfMeasure, setUnitOfMeasure, "unitOfMeasure")}
                            {renderInput("Estoque disponível", availableStock, setAvailableStock, "availableStock", "number")}
                            {renderInput("Quantidade mínima", minQuantity, setMinQuantity, "minQuantity", "number")}
                            {renderInput("Quantidade máxima", maxQuantity, setMaxQuantity, "maxQuantity", "number")}

                            <div className="grid gap-1">
                                <Label>Categoria</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger
                                        onBlur={() => handleBlur("category")}
                                        className={
                                            "w-full " +
                                            (touched.category && validation.category
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                : "")
                                        }
                                    >
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {touched.category && validation.category && (
                                    <span className="text-red-500 text-sm">{validation.category}</span>
                                )}
                            </div>

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

            <ProdutosTable onEdit={openEditor} reload={reload} />
        </div>
    )
}
