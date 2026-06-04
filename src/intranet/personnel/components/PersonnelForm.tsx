import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { XCircle, Save, Plus, ArrowLeft, Loader2, Upload, FileText, Trash2, Eye } from "lucide-react"
import { personnelService } from "../services/personnel.service"
import { friendlyError } from "../lib/friendly-error"
import type {
  PersonalInput,
  EstadoPersonal,
  SeguroVidaLey,
  Certificacion,
} from "../types"

interface FormState {
  DNI: string
  Nombre: string
  Apellido: string
  Genero: string
  RUC: string
  fecha_nacimiento: string
  correo_contacto: string
  telefono_contacto: string
  estado_civil: string
  distrito_residencia: string
  seguro_vida_ley: "" | SeguroVidaLey
  aficiones: string
  experiencia: string
  comentarios: string
  estado: "" | EstadoPersonal
  alergias: string
  condicion_medica: string
  profesion: string
  nro_cta_bancaria: string
}

const emptyForm: FormState = {
  DNI: "",
  Nombre: "",
  Apellido: "",
  Genero: "",
  RUC: "",
  fecha_nacimiento: "",
  correo_contacto: "",
  telefono_contacto: "",
  estado_civil: "",
  distrito_residencia: "",
  seguro_vida_ley: "",
  aficiones: "",
  experiencia: "",
  comentarios: "",
  estado: "disponible",
  alergias: "",
  condicion_medica: "",
  profesion: "",
  nro_cta_bancaria: "",
}

const buildPayload = (f: FormState): PersonalInput => ({
  Nombre: f.Nombre.trim(),
  Apellido: f.Apellido.trim(),
  Genero: f.Genero || undefined,
  RUC: f.RUC || undefined,
  fecha_nacimiento: f.fecha_nacimiento || undefined,
  correo_contacto: f.correo_contacto || undefined,
  telefono_contacto: f.telefono_contacto || undefined,
  estado_civil: f.estado_civil || undefined,
  distrito_residencia: f.distrito_residencia || undefined,
  seguro_vida_ley: f.seguro_vida_ley || undefined,
  aficiones: f.aficiones || undefined,
  experiencia: f.experiencia || undefined,
  comentarios: f.comentarios || undefined,
  estado: f.estado || undefined,
  alergias: f.alergias || undefined,
  condicion_medica: f.condicion_medica || undefined,
  profesion: f.profesion || undefined,
  nro_cta_bancaria: f.nro_cta_bancaria || undefined,
})

