import type { InvolvedObjectCategory } from "../../interfaces/incident-quotation";

export type EditorMode = "create" | "view" | "edit";
export type ObjectOccurrence = "perdida" | "robo";

export type ObjectFormState = {
  categoria: InvolvedObjectCategory;
  objeto: string;
  fecha_perdida: string;
  cantidad_involucrada: string;
  cantidad_enviada: string;
  ocurrencia: ObjectOccurrence | "";
  ultima_ubicacion: string;
  precio_remunerar: string;
};

export const EMPTY_OBJECT_FORM: ObjectFormState = {
  categoria: "Objetos",
  objeto: "",
  fecha_perdida: "",
  cantidad_involucrada: "",
  cantidad_enviada: "",
  ocurrencia: "",
  ultima_ubicacion: "",
  precio_remunerar: "",
};
