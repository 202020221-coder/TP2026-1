"use client"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import { XCircle, Save, Plus, ArrowLeft, Upload, X } from "lucide-react"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/shared/components/ui/file-upload";
import React from "react"
 

export function PersonalForm({ personnelId, onCancel }: { personnelId: string | null; onCancel: () => void }) {
  const isEditing = !!personnelId
  const title = isEditing ? `Editar Personal: ${personnelId}` : "Registrar Nuevo Personal"
  const [files, setFiles] = React.useState<File[]>([]);
 
  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length >= 2) {
        return "You can only upload up to 2 files";
      }
 
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed";
      }
 
      // Validate file size (max 2MB)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      }
 
      return null;
    },
    [files],
  );
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

      <div className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="certs">Certificaciones</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
          </TabsList>

          {/* Pestaña 1: Información Básica */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" defaultValue={isEditing ? "Juan Pérez" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">DNI/ID</Label>
                <Input id="dni" defaultValue={isEditing ? "12345678" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol/Puesto</Label>
                <Input id="role" defaultValue={isEditing ? "Desarrollador Senior" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Fecha de Ingreso</Label>
                <Input id="joinDate" type="date" defaultValue={isEditing ? "2020-01-15" : ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea id="address" placeholder="Av. Principal 123..." />
            </div>
          </TabsContent>

          {/* Pestaña 2: Certificaciones */}
          <TabsContent value="certs" className="space-y-4 pt-4">
            <div className="flex justify-center">
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onFileValidate={onFileValidate}
      onFileReject={()=>{}}
      accept="image/*"
      maxFiles={2}
      className="w-full max-w-md"
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 2 files)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
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
              <Button variant="outline" className="text-sm bg-transparent">
                <Plus className="w-4 h-4 mr-2" /> Asignar a Proyecto
              </Button>
            </div>
            {/* Aquí se integraría un sub-componente de tabla editable para Asignaciones */}
            <p className="text-muted-foreground">Tabla con Proyecto, Rol, Fecha de Inicio, Porcentaje de Dedicación.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
