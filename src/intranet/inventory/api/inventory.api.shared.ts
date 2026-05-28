import type { Pagination } from "@/shared/interfaces/api-response";
import type { InventarioItem } from "../interfaces/inventory.interface";

type NumericValue = number | string | null | undefined;
type NullableString = string | null | undefined;

export type RawInventarioItem = Omit<
  InventarioItem,
  | "Id_Objeto"
  | "ID_Fabricante"
  | "cantidad"
  | "ano_fabricacion"
  | "peso"
  | "precio_compra"
  | "precio_envio"
  | "precio_comercial"
  | "merma_perdida"
  | "fecha_compra"
  | "mant_ultimo"
  | "mant_fecha_caducidad"
  | "lugar_almacenaje"
  | "orden_compra"
  | "factura"
  | "garantia"
  | "numero_serial"
  | "responsable_envio"
  | "mant_responsable"
  | "mant_contacto"
  | "Fabricante_Nombre"
> & {
  Id_Objeto: NumericValue;
  ID_Fabricante: NumericValue;
  cantidad: NumericValue;
  ano_fabricacion: NumericValue;
  peso: NumericValue;
  precio_compra: NumericValue;
  precio_envio: NumericValue;
  precio_comercial: NumericValue;
  merma_perdida: NumericValue;
  fecha_compra: NullableString;
  mant_ultimo: NullableString;
  mant_fecha_caducidad: NullableString;
  lugar_almacenaje: NullableString;
  orden_compra: NullableString;
  factura: NullableString;
  garantia: NullableString;
  numero_serial: NullableString;
  responsable_envio: NullableString;
  mant_responsable: NullableString;
  mant_contacto: NullableString;
  Fabricante_Nombre: NullableString;
};

export type PaginatedResponse<T> = Pagination<T> | { data: Pagination<T> };

const toNumber = (value: NumericValue, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableNumber = (value: NumericValue): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNullableTrimmedString = (value: NullableString): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toIsoDateOrEmpty = (value: NullableString): string => {
  if (!value || value.trim().length === 0) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const unwrapPagination = <T,>(payload: PaginatedResponse<T>): Pagination<T> => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    typeof payload.data === "object" &&
    payload.data !== null &&
    "pagination" in payload.data
  ) {
    return payload.data as Pagination<T>;
  }

  return payload as Pagination<T>;
};

export const normalizeInventarioItem = (item: RawInventarioItem): InventarioItem => ({
  ...item,
  Id_Objeto: toNumber(item.Id_Objeto),
  ID_Fabricante: toNullableNumber(item.ID_Fabricante),
  cantidad: toNumber(item.cantidad),
  ano_fabricacion: toNullableNumber(item.ano_fabricacion),
  peso: toNullableNumber(item.peso),
  precio_compra: toNullableNumber(item.precio_compra),
  precio_envio: toNullableNumber(item.precio_envio),
  precio_comercial: toNullableNumber(item.precio_comercial),
  merma_perdida: toNumber(item.merma_perdida),
  lugar_almacenaje: toNullableTrimmedString(item.lugar_almacenaje),
  orden_compra: toNullableTrimmedString(item.orden_compra),
  factura: toNullableTrimmedString(item.factura),
  garantia: toNullableTrimmedString(item.garantia),
  numero_serial: toNullableTrimmedString(item.numero_serial),
  responsable_envio: toNullableTrimmedString(item.responsable_envio),
  mant_responsable: toNullableTrimmedString(item.mant_responsable),
  mant_contacto: toNullableTrimmedString(item.mant_contacto),
  Fabricante_Nombre: toNullableTrimmedString(item.Fabricante_Nombre),
  fecha_compra: toIsoDateOrEmpty(item.fecha_compra),
  mant_ultimo: toIsoDateOrEmpty(item.mant_ultimo),
  mant_fecha_caducidad: toIsoDateOrEmpty(item.mant_fecha_caducidad),
});
