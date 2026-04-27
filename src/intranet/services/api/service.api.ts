import type { GetServiciosQP } from "../interfaces/query-params.dto";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type { Servicio } from "../interfaces/service";

const mockServicios: Servicio[] = [
  {
    id: 1,
    nombre: "INSTALACION ROCIADORES",
    descripcion: "Instalación completa de sistema de rociadores contra incendios",
    precio_regular: 85.0,
    condicional_precio: "Por unidad",
    observaciones: "Realizar siempre así y así, involucrar a ingeniero sanitario",
    persona_requerida: "Ingeniero Sanitario",
  },
  {
    id: 2,
    nombre: "MANTENIMIENTO EXTINTORES",
    descripcion: "Servicio de mantenimiento y recarga de extintores",
    precio_regular: 45.0,
    condicional_precio: "Por unidad",
    observaciones: "Verificar presión y fecha de vencimiento",
    persona_requerida: "Técnico certificado",
  },
  {
    id: 3,
    nombre: "INSTALACION ALARMAS",
    descripcion: "Instalación de sistema de alarmas contra incendios",
    precio_regular: 120.0,
    condicional_precio: "Por área m²",
    observaciones: "Requiere planos eléctricos aprobados",
    persona_requerida: "Electricista certificado",
  },
  {
    id: 4,
    nombre: "CAPACITACION BRIGADAS",
    descripcion: "Capacitación al personal en manejo de emergencias",
    precio_regular: 200.0,
    condicional_precio: "Por sesión",
    observaciones: "Máximo 20 personas por sesión",
  },
  {
    id: 5,
    nombre: "DISEÑO RED HIDRAULICA",
    descripcion: "Diseño e instalación de red hidráulica contra incendios",
    precio_regular: 350.0,
    condicional_precio: "Por proyecto",
    observaciones: "Incluye planos y memoria de cálculo",
    persona_requerida: "Ingeniero Civil",
  },
];

export const getServicios = async (
  params: GetServiciosQP,
): Promise<GetServiciosResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { page, limit = 10, search } = params;

  let filtered = mockServicios;
  if (search) {
    filtered = mockServicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(search.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: { page, totalPages, total, limit },
  };
};
