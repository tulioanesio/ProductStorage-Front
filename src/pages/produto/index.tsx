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
import { useState } from "react"
import { ProdutosTable } from "../../components/ProdutosTable"

const categoriasMock = [
    { id: "1", name: "Refrigerados" },
    { id: "2", name: "Papelão" },
    { id: "3", name: "Limpeza" },
    { id: "4", name: "Bebidas" },
]

export default function ProdutosPage() {
    const [open, setOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Produtos</h2>
                    <p className="text-gray-500">Gerencie todos os produtos do estoque</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Registrar produto
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo produto</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3">
                            <div className="grid gap-1">
                                <Label htmlFor="product-name">Nome do produto</Label>
                                <Input id="product-name" placeholder="Nome do produto" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="unit-price">Preço unitário</Label>
                                <Input id="unit-price" type="number" placeholder="Preço unitário" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="unit-of-measure">Unidade de medida</Label>
                                <Input id="unit-of-measure" placeholder="Unidade de medida" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="available-stock">Estoque disponível</Label>
                                <Input id="available-stock" type="number" placeholder="Estoque disponível" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="min-qty">Quantidade mínima</Label>
                                <Input id="min-qty" type="number" placeholder="Quantidade mínima" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="max-qty">Quantidade máxima</Label>
                                <Input id="max-qty" type="number" placeholder="Quantidade máxima" />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="category-select">Categoria</Label>
                                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
                                    <SelectTrigger id="category-select" className="w-full">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriasMock.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full mt-2" onClick={() => setOpen(false)}>
                                Salvar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <ProdutosTable />
        </div>
    )
}
