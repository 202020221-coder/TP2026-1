"use client"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { XCircle, Save, ArrowLeft } from "lucide-react"

export function InventarioForm({ itemId, onCancel }: { itemId: string | null; onCancel: () => void }) {
  const isEditing = !!itemId
  const title = isEditing ? `Editar Objeto: ${itemId}` : "Registrar Nuevo Objeto"

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="p-6 space-y-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={onCancel}>
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" /> {isEditing ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Objeto</Label>
            <Input id="nombre" placeholder="Ej: Extintor CO2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fabricante">Fabricante</Label>
            <Input id="fabricante" placeholder="Ej: Kidde" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero_serial">Número de Serie</Label>
            <Input id="numero_serial" placeholder="Opcional" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lugar_almacenaje">Lugar de Almacenaje</Label>
            <Input id="lugar_almacenaje" placeholder="Camión, Depósito..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input id="cantidad" type="number" min="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <select id="estado" className="border rounded-md p-2 w-full">
              <option value="disponible">Disponible</option>
              <option value="en_reparacion">En reparación</option>
              <option value="retirado">Retirado</option>
              <option value="daniado">Dañado</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea id="observaciones" placeholder="Detalles o notas adicionales..." />
        </div>
      </div>
    </div>
  )
}
