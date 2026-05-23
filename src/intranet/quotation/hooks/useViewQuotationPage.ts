import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sleep from "@/shared/lib/sleep";
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";
import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import type { Client } from "@/intranet/quotation/interfaces/create/client";

type ViewQuotationData = {
  ID: number;
  nombre: string;
  estado: string;
  version: number;
  client: Client;
  productos: QuotationProduct[];
  camionEspecificado: Truck;
  costoRecojo: {
    costo: number;
    fechaRecojo: string;
    direccionRecojo: string;
  };
  condiciones: {
    fechaEmision: string;
    fechaVigencia: string;
    condiciones: string;
    observaciones: string;
  };
  tasaCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
};

const mockTruck: Truck = {
  Placa: "ABC-123",
  nombre: "Camión de prueba",
  ano_fabricacion: 2020,
  modelo: "Model X",
  color: "Blanco",
  caracteristicas: "Capacidad 5 toneladas",
  revision_tecnica: "2026-01-01",
  fecha_prox_revision: "2026-06-01",
  ID_Fabricante: null,
  tarjeta_propiedad: "TP-12345",
  vencimiento_tarjeta: "2026-12-31",
  soat_n_poliza: "SOAT-123",
  soat_empresa: "Seguros ABC",
  soat_precio: "500",
  soat_dia_pago: "15",
};

const mockProducts: QuotationProduct[] = [
  {
    id: "1",
    nombre: "Extintor ABC 10kg",
    cantidad: 5,
    precio_unitario: 120,
    intencion: "comprar",
    dias_alquilados: null,
  },
  {
    id: "2",
    nombre: "Manguera contra incendios 30m",
    cantidad: 2,
    precio_unitario: 250,
    intencion: "alquilar",
    dias_alquilados: 30,
  },
];

const buildMockData = (id: string): ViewQuotationData => ({
  ID: Number(id),
  nombre: `Cotización de prueba #${id}`,
  estado: "pendiente",
  version: 1,
  client: {
    DNI_O_RUC: "20501234567",
    nombre_comercial: "Mall Aventura Plaza",
    razon_social: "Aventura Plaza S.A.",
  },
  productos: mockProducts,
  camionEspecificado: mockTruck,
  costoRecojo: {
    costo: 100,
    fechaRecojo: "2026-05-25",
    direccionRecojo: "Av. Principal 123, Lima",
  },
  condiciones: {
    fechaEmision: "2026-05-23",
    fechaVigencia: "2026-06-23",
    condiciones: "Pago contra entrega. Se aplican términos y condiciones estándar.",
    observaciones: "Cliente solicita factura electrónica.",
  },
  tasaCambio: {
    tasaCompra: 3.75,
    tasaVenta: 3.85,
  },
});

export const useViewQuotationPage = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const [data, setData] = useState<ViewQuotationData | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!quotationId) return;

    let mounted = true;
    setIsPending(true);
    setIsError(false);

    sleep(1500)
      .then(() => {
        if (mounted) {
          setData(buildMockData(quotationId));
          setIsPending(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsError(true);
          setIsPending(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [quotationId]);

  return {
    quotationId: quotationId,
    data,
    isPending,
    isError,
  };
};
