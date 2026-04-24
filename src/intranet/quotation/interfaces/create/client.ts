export interface Client {
  DNI_O_RUC: string
  nombre_comercial: string
  razon_social: string

  /**Solo me quedo con campos coincidentes entre persona natural y empresa*/
}