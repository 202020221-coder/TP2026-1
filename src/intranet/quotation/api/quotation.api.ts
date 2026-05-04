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
  id: Quotation["ID"],
  options?: { dni?: string },
): Promise<GetQuotationResponse | any> => {
  let profileMatch: any = null;

  if (options?.dni) {
    try {
      const resp = await axiosInstance.get(
        `/perfiles/${options.dni}/cotizaciones`,
      );
      const list = resp.data?.data ?? resp.data;
      if (Array.isArray(list)) {
        const found = list.find((q: any) => Number(q.ID) === Number(id));
        if (found) {
          profileMatch = found;
          return found;
        }
      }
    } catch (e) {}

    try {
      const resp2 = await axiosInstance.get(
        `/clientes/${options.dni}/cotizaciones`,
      );
      const list2 = resp2.data?.data ?? resp2.data;
      if (Array.isArray(list2)) {
        const found2 = list2.find((q: any) => Number(q.ID) === Number(id));
        if (found2) {
          profileMatch = found2;
          return found2;
        }
      }
    } catch (e) {}
  }

  try {
    const respDetail = await axiosInstance.get(`/cotizaciones/${id}/detalles`);
    return respDetail.data;
  } catch (err: any) {
    if (profileMatch) {
      return profileMatch;
    }
    try {
      const response = await axiosInstance.get<GetQuotationResponse>(
        `/cotizaciones/${id}`,
      );
      return response.data;
    } catch (err2: any) {
      if (err2?.response?.status === 404) {
        throw new Error("Cotización no encontrada.");
      }
      if (err?.response?.status === 403 || err2?.response?.status === 403) {
        throw new Error(
          "No autorizado para ver los detalles de esta cotización.",
        );
      }
      throw new Error("Error al obtener la cotización.");
    }
  }
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
