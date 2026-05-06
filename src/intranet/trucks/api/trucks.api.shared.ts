import type { Pagination } from "@/shared/interfaces/api-response";
import type {
  Truck,
  TruckInventoryDetail,
  TruckInventoryItem,
  TruckInventoryRow,
  TruckMaintenance,
} from "../interfaces/truck.interface";

type NumericValue = number | string | null | undefined;
type NullableString = string | null | undefined;

export type RawTruck = Omit<Truck, "ID_Fabricante" | "ano_fabricacion"> & {
  ID_Fabricante: NumericValue;
  Fabricante_Nombre: string | null;
  ano_fabricacion: NumericValue;
  revision_tecnica: NullableString;
  fecha_prox_revision: NullableString;
  vencimiento_tarjeta: NullableString;
  soat_dia_pago: NullableString;
};

export type RawMaintenance = Omit<TruckMaintenance, "id"> & {
  id: NumericValue;
  fecha_ultimo_mant: NullableString;
};

export type RawInventoryItem = Omit<TruckInventoryItem, "id"> & {
  id: NumericValue;
};

export type RawInventoryDetail = Omit<TruckInventoryDetail, "ID_Fabricante" | "ano_fabricacion"> & {
  ID_Fabricante: NumericValue;
  ano_fabricacion: NumericValue;
  Fabricante_Nombre: string | null;
  fecha_compra: NullableString;
  mant_ultimo: NullableString;
  mant_fecha_caducidad: NullableString;
};

export type RawInventoryRow = Omit<TruckInventoryRow, "detalle" | "id"> & {
  id: NumericValue;
  detalle: RawInventoryDetail | null;
};

export type PaginatedResponse<T> = Pagination<T> | { data: Pagination<T> };

const toNumber = (value: NumericValue, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: NumericValue): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
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
    return payload.data;
  }

  return payload as Pagination<T>;
};

export const normalizeTruck = (truck: RawTruck): Truck => ({
  ...truck,
  ID_Fabricante: toNullableNumber(truck.ID_Fabricante),
  Fabricante_Nombre: toNullableTrimmedString(truck.Fabricante_Nombre),
  ano_fabricacion: toNumber(truck.ano_fabricacion),
  revision_tecnica: toNullableTrimmedString(truck.revision_tecnica) ?? "",
  fecha_prox_revision: toIsoDateOrEmpty(truck.fecha_prox_revision),
  vencimiento_tarjeta: toIsoDateOrEmpty(truck.vencimiento_tarjeta),
  soat_dia_pago: toIsoDateOrEmpty(truck.soat_dia_pago),
});

export const normalizeTruckMaintenance = (
  maintenance: RawMaintenance,
): TruckMaintenance => ({
  ...maintenance,
  id: toOptionalNumber(maintenance.id),
  fecha_ultimo_mant: toIsoDateOrEmpty(maintenance.fecha_ultimo_mant),
});

export const normalizeTruckInventoryDetail = (
  detail: RawInventoryDetail,
): TruckInventoryDetail => ({
  ...detail,
  ID_Fabricante: toNullableNumber(detail.ID_Fabricante),
  Fabricante_Nombre: toNullableTrimmedString(detail.Fabricante_Nombre),
  ano_fabricacion: toNumber(detail.ano_fabricacion),
  fecha_compra: toIsoDateOrEmpty(detail.fecha_compra),
  mant_ultimo: toIsoDateOrEmpty(detail.mant_ultimo),
  mant_fecha_caducidad: toIsoDateOrEmpty(detail.mant_fecha_caducidad),
});

export const normalizeTruckInventoryItem = (
  item: RawInventoryItem,
): TruckInventoryItem => ({
  ...item,
  id: toOptionalNumber(item.id),
});

export const normalizeTruckInventoryRow = (item: RawInventoryRow): TruckInventoryRow => ({
  ...item,
  id: toOptionalNumber(item.id),
  detalle: item.detalle ? normalizeTruckInventoryDetail(item.detalle) : null,
});
