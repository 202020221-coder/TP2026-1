import type { CreateIncidentInvolvedBody } from "../../api/incident.api";
import type { IncidentInvolved } from "../../interfaces/incident";
import type { PersonnelFormState } from "./types";

function splitNombre(nombre: string) {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { nombre: "", apellido: "" };
  }

  if (parts.length === 1) {
    return { nombre: parts[0], apellido: "" };
  }

  return {
    nombre: parts[0],
    apellido: parts.slice(1).join(" "),
  };
}

export function toFormState(item: IncidentInvolved): PersonnelFormState {
  return {
    nombre: item.nombre ?? "",
    dni: item.dni ?? "",
    cargo: item.cargo ?? item.perfil_registrado ?? "",
    descargo_persona: item.descargo_persona ?? "",
    comentario_empresa: item.comentario_empresa ?? "",
    tiene_relacion_empresa: item.tiene_relacion_empresa,
  };
}

/** Payload listo para POST/PUT cuando se conecten los endpoints de escritura. */
export function toApiPayload(form: PersonnelFormState): CreateIncidentInvolvedBody {
  const descargo = form.descargo_persona.trim();
  const comentario = form.comentario_empresa.trim();

  if (form.tiene_relacion_empresa) {
    return {
      dni_involucrado: form.dni.trim() || null,
      descargo,
      comentario,
      nombre: null,
    };
  }

  const { nombre, apellido } = splitNombre(form.nombre);

  return {
    dni_involucrado: form.dni.trim() || null,
    descargo,
    comentario,
    nombre: form.nombre.trim() || null,
    Involucrado_Nombre: nombre || form.nombre.trim(),
    Involucrado_Apellido: apellido,
  };
}

export function validatePersonnelForm(form: PersonnelFormState): string | null {
  if (!form.nombre.trim()) {
    return "El nombre es obligatorio.";
  }

  if (form.tiene_relacion_empresa) {
    if (!form.dni.trim()) {
      return "Selecciona un perfil de la empresa para completar el DNI.";
    }
    if (!form.cargo.trim()) {
      return "Selecciona un perfil de la empresa para completar el cargo.";
    }
  }

  return null;
}
