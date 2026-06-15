import type { CreateIncidentInvolvedBody } from "../../api/incident.api";
import type { IncidentInvolved } from "../../interfaces/incident";
import type { PersonnelFormState } from "./types";

const UNKNOWN_NOMBRE = "nombre desconocido";
const UNKNOWN_VALUE = "desconocido";

export function toFormState(item: IncidentInvolved): PersonnelFormState {
  return {
    nombre: item.nombre ?? "",
    dni: item.dni ?? "",
    cargo: item.cargo ?? "",
    descargo_persona: item.descargo_persona ?? "",
    comentario_empresa: item.comentario_empresa ?? "",
    tiene_relacion_empresa: item.tiene_relacion_empresa,
  };
}

export function toApiPayload(form: PersonnelFormState): CreateIncidentInvolvedBody {
  const descargo = form.descargo_persona.trim();
  const comentario = form.comentario_empresa.trim();

  return {
    dni_involucrado: form.dni.trim() || UNKNOWN_VALUE,
    descargo,
    comentario,
    nombre: form.nombre.trim() || UNKNOWN_NOMBRE,
    Perfil_Registrado: form.tiene_relacion_empresa,
    cargo: form.cargo.trim() || UNKNOWN_VALUE,
  };
}

export function validatePersonnelForm(form: PersonnelFormState): string | null {
  if (!form.tiene_relacion_empresa) {
    return null;
  }

  if (!form.nombre.trim()) {
    return "El nombre es obligatorio.";
  }

  if (!form.dni.trim()) {
    return "Selecciona un perfil de la empresa para completar el DNI.";
  }

  return null;
}
