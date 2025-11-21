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
import { useState, useMemo } from "react"
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
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const resetForm = () => {
    setName("")
    setSize("")
    setPackaging("")
    setEditing(null)
    setTouched({})
  }

  const openEditor = (cat: any) => {
    setEditing(cat)
    setName(cat?.name ?? "")
    setSize(cat?.size ?? "")
    setPackaging(cat?.packaging ?? "")
    setOpen(true)
    setTouched({})
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validation = useMemo(() => {
    const errors: Record<string, string> = {}

    if (!name.trim()) errors.name = "Nome da categoria é obrigatório"
    if (!size.trim()) errors.size = "Tamanho é obrigatório"
    if (!packaging.trim()) errors.packaging = "Embalagem é obrigatória"

    return errors
  }, [name, size, packaging])

  const isFormValid = useMemo(() => Object.keys(validation).length === 0, [validation])

  const handleSave = async () => {
    try {
      if (!isFormValid) return

      const payload = { name, size, packaging }

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

  const renderInput = (label: string, value: string, onChange: (v: any) => void, keyName: string) => {
    const showError = touched[keyName] && validation[keyName]

    return (
      <div className="grid gap-1">
        <Label>{label}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
              {renderInput("Nome da categoria", name, setName, "name")}
              {renderInput("Tamanho", size, setSize, "size")}
              {renderInput("Embalagem", packaging, setPackaging, "packaging")}

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

      <CategoriasTable reload={reload} onEdit={openEditor} />
    </div>
  )
}
