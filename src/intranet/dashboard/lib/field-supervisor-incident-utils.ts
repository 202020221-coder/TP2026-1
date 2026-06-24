import { IncidentStatesRecord } from "@/intranet/incidents/enum/incident-state.record";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type {
  IncidentCategory,
  IncidentFlowStage,
  IncidentSeverity,
} from "../interfaces/field-supervisor-dashboard.types";

const CATEGORY_PREFIX = /^\[([^\]]+)\]/;
const SEVERITY_PATTERN =
  /\b(Baja|Media|Alta|Crítica|Critica)\b/i;

export function mapIncidentFlowStage(estado: string): IncidentFlowStage {
  switch (estado) {
    case IncidentStatesRecord.cerrado:
      return "Cerrada";
    case IncidentStatesRecord.enRevision:
      return "En revisión";
    case IncidentStatesRecord.enviado:
      return "En proceso";
    default:
      return "Reportada";
  }
}

export function parseIncidentMetadata(comentario: string, nombre: string | null) {
  const source = `${nombre ?? ""} ${comentario}`.trim();
  let category: IncidentCategory | null = null;
  let severity: IncidentSeverity | null = null;

  const categoryMatch = source.match(
    /\[(Seguridad|Retraso de material|Desviación técnica|Clima|Otro)\]/i,
  );
  if (categoryMatch) {
    category = categoryMatch[1] as IncidentCategory;
  }

  const severityMatch = source.match(SEVERITY_PATTERN);
  if (severityMatch) {
    const raw = severityMatch[1];
    severity =
      raw.toLowerCase() === "critica"
        ? "Crítica"
        : (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()) as IncidentSeverity;
  }

  return { category, severity };
}

export function buildIncidentComment(
  category: IncidentCategory,
  severity: IncidentSeverity,
  description: string,
) {
  return `[${category}] [${severity}] ${description.trim()}`;
}

export function buildIncidentTitle(
  category: IncidentCategory,
  severity: IncidentSeverity,
) {
  return `${category} — ${severity}`;
}

export function stripMetadataPrefix(text: string) {
  return text.replace(CATEGORY_PREFIX, "").replace(SEVERITY_PATTERN, "").trim();
}

export function isOpenIncident(incident: Incident) {
  return incident.estado !== IncidentStatesRecord.cerrado;
}

export function isSafetyAlert(incident: Incident) {
  const { category, severity } = parseIncidentMetadata(
    incident.comentario,
    incident.nombre_incidencia,
  );
  return (
    category === "Seguridad" ||
    severity === "Alta" ||
    severity === "Crítica" ||
    incident.estado === IncidentStatesRecord.enRevision
  );
}
