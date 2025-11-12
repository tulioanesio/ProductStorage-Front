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
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ProdutosTable } from "../../components/ProdutosTable"

export default function ProdutosPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Produtos</h2>
                    <p className="text-gray-500">Gerencie todos os produtos do estoque</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar produto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo produto</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <Input placeholder="Nome do produto" />
                            <Input placeholder="Preço unitário" type="number" />
                            <Input placeholder="Unidade de medida" />
                            <Input placeholder="Estoque disponível" type="number" />
                            <Input placeholder="Quantidade mínima" type="number" />
                            <Input placeholder="Quantidade máxima" type="number" />
                            <Input placeholder="Categoria" />
                            <Button onClick={() => setOpen(false)}>Salvar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <ProdutosTable />
        </div>
    )
}
