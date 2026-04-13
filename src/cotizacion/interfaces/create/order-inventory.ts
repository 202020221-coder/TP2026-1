import { OrderInventoryIntentionsRecord } from "@/cotizacion/enum/order-inventory-intention";
export type OrderInventoryElementItem = {
  id: number;
  ID_Solicitud: number;
  ID_Inventario: number;
  cantidad: number;
} & (
  | {
      intencion: typeof OrderInventoryIntentionsRecord.buy;
      dias_alquilados: null;
    }
  | {
      intencion: typeof OrderInventoryIntentionsRecord.rent;
      dias_alquilados: number;
    }
);

export interface OrderInventoryElementItemDetail {
  Id_Objeto: number;
  lugar_almacenaje: string;
  cantidad: number;
  nombre_objeto: string;
  ID_Fabricante: number;
  orden_compra: string;
  fecha_compra: string;
  factura: string | null;
  garantia: string;
  numero_serial: string;
  ano_fabricacion: number;
  peso: string;
  estado: string;
  precio_compra: string;
  precio_envio: string;
  responsable_envio: string;
  precio_comercial: string;
  mant_requerimiento: "si" | "no";
  mant_ultimo: null | string;
  mant_fecha_caducidad: string;
  mant_responsable: null | string;
  mant_contacto: null | string;
}

export interface InventoryItemManufacturer {
  ID_Fabricante: number;
  nombre_comercial: string;
  ubicacion: string;
  rubro: string;
  descripcion: string;
  comentarios: string;
  pago: string;
}
