export type EditorMode = "create" | "edit";

export type PersonnelFormState = {
  nombre: string;
  dni: string;
  cargo: string;
  descargo_persona: string;
  comentario_empresa: string;
  tiene_relacion_empresa: boolean;
};

export const EMPTY_PERSONNEL_FORM: PersonnelFormState = {
  nombre: "",
  dni: "",
  cargo: "",
  descargo_persona: "",
  comentario_empresa: "",
  tiene_relacion_empresa: true,
};
