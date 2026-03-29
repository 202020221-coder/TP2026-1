"use client"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { XCircle, Save, ArrowLeft } from "lucide-react"

export function CamionesForm({ camionId, onCancel }: { camionId?: string | null; onCancel?: () => void }) {
  const isEditing = !!camionId
  const title = isEditing ? `Editar Camión: ${camionId}` : "Registrar Nuevo Camión"

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="p-6 space-y-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          )}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="space-x-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  <XCircle className="w-4 h-4 mr-2" /> Cancelar
                </Button>
              )}
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
            <Label htmlFor="placa">Placa</Label>
            <Input id="placa" placeholder="ABC-123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">Marca / Fabricante</Label>
            <Input id="marca" placeholder="Volvo, Scania..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaUltimoChequeo">Fecha Último Chequeo</Label>
            <Input id="fechaUltimoChequeo" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <select id="estado" className="border rounded-md p-2 w-full">
              <option value="">-- Selecciona --</option>
              <option value="disponible">Disponible</option>
              <option value="en_reparacion">En reparación</option>
              <option value="averiado">Averiado</option>
              <option value="inventario_faltante">Inventario faltante</option>
              <option value="retirado_definitivo">Retirado definitivo</option>
              <option value="en_proyecto">En proyecto</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea id="observaciones" placeholder="Notas adicionales..." />
          </div>
        </div>
      </div>
    </div>
  )
}
