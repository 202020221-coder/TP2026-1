import { useEffect, useRef, useState, type FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  Servicio,
  CreateServicioDTO,
  ServicioFase,
  ServicioSubservicio,
} from "../interfaces/service";
import { useServicios } from "../hooks/useServicios";
import {
  uploadServicioFoto,
  saveServicioFases,
  getFasesByServicio,
  saveServicioSubservicios,
  getSubserviciosByServicio,
} from "../api/service.api";
import { validateServicioFotoFile } from "../lib/servicio-foto";
import { ServicioFotoField } from "./ServicioFotoField";
import { SubserviciosDialog, type SubservicioSeleccionado } from "./SubserviciosDialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Layers, Plus, Clock, ListChecks, Wrench, Trash2, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { AddPhasesDialog } from "@/intranet/quotation/components/reference/AddPhasesDialog";
import type { QuotationPhase } from "@/intranet/quotation/interfaces/phases.types";

interface Props {
  mode: "create" | "edit";
  servicio?: Servicio;
  onClose: () => void;
}

const EMPTY: CreateServicioDTO = {
  nombre: "", descripcion: "", precio_regular: 0, condicional_precio: "", observaciones: "",
};

interface FieldProps {
  id: keyof CreateServicioDTO;
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  value: string | number;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormField: FC<FieldProps> = ({ id, label, placeholder, type = "text", textarea = false, value, error, onChange }) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</Label>
    {textarea ? (
      <Textarea
        id={id}
        name={id}
        value={value as string}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className={`resize-none ${error ? "border-red-400" : ""}`}
      />
    ) : (
      <Input
        id={id}
        name={id}
        type={type}
        value={id === "precio_regular" && value === 0 ? "" : String(value)}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 0.01 : undefined}
        className={error ? "border-red-400" : ""}
      />
    )}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SERVICIOS_QUERY_KEY = "servicios";

