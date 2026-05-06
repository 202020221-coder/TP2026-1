import { useEffect, useRef, useState, type FC } from "react";
import type { Servicio, CreateServicioDTO } from "../interfaces/service";
import { useServicios } from "../hooks/useServicios";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { X } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  servicio?: Servicio;
  onClose: () => void;
}

const EMPTY: CreateServicioDTO = {
  nombre: "", descripcion: "", precio_regular: 0, condicional_precio: "", observaciones: "",
};

// ── Subcomponentes definidos fuera del render para evitar re-montajes ─────────
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

// ── Componente principal ──────────────────────────────────────────────────────
export const ServicioFormModal: FC<Props> = ({ mode, servicio, onClose }) => {
  const { createMutation, updateMutation } = useServicios();
  const [form, setForm] = useState<CreateServicioDTO>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateServicioDTO, string>>>({});
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
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [mode, servicio]);

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
      if (mode === "create") await createMutation.mutateAsync(form);
      else if (mode === "edit" && servicio) await updateMutation.mutateAsync({ id: servicio.id, dto: form });
      onClose(); // solo cierra si fue exitoso
    } catch {
      // El Provider ya muestra el toast de error — el modal permanece abierto
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {mode === "create" ? "Agregar Servicio" : "Editar Servicio"}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
          <FormField id="nombre"            label="Nombre del Servicio"   placeholder="Ej. Instalación de Rociadores" value={form.nombre}            error={errors.nombre}            onChange={handleChange} />
          <FormField id="descripcion"       label="Descripción"           placeholder="Describe el servicio en detalle..." value={form.descripcion}       error={errors.descripcion}       onChange={handleChange} textarea />
          <FormField id="precio_regular"    label="Precio Regular (S/)"   placeholder="0.00" type="number"             value={form.precio_regular}    error={errors.precio_regular}    onChange={handleChange} />
          <FormField id="condicional_precio" label="Condicional de Precio" placeholder="Ej. Por unidad, Por m², Por proyecto" value={form.condicional_precio} error={errors.condicional_precio} onChange={handleChange} />
          <FormField id="observaciones"     label="Observaciones"         placeholder="Notas adicionales..."            value={form.observaciones}     error={errors.observaciones}     onChange={handleChange} textarea />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
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
  );
};
