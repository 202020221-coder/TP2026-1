import sleep from "@/shared/lib/sleep";
import type { Quotation, QuotationProduct } from "../interfaces/quotation";
import axiosInstance from "@/shared/api/axios.config";
import type {
  GetQuotationResponse,
  GetQuotationsResponse,
} from "../interfaces/responses.dto";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { toSearchParams } from "@/shared/lib/to-search-params";

export const getAllQuotations = async (
  params: GetQuotationQP,
): Promise<GetQuotationsResponse> => {
  //Obtain session state outside components
  const sessionState = useSession.getState();
  let response;
  if (sessionState.loggedUser?.rol === RolesRecord.client) {
    console.log("CLIENTE");

    /**query for client's quotation*/
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/perfiles/${sessionState.loggedUser.dni_perfil}/cotizaciones?${toSearchParams(params)}`,
    );
  } else {
    console.log("ADMIN");

    /**query for project asistant*/
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/cotizaciones?${toSearchParams(params)}`,
    );
  }
  return response.data;
};

export const getQuotation = async (
  _id: Quotation["ID"],
): Promise<GetQuotationResponse> => {
  await sleep(4000);
  return detailedQuotationMock;
};

export const getQuotationProducts = async (
  _id: string,
): Promise<QuotationProduct[]> => {
  await sleep(4000);
  return productosMock;
};

const productosMock: QuotationProduct[] = [
  {
    id: "1",
    nombre: "Laptop X",
    intencion: "alquilar",
    cantidad: 2,
    precio_unitario: 1500,
  },
  {
    id: "2",
    nombre: "Mouse inalámbrico",
    intencion: "alquilar",
    cantidad: 5,
    precio_unitario: 25,
  },
  {
    id: "3",
    nombre: "Teclado mecánico",
    intencion: "comprar",
    cantidad: 3,
    precio_unitario: 80,
  },
  {
    id: "4",
    nombre: "Monitor 24''",
    intencion: "alquilar",
    cantidad: 4,
    precio_unitario: 200,
  },
  {
    id: "5",
    nombre: "Auriculares",
    intencion: "alquilar",
    cantidad: 6,
    precio_unitario: 60,
  },
];

const detailedQuotationMock: GetQuotationResponse = {
  ID: 2,
  camionEspecificado: {
    ano_fabricacion: 2004,
    caracteristicas: "Camion especial color negro",
    color: "negro",
    fecha_prox_revision: new Date().toISOString(),
    ID_Fabricante: "4",
    modelo: "sedan",
    nombre: "suski epic",
    Placa: "fgc-512",
    revision_tecnica: "es una revision",
    soat_dia_pago: new Date().toISOString(),
    tarjeta_propiedad: "ABC123",
    vencimiento_tarjeta: new Date().toISOString(),
    soat_n_poliza: "POL123456",
    soat_empresa: "Seguros XYZ",
    soat_precio: "500.00",
  },
  condiciones: {
    fechaEmision: new Date().toISOString(),
    condiciones: "sdmvfsvks",
    fechaVigencia: new Date().toISOString(),
    observaciones: "cnsjdvnskjdnvjk",
  },
  costoRecojo: {
    costo: 40.0,
    direccionRecojo: "Av. Las casuarinas",
    fechaRecojo: new Date().toISOString(),
  },
  estado: "pendiente",
  idSolicitud: 1,
  mensajes: "Pendiente",
  nombre: "cotizacion xd",
  precioTotal: "4102.32",
  productos: [
    {
      cantidad: 20,
      id: "2",
      intencion: "alquilar",
      nombre: "item de cotizacion",
      precio_unitario: 24.0,
    },
  ],
  tasaCambio: {
    tasaCompra: 3.21,
    tasaVenta: 3.52,
  },
  version: 2,
};
