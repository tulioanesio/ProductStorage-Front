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
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/services/api"
import { CategoriasTable } from "../../components/table/CategoriasTable"

export default function CategoriasPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const [reload, setReload] = useState(0)

  const [name, setName] = useState("")
  const [size, setSize] = useState("")
  const [packaging, setPackaging] = useState("")

  const resetForm = () => {
    setName("")
    setSize("")
    setPackaging("")
    setEditing(null)
  }

  const openEditor = (cat: any) => {
    setEditing(cat)
    setName(cat?.name ?? "")
    setSize(cat?.size ?? "")
    setPackaging(cat?.packaging ?? "")
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        name,
        size,
        packaging,
      }

      if (editing) {
        await api.put(`/categories/${editing.id}`, payload)
        toast.success("Categoria atualizada!", { position: "bottom-right" })
      } else {
        await api.post("/categories", payload)
        toast.success("Categoria criada!", { position: "bottom-right" })
      }

      resetForm()
      setOpen(false)
      setReload((r) => r + 1)
    } catch {
      toast.error("Erro ao salvar categoria", { position: "bottom-right" })
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Categorias</h2>
          <p className="text-gray-500">Gerencie as categorias de produto</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Registrar categoria
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label>Nome da categoria</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label>Tamanho</Label>
                <Input value={size} onChange={(e) => setSize(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label>Embalagem</Label>
                <Input value={packaging} onChange={(e) => setPackaging(e.target.value)} />
              </div>

              <Button className="w-full mt-2" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CategoriasTable reload={reload} onEdit={openEditor} />
    </div>
  )
}
