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
import { useState, useEffect } from "react"
import { ProdutosTable } from "./ProdutosTable"
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

    useEffect(() => {
        api.get("/categories").then((res) => {
            if (Array.isArray(res.data.content)) {
                setCategorias(res.data.content)
            } else {
                setCategorias([])
            }
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
    }

    const handleSave = async () => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, {
                    name,
                    unitPrice: Number(unitPrice),
                    unitOfMeasure,
                    availableStock: Number(availableStock),
                    minStockQuantity: Number(minQuantity),
                    maxStockQuantity: Number(maxQuantity),
                    categoryId: selectedCategory ? Number(selectedCategory) : null,
                })

                toast.success("Produto atualizado!", { position: "bottom-right" })
            } else {
                await api.post("/products", {
                    name,
                    unitPrice: Number(unitPrice),
                    unitOfMeasure,
                    availableStock: Number(availableStock),
                    minStockQuantity: Number(minQuantity),
                    maxStockQuantity: Number(maxQuantity),
                    categoryId: selectedCategory ? Number(selectedCategory) : null,
                })

                toast.success("Produto criado!", { position: "bottom-right" })
            }

            setOpen(false)
            resetForm()

            setReload((r) => r + 1)

        } catch {
            toast.error("Erro ao salvar produto", { position: "bottom-right" })
        }
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
                            <div className="grid gap-1">
                                <Label>Nome do produto</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Preço unitário</Label>
                                <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Unidade de medida</Label>
                                <Input value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Estoque disponível</Label>
                                <Input type="number" value={availableStock} onChange={(e) => setAvailableStock(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Quantidade mínima</Label>
                                <Input type="number" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Quantidade máxima</Label>
                                <Input type="number" value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value)} />
                            </div>

                            <div className="grid gap-1">
                                <Label>Categoria</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full">
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
                            </div>

                            <Button className="w-full mt-2" onClick={handleSave}>
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
