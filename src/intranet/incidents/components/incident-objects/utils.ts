import type { CreateIncidentObjectBody } from "../../api/incident.api";
import type {
  InvolvedObject,
  InvolvedObjectCategory,
} from "../../interfaces/incident-quotation";
import type { ObjectFormState, ObjectOccurrence } from "./types";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatCurrency(value: number) {
  return `S/ ${currencyFormatter.format(value)}`;
}

export function normalizeCategory(category: unknown): InvolvedObjectCategory {
  const label = String(category ?? "").toLowerCase();
  return label.includes("camion") ? "Camiones" : "Objetos";
}

export function normalizeOccurrence(value: unknown): ObjectOccurrence | "" {
  const label = String(value ?? "").toLowerCase().trim();
  if (label.includes("rob")) return "robo";
  if (label.includes("perd")) return "perdida";
  return "";
}

export function toFormState(item: InvolvedObject): ObjectFormState {
  return {
    categoria: normalizeCategory(item.categoria),
    objeto: item.objeto ?? "",
    fecha_perdida: item.fecha_perdida ? item.fecha_perdida.slice(0, 10) : "",
    cantidad_involucrada: String(item.cantidad_involucrada ?? 0),
    cantidad_enviada: String(item.cantidad_enviada ?? 0),
    ocurrencia: normalizeOccurrence(item.ocurrencia),
    ultima_ubicacion: item.ultima_ubicacion ?? "",
    precio_remunerar:
      item.precio_remunerar !== null && item.precio_remunerar !== undefined
        ? String(item.precio_remunerar)
        : "",
  };
}

export function toApiPayload(form: ObjectFormState): CreateIncidentObjectBody {
  const remuneration =
    form.precio_remunerar.trim() === "" ? null : Number(form.precio_remunerar);
  const categoria = form.categoria;
  const ocurrencia = form.ocurrencia;
  const objeto = form.objeto.trim();
  const cantidadInvolucrada = Number(form.cantidad_involucrada);
  const cantidadEnviada = Number(form.cantidad_enviada);

  return {
    categoria,
    tipo: categoria,
    objeto,
    descripcion: objeto,
    fecha_perdida: form.fecha_perdida || null,
    cantidad_involucrada: cantidadInvolucrada,
    cantidad_enviada: cantidadEnviada,
    // Algunos backends solo persisten un campo cantidad.
    cantidad: cantidadInvolucrada,
    ocurrencia,
    ocurrencia_inventario: categoria === "Objetos" ? ocurrencia : null,
    ocurrencia_camion: categoria === "Camiones" ? ocurrencia : null,
    ultima_ubicacion: form.ultima_ubicacion.trim(),
    // En la API legacy este campo queda guardado y luego vuelve en GET.
    comentario: objeto,
    precio_remunerar: Number.isFinite(remuneration as number) ? remuneration : null,
  };
}