export const ServicioFormModal: FC<Props> = ({ mode, servicio, onClose }) => {
  const queryClient = useQueryClient();
  const { createMutation, updateMutation } = useServicios();
  const [form, setForm] = useState<CreateServicioDTO>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateServicioDTO, string>>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoError, setFotoError] = useState<string | undefined>();
  const [fases, setFases] = useState<ServicioFase[]>([]);
  const [phasesDialogOpen, setPhasesDialogOpen] = useState(false);
  const [subservicios, setSubservicios] = useState<ServicioSubservicio[]>([]);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (mode === "edit" && servicio) {
      setForm({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio_regular: servicio.precio_regular,
        condicional_precio: servicio.condicional_precio,
        observaciones: servicio.observaciones,
      });
      // Cargar fases ya definidas (embebidas o vía endpoint dedicado).
      if (servicio.fases && servicio.fases.length > 0) {
        setFases(servicio.fases);
      } else {
        getFasesByServicio(servicio.id)
          .then((f) => setFases(f))
          .catch(() => setFases([]));
      }
      // Cargar subservicios ya asociados.
      if (servicio.subservicios && servicio.subservicios.length > 0) {
        setSubservicios(servicio.subservicios);
      } else {
        getSubserviciosByServicio(servicio.id)
          .then((s) => setSubservicios(s))
          .catch(() => setSubservicios([]));
      }
    } else {
      setForm(EMPTY);
      setFases([]);
      setSubservicios([]);
    }
    setFotoFile(null);
    setFotoError(undefined);
    setErrors({});
  }, [mode, servicio]);

  const handleFotoChange = (file: File | null) => {
    if (file) {
      const validationError = validateServicioFotoFile(file);
      if (validationError) {
        setFotoError(validationError);
        setFotoFile(null);
        return;
      }
    }
    setFotoError(undefined);
    setFotoFile(file);
  };

  const validate = () => {
    const e: Partial<Record<keyof CreateServicioDTO, string>> = {};
    if (!form.nombre.trim())             e.nombre = "El nombre es requerido";
    if (!form.descripcion.trim())        e.descripcion = "La descripción es requerida";
    if (!form.precio_regular || form.precio_regular <= 0) e.precio_regular = "Debe ser mayor a 0";
    if (!form.condicional_precio.trim()) e.condicional_precio = "Campo requerido";
    if (!form.observaciones.trim())      e.observaciones = "Campo requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "precio_regular" ? Number(value) : value }));
    if (errors[name as keyof CreateServicioDTO])
      setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      let servicioId: number;

      if (mode === "create") {
        const created = await createMutation.mutateAsync(form);
        servicioId = created.id;
      } else if (mode === "edit" && servicio) {
        await updateMutation.mutateAsync({ id: servicio.id, dto: form });
        servicioId = servicio.id;
      } else {
        return;
      }

      if (fotoFile) {
        try {
          await uploadServicioFoto(servicioId, fotoFile);
          await queryClient.invalidateQueries({ queryKey: [SERVICIOS_QUERY_KEY] });
        } catch {
          toast.error(
            mode === "create"
              ? "Servicio creado, pero no se pudo subir la foto."
              : "Servicio actualizado, pero no se pudo subir la foto.",
          );
          onClose();
          return;
        }
      }

      // Persistir las fases predeterminadas del servicio (solo si hay fases).
      if (fases.length > 0) {
        try {
          await saveServicioFases(servicioId, fases);
          await queryClient.invalidateQueries({ queryKey: [SERVICIOS_QUERY_KEY] });
          await queryClient.invalidateQueries({ queryKey: ["fases", servicioId] });
        } catch {
          toast.error(
            mode === "create"
              ? "Servicio creado, pero no se pudieron guardar las fases."
              : "Servicio actualizado, pero no se pudieron guardar las fases.",
          );
          onClose();
          return;
        }
      }

      // Persistir los subservicios y sus fases asociadas (solo si hay).
      if (subservicios.length > 0) {
        try {
          await saveServicioSubservicios(servicioId, subservicios);
          await queryClient.invalidateQueries({ queryKey: [SERVICIOS_QUERY_KEY] });
          await queryClient.invalidateQueries({ queryKey: ["subservicios", servicioId] });
        } catch {
          toast.error(
            "Servicio guardado, pero no se pudieron guardar los subservicios.",
          );
          onClose();
          return;
        }
      }

      onClose();
    } catch {
      // El Provider ya muestra el toast de error — el modal permanece abierto
    }
  };

  const totalActividades = fases.reduce((acc, f) => acc + f.activities.length, 0);
  const totalDuracion = fases.reduce((acc, f) => acc + f.duration, 0);

  const handleConfirmFases = (items: QuotationPhase[]) => {
    setFases(items);
    // Limpiar referencias de subservicios a fases que ya no existen.
    const validIds = new Set(items.map((p) => p.id));
    setSubservicios((prev) =>
      prev.map((s) => ({
        ...s,
        faseIds: s.faseIds.filter((id) => validIds.has(id)),
      })),
    );
  };

  const handleConfirmSubservicios = (selected: SubservicioSeleccionado[]) => {
    setSubservicios((prev) => {
      const prevById = new Map(prev.map((s) => [s.id, s]));
      // Conservar las fases ya asignadas a los que siguen seleccionados.
      return selected.map((sel) => {
        const existing = prevById.get(sel.id);
        return existing
          ? { ...existing, nombre: sel.nombre }
          : { id: sel.id, nombre: sel.nombre, faseIds: [], dias: 1 };
      });
    });
  };

  const updateSubservicioDias = (subId: number, value: string) => {
    const dias = Math.max(1, parseInt(value, 10) || 1);
    setSubservicios((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, dias } : s)),
    );
  };

  const toggleSubservicioFase = (subId: number, faseId: string) => {
    setSubservicios((prev) =>
      prev.map((s) => {
        if (s.id !== subId) return s;
        const has = s.faseIds.includes(faseId);
        return {
          ...s,
          faseIds: has
            ? s.faseIds.filter((id) => id !== faseId)
            : [...s.faseIds, faseId],
        };
      }),
    );
  };

  const removeSubservicio = (subId: number) => {
    setSubservicios((prev) => prev.filter((s) => s.id !== subId));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "create" ? "Agregar Servicio" : "Editar Servicio"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-1.5 hover:bg-accent transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
          <ServicioFotoField
            currentFotoUrl={mode === "edit" ? servicio?.foto : null}
            file={fotoFile}
            onFileChange={handleFotoChange}
            error={fotoError}
            disabled={isPending}
          />
          <FormField id="nombre"            label="Nombre del Servicio"   placeholder="Ej. Instalación de Rociadores" value={form.nombre}            error={errors.nombre}            onChange={handleChange} />
          <FormField id="descripcion"       label="Descripción"           placeholder="Describe el servicio en detalle..." value={form.descripcion}       error={errors.descripcion}       onChange={handleChange} textarea />
          <FormField id="precio_regular"    label="Precio Regular (S/)"   placeholder="0.00" type="number"             value={form.precio_regular}    error={errors.precio_regular}    onChange={handleChange} />
          <FormField id="condicional_precio" label="Condicional de Precio" placeholder="Ej. Por unidad, Por m², Por proyecto" value={form.condicional_precio} error={errors.condicional_precio} onChange={handleChange} />
          <FormField id="observaciones"     label="Observaciones"         placeholder="Notas adicionales..."            value={form.observaciones}     error={errors.observaciones}     onChange={handleChange} textarea />

          {/* Fases del servicio (mismo esquema que cotizaciones) */}
          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Layers className="h-4 w-4 text-red-500" />
                  Fases del Servicio
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Define las fases predeterminadas con sus actividades y duración.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhasesDialogOpen(true)}
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
                {fases.length > 0 ? "Editar Fases" : "Agregar Fases"}
              </Button>
            </div>

            {fases.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ListChecks className="h-3.5 w-3.5" />
                    {fases.length} fase{fases.length !== 1 ? "s" : ""} · {totalActividades} actividad{totalActividades !== 1 ? "es" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {totalDuracion} días total
                  </span>
                </div>
                <ul className="space-y-1">
                  {fases.map((f, i) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-gray-700">{f.name || "(Sin nombre)"}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {f.activities.length} act.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-border py-3 text-center text-xs text-muted-foreground">
                Aún no hay fases definidas para este servicio.
              </p>
            )}
          </div>

          {/* Subservicios (solo en edición): servicios que intervienen en las fases */}
          {mode === "edit" && (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Wrench className="h-4 w-4 text-red-500" />
                    Subservicios
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Selecciona servicios que intervienen y en qué fases participan.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSubDialogOpen(true)}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4" />
                  {subservicios.length > 0 ? "Editar" : "Agregar"}
                </Button>
              </div>

              {subservicios.length > 0 ? (
                <ul className="space-y-2">
                  {subservicios.map((sub) => (
                    <li
                      key={sub.id}
                      className="rounded-md border border-border bg-muted/30 p-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                          {sub.nombre || `Servicio #${sub.id}`}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubservicio(sub.id)}
                          className="h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Días de alquiler (misma lógica que solicitudes/crear) */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">
                          Días de alquiler:
                        </span>
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            value={sub.dias}
                            onChange={(e) => updateSubservicioDias(sub.id, e.target.value)}
                            className="h-8 w-24 pl-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Interviene en las fases:
                        </p>
                        {fases.length === 0 ? (
                          <p className="text-xs italic text-amber-600">
                            Primero define las fases del servicio para poder asignarlas.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {fases.map((f, i) => {
                              const active = sub.faseIds.includes(f.id);
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => toggleSubservicioFase(sub.id, f.id)}
                                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                    active
                                      ? "border-red-500 bg-red-500 text-white"
                                      : "border-border bg-background text-gray-600 hover:border-red-300 hover:text-red-600"
                                  }`}
                                >
                                  {i + 1}. {f.name || "Sin nombre"}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md border border-dashed border-border py-3 text-center text-xs text-muted-foreground">
                  Aún no hay subservicios seleccionados.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-muted/50">
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>

    <AddPhasesDialog
      open={phasesDialogOpen}
      onOpenChange={setPhasesDialogOpen}
      onConfirm={handleConfirmFases}
      existingPhases={fases}
    />

    <SubserviciosDialog
      open={subDialogOpen}
      onOpenChange={setSubDialogOpen}
      currentServicioId={servicio?.id}
      selectedIds={subservicios.map((s) => s.id)}
      onConfirm={handleConfirmSubservicios}
    />
    </>
  );
};