export function PersonnelForm({
  personnelId,
  onCancel,
  canEdit,
}: {
  personnelId: string | null
  onCancel: () => void
  canEdit: boolean
}) {
  const isEditing = !!personnelId

  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [loading, setLoading] = React.useState(isEditing)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  // Photo
  const [fotoFile, setFotoFile] = React.useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = React.useState<string | null>(null)
  const fotoInputRef = React.useRef<HTMLInputElement>(null)

  // CV
  const [cvFile, setCvFile] = React.useState<File | null>(null)
  const [hasExistingCv, setHasExistingCv] = React.useState(false)
  const cvInputRef = React.useRef<HTMLInputElement>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ---- Load on edit ----
  React.useEffect(() => {
    if (!personnelId) {
      setForm(emptyForm)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    personnelService
      .getById(personnelId)
      .then((p) => {
        if (cancelled) return
        setForm({
          DNI: p.DNI,
          Nombre: p.Nombre,
          Apellido: p.Apellido,
          Genero: p.Genero ?? "",
          RUC: p.RUC ?? "",
          fecha_nacimiento: p.fecha_nacimiento ?? "",
          correo_contacto: p.correo_contacto ?? "",
          telefono_contacto: p.telefono_contacto ?? "",
          estado_civil: p.estado_civil ?? "",
          distrito_residencia: p.distrito_residencia ?? "",
          seguro_vida_ley: p.seguro_vida_ley ?? "",
          aficiones: p.aficiones ?? "",
          experiencia: p.experiencia ?? "",
          comentarios: p.comentarios ?? "",
          estado: p.estado ?? "",
          alergias: p.alergias ?? "",
          condicion_medica: p.condicion_medica ?? "",
          profesion: p.profesion ?? "",
          nro_cta_bancaria: p.nro_cta_bancaria ?? "",
        })
        setHasExistingCv(!!p.cv)
      })
      .catch((e: unknown) =>
        !cancelled && setLoadError(friendlyError(e, "No se pudo cargar el colaborador")),
      )
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [personnelId])

  // ---- Existing photo preview (fetched with auth) ----
  React.useEffect(() => {
    if (!personnelId) return
    let url: string | null = null
    let cancelled = false
    personnelService
      .getFotoUrl(personnelId)
      .then((u) => {
        if (cancelled) {
          URL.revokeObjectURL(u)
          return
        }
        url = u
        setFotoPreview(u)
      })
      .catch(() => {
        /* no photo yet — ignore */
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [personnelId])

  const handleFotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.warning("La foto debe ser una imagen")
      return
    }
    setFotoFile(file)
    setFotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.warning("El CV debe ser un archivo PDF")
      return
    }
    setCvFile(file)
  }

  const openCv = async () => {
    if (!personnelId) return
    try {
      const url = await personnelService.getCvUrl(personnelId)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (e: unknown) {
      toast.error(friendlyError(e, "No se pudo abrir el CV"))
    }
  }

  // ---- Submit (create / update) — this is the missing handler ----
  const handleSave = async () => {
    if (!canEdit) return
    if (!form.Nombre.trim() || !form.Apellido.trim()) {
      toast.warning("Nombre y Apellido son obligatorios")
      return
    }
    const dni = isEditing ? personnelId! : form.DNI.trim()
    if (!isEditing && !dni) {
      toast.warning("El DNI es obligatorio para registrar un colaborador")
      return
    }

    setSaving(true)
    try {
      const payload = buildPayload(form)
      if (isEditing) {
        await personnelService.update(dni, payload)
      } else {
        await personnelService.create(dni, payload)
      }

      // Uploads run after the profile exists (endpoints are keyed by DNI).
      if (fotoFile) {
        try {
          await personnelService.uploadFoto(dni, fotoFile)
        } catch (e: unknown) {
          toast.error(friendlyError(e, "El perfil se guardó, pero la foto no se pudo subir"))
        }
      }
      if (cvFile) {
        try {
          await personnelService.uploadCv(dni, cvFile)
        } catch (e: unknown) {
          toast.error(friendlyError(e, "El perfil se guardó, pero el CV no se pudo subir"))
        }
      }

      toast.success(isEditing ? "Colaborador actualizado" : "Colaborador registrado")
      onCancel()
    } catch (e: unknown) {
      toast.error(friendlyError(e, "No se pudo guardar el colaborador"))
    } finally {
      setSaving(false)
    }
  }

  const title = isEditing
    ? `${canEdit ? "Editar" : "Ver"} Personal: ${form.Nombre || personnelId}`
    : canEdit
      ? "Registrar Nuevo Personal"
      : "Ver Personal"

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
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              {canEdit ? (
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave} disabled={saving || loading}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? "Actualizar" : "Registrar"}
                </Button>
              ) : null}
            </div>
          </div>
          {!canEdit ? (
            <p className="text-sm text-muted-foreground">
              Vista de solo lectura. Este rol puede consultar la ficha, pero no modificarla.
            </p>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Cargando colaborador...
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" onClick={onCancel}>
            Volver al listado
          </Button>
        </div>
      ) : (
        <div className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Información Especifica</TabsTrigger>
              <TabsTrigger value="certs">Documentos</TabsTrigger>
              <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
              <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
            </TabsList>

            {/* Pestaña 1: Información Específica */}
            <TabsContent value="basic" className="space-y-6 pt-4">
              {/* Foto / avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center border">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Foto del colaborador" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-1">Sin foto</span>
                  )}
                </div>
                {canEdit ? (
                  <div className="space-y-1">
                    <input
                      ref={fotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFotoSelect}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fotoInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" /> {fotoPreview ? "Cambiar foto" : "Subir foto"}
                    </Button>
                    {fotoFile ? (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{fotoFile.name}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI/ID</Label>
                  <Input
                    id="dni"
                    value={form.DNI}
                    onChange={(e) => set("DNI", e.target.value)}
                    disabled={!canEdit || isEditing}
                    placeholder="12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profesion">Profesión / Puesto</Label>
                  <Input
                    id="profesion"
                    value={form.profesion}
                    onChange={(e) => set("profesion", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={form.Nombre}
                    onChange={(e) => set("Nombre", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={form.Apellido}
                    onChange={(e) => set("Apellido", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Género</Label>
                  <Input
                    id="genero"
                    value={form.Genero}
                    onChange={(e) => set("Genero", e.target.value)}
                    disabled={!canEdit}
                    placeholder="Masculino / Femenino"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={form.fecha_nacimiento}
                    onChange={(e) => set("fecha_nacimiento", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo de Contacto</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={form.correo_contacto}
                    onChange={(e) => set("correo_contacto", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono de Contacto</Label>
                  <Input
                    id="telefono"
                    value={form.telefono_contacto}
                    onChange={(e) => set("telefono_contacto", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input
                    id="ruc"
                    value={form.RUC}
                    onChange={(e) => set("RUC", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado_civil">Estado Civil</Label>
                  <Input
                    id="estado_civil"
                    value={form.estado_civil}
                    onChange={(e) => set("estado_civil", e.target.value)}
                    disabled={!canEdit}
                    placeholder="Soltero / Casado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito de Residencia</Label>
                  <Input
                    id="distrito"
                    value={form.distrito_residencia}
                    onChange={(e) => set("distrito_residencia", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta">Nro. Cuenta Bancaria</Label>
                  <Input
                    id="cta"
                    value={form.nro_cta_bancaria}
                    onChange={(e) => set("nro_cta_bancaria", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experiencia">Experiencia</Label>
                <Textarea
                  id="experiencia"
                  value={form.experiencia}
                  onChange={(e) => set("experiencia", e.target.value)}
                  disabled={!canEdit}
                  placeholder="Experiencia laboral relevante..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aficiones">Aficiones</Label>
                <Textarea
                  id="aficiones"
                  value={form.aficiones}
                  onChange={(e) => set("aficiones", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Textarea
                  id="comentarios"
                  value={form.comentarios}
                  onChange={(e) => set("comentarios", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </TabsContent>

            {/* Pestaña 2: Documentos */}
            <TabsContent value="certs" className="space-y-6 pt-4">
              {/* CV */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">Curriculum Vitae (PDF)</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canEdit ? (
                    <>
                      <input
                        ref={cvInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleCvSelect}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => cvInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" /> {hasExistingCv || cvFile ? "Reemplazar CV" : "Subir CV"}
                      </Button>
                    </>
                  ) : null}
                  {isEditing && hasExistingCv ? (
                    <Button type="button" variant="ghost" size="sm" onClick={openCv}>
                      <Eye className="w-4 h-4 mr-2" /> Ver CV actual
                    </Button>
                  ) : null}
                  {cvFile ? (
                    <span className="text-xs text-muted-foreground truncate max-w-[260px]">
                      Nuevo: {cvFile.name}
                    </span>
                  ) : null}
                </div>
                {!isEditing ? (
                  <p className="text-xs text-muted-foreground">
                    El CV se subirá automáticamente al registrar el colaborador.
                  </p>
                ) : null}
              </div>

              {/* Certificaciones */}
              <CertificacionesPanel dni={personnelId} canEdit={canEdit} />
            </TabsContent>

            {/* Pestaña 3: Disponibilidad */}
            <TabsContent value="availability" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={form.estado || undefined}
                    onValueChange={(v) => set("estado", v as EstadoPersonal)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="en trabajo">En trabajo</SelectItem>
                      <SelectItem value="inhabilitado">Inhabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seguro">Seguro de Vida Ley</Label>
                  <Select
                    value={form.seguro_vida_ley || undefined}
                    onValueChange={(v) => set("seguro_vida_ley", v as SeguroVidaLey)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="seguro">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicion_medica">Condición Médica</Label>
                <Textarea
                  id="condicion_medica"
                  value={form.condicion_medica}
                  onChange={(e) => set("condicion_medica", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Textarea
                  id="alergias"
                  value={form.alergias}
                  onChange={(e) => set("alergias", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </TabsContent>

            {/* Pestaña 4: Asignaciones */}
            <TabsContent value="assignments" className="space-y-4 pt-4">
              <p className="text-muted-foreground text-sm">
                Las asignaciones a proyectos se gestionan desde el módulo de{" "}
                <span className="font-medium">Organizar Personal</span> (jornadas por proyecto).
                Aquí solo se muestra la ficha del colaborador.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

// ---- Certificaciones sub-panel ----

function CertificacionesPanel({ dni, canEdit }: { dni: string | null; canEdit: boolean }) {
  const [items, setItems] = React.useState<Certificacion[]>([])
  const [loading, setLoading] = React.useState(false)
  const [adding, setAdding] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [draft, setDraft] = React.useState({ nombre: "", institucion: "", fecha_validez: "" })
  const [pdfFile, setPdfFile] = React.useState<File | null>(null)
  const pdfInputRef = React.useRef<HTMLInputElement>(null)

  const load = React.useCallback(() => {
    if (!dni) return
    setLoading(true)
    personnelService
      .listCertificaciones(dni)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [dni])

  React.useEffect(() => {
    load()
  }, [load])

  if (!dni) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Guarda primero el colaborador para poder agregar certificaciones y sus PDF.
        </p>
      </div>
    )
  }

  const handleAdd = async () => {
    if (!draft.nombre.trim() || !draft.institucion.trim()) {
      toast.warning("Nombre e institución de la certificación son obligatorios")
      return
    }
    setSaving(true)
    try {
      const created = await personnelService.createCertificacion(dni, {
        nombre: draft.nombre.trim(),
        institucion: draft.institucion.trim(),
        fecha_validez: draft.fecha_validez || undefined,
      })
      if (pdfFile && created.id) {
        try {
          await personnelService.uploadCertificacionPdf(dni, created.id, pdfFile)
        } catch (e: unknown) {
          toast.error(friendlyError(e, "La certificación se creó, pero el PDF no se pudo subir"))
        }
      }
      toast.success("Certificación agregada")
      setAdding(false)
      setDraft({ nombre: "", institucion: "", fecha_validez: "" })
      setPdfFile(null)
      load()
    } catch (e: unknown) {
      toast.error(friendlyError(e, "No se pudo agregar la certificación"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cert: Certificacion) => {
    if (!window.confirm(`¿Eliminar la certificación "${cert.nombre}"?`)) return
    try {
      await personnelService.deleteCertificacion(dni, cert.id)
      toast.success("Certificación eliminada")
      setItems((prev) => prev.filter((c) => c.id !== cert.id))
    } catch (e: unknown) {
      toast.error(friendlyError(e, "No se pudo eliminar la certificación"))
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Certificaciones</h3>
        {canEdit && !adding ? (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Certificación
          </Button>
        ) : null}
      </div>

      {canEdit && adding ? (
        <div className="rounded-md border bg-muted/30 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nombre</Label>
              <Input
                value={draft.nombre}
                onChange={(e) => setDraft((d) => ({ ...d, nombre: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Institución</Label>
              <Input
                value={draft.institucion}
                onChange={(e) => setDraft((d) => ({ ...d, institucion: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fecha de Validez</Label>
              <Input
                type="date"
                value={draft.fecha_validez}
                onChange={(e) => setDraft((d) => ({ ...d, fecha_validez: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">PDF (opcional)</Label>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f && f.type !== "application/pdf") {
                    toast.warning("El archivo debe ser un PDF")
                    return
                  }
                  setPdfFile(f ?? null)
                }}
              />
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => pdfInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> {pdfFile ? pdfFile.name : "Seleccionar PDF"}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAdding(false)
                setDraft({ nombre: "", institucion: "", fecha_validez: "" })
                setPdfFile(null)
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Guardar
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando certificaciones...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin certificaciones registradas.</p>
      ) : (
        <ul className="divide-y">
          {items.map((cert) => (
            <li key={cert.id} className="flex items-center justify-between py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{cert.nombre}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {cert.institucion}
                  {cert.fecha_validez ? ` · válido hasta ${cert.fecha_validez}` : ""}
                </p>
              </div>
              {canEdit ? (
                <button
                  onClick={() => handleDelete(cert)}
                  className="p-1 rounded hover:bg-red-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
