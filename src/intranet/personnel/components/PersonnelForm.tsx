import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import { XCircle, Save, Plus, ArrowLeft } from "lucide-react"

export function PersonnelForm({ personnelId, onCancel, canEdit }: { personnelId: string | null; onCancel: () => void; canEdit: boolean }) {
  const isEditing = !!personnelId
  const title = isEditing ? `${canEdit ? "Editar" : "Ver"} Personal: ${personnelId}` : canEdit ? "Registrar Nuevo Personal" : "Ver Personal"

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
              {canEdit ? (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" /> {isEditing ? "Actualizar" : "Registrar"}
                </Button>
              ) : null}
            </div>
          </div>
          {!canEdit ? (
            <p className="text-sm text-muted-foreground">Vista de solo lectura. Este rol puede consultar la ficha, pero no modificarla.</p>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Especifica</TabsTrigger>
            <TabsTrigger value="certs">Documentos</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
          </TabsList>

          {/* Pestaña 1: Información Básica */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" defaultValue={isEditing ? "Juan Pérez" : ""} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">DNI/ID</Label>
                <Input id="dni" defaultValue={isEditing ? "12345678" : ""} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol/Puesto</Label>
                <Input id="role" defaultValue={isEditing ? "Desarrollador Senior" : ""} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Fecha de Ingreso</Label>
                <Input id="joinDate" type="date" defaultValue={isEditing ? "2020-01-15" : ""} disabled={!canEdit} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea id="address" placeholder="Av. Principal 123..." disabled={!canEdit} />
            </div>
          </TabsContent>

          {/* Pestaña 2: Certificaciones */}
          <TabsContent value="certs" className="space-y-4 pt-4">
            <div className="flex justify-end">
              {canEdit ? (
                <Button variant="outline" className="text-sm bg-transparent">
                  <Plus className="w-4 h-4 mr-2" /> Agregar Certificación
                </Button>
              ) : null}
            </div>
            {/* Aquí se integraría un sub-componente de tabla editable para Certificaciones */}
            <p className="text-muted-foreground">
              Tabla con Certificación, Entidad, Fecha de Obtención, y botón para subir archivo.
            </p>
          </TabsContent>

          {/* Pestaña 3: Disponibilidad */}
          <TabsContent value="availability" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pctAvail">Porcentaje de Disponibilidad (%)</Label>
                <Input id="pctAvail" type="number" min="0" max="100" defaultValue="80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacation">Días de Vacaciones Pendientes</Label>
                <Input id="vacation" type="number" defaultValue="15" disabled={!isEditing} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Aquí se podría integrar un selector de fechas para registrar ausencias/permisos futuros.
            </p>
          </TabsContent>

          {/* Pestaña 4: Asignaciones a Proyectos */}
          <TabsContent value="assignments" className="space-y-4 pt-4">
            <div className="flex justify-end">
              {canEdit ? (
                <Button variant="outline" className="text-sm bg-transparent">
                  <Plus className="w-4 h-4 mr-2" /> Asignar a Proyecto
                </Button>
              ) : null}
            </div>
            {/* Aquí se integraría un sub-componente de tabla editable para Asignaciones */}
            <p className="text-muted-foreground">Tabla con Proyecto, Rol, Fecha de Inicio, Porcentaje de Dedicación.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
