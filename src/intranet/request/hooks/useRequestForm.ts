// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   CreateClient,
//   CreateClientPerfil,
//   CreateClientContact,
//   CreateRequestService,
//   CreateRequestInventory,
//   CreateRequest,
// } from "../api/client-request.api";
// import type {
//   PostClientDTO,
//   PostClientPerfilDTO,
//   PostClientContactDTO,
//   PostRequestServiceDTO,
//   PostRequestInventoryDTO,
//   PostRequestDTO,
// } from "../interfaces";

// // // Unifica todos los datos del formulario en un solo tipo
// export type RequestFormData = PostClientDTO &
//   PostClientPerfilDTO &
//   PostClientContactDTO &
//   PostRequestServiceDTO &
//   PostRequestInventoryDTO &
//   PostRequestDTO;

// const TOTAL_STEPS = 5;

// export function useRequestForm() {
//     const navigate = useNavigate();
  
//     const [isLoading, setIsLoading] = useState(false);
//     const [rootError, setRootError] = useState<string | null>(null);
  
//     // IDs persistidos entre pasos
//     const [clienteId, setClienteId] = useState<string | null>(null);
//     const [solicitudId, setSolicitudId] = useState<number | null>(null);
  
//     // ─── Submit por paso ────────────────────────────────────────────────────────
  
//     /**
//      * Paso 2 → Crea Cliente + Perfil
//      * Guarda el DNI/RUC como clienteId para usarlo en pasos siguientes.
//      */
//     const submitStep2 = async (
//       clientType: ClientType,
//       formData: FormData
//     ): Promise<boolean> => {
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         const clientePayload: PostClientDTO = {
//           DNI_O_RUC: formData.documentNumber,
//           nombre_comercial: formData.nameOrBusinessName,
//           razon_social:
//             clientType === "jurídica"
//               ? formData.nameOrBusinessName
//               : `${formData.nameOrBusinessName} ${formData.lastName}`.trim(),
//           rubro: "",                          // Agrega el campo si lo tienes en el form
//           ubicacion_facturacion: formData.address,
//           observacion: null,
//         };
  
//         const clienteRes = await CreateClient(clientePayload);
//         if ("error" in clienteRes) {
//           setRootError(clienteRes.error.error);
//           return false;
//         }
  
//         const nuevoClienteId = formData.documentNumber; // DNI o RUC como PK
//         setClienteId(nuevoClienteId);
  
//         const perfilPayload: PostClientPerfilDTO = {
//           DNI: formData.documentNumber,
//           Nombre: formData.nameOrBusinessName,
//           Apellido: formData.lastName,
//           correo_contacto: formData.email,
//           telefono_contacto: formData.phone,
//           Genero: null,
//           RUC: clientType === "jurídica" ? formData.documentNumber : null,
//           fecha_nacimiento: null,
//           estado_civil: null,
//           distrito_residencia: null,
//           seguro_vida_ley: null,
//           aficiones: null,
//           experiencia: null,
//           comentarios: null,
//           estado: null,
//           alergias: null,
//           condicion_medica: null,
//           profesion: null,
//           nro_cta_bancaria: null,
//           cv: null,
//           foto_perfil: null,
//         };
  
//         const perfilRes = await CreateClientPerfil(perfilPayload);
//         if ("error" in perfilRes) {
//           setRootError(perfilRes.error.error);
//           return false;
//         }
  
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al crear el cliente. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     /**
//      * Paso 3 → Crea Cliente-Contacto
//      */
//     const submitStep3 = async (requesterData: RequesterData): Promise<boolean> => {
//       if (!clienteId) {
//         setRootError("No se encontró el ID del cliente. Vuelva al paso anterior.");
//         return false;
//       }
  
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         const contactoPayload: PostClientContactDTO = {
//           DNI_perfil: requesterData.dni,
//           cargo_en_empresa: requesterData.position,
//           lugar_trabajo: requesterData.workAddress,
//         };
  
//         const contactoRes = await CreateClientContact(
//           Number(clienteId),
//           contactoPayload as any   // ⚠️ El tipo en tu API dice PostClientDTO — corrígelo a PostClientContactDTO
//         );
  
//         if ("error" in contactoRes) {
//           setRootError(contactoRes.error.error);
//           return false;
//         }
  
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al crear el contacto. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     /**
//      * Paso 4 → Crea la Solicitud base (necesaria antes de agregar servicios/inventario)
//      * Se hace aquí para tener el solicitudId disponible en pasos 5 y 6.
//      */
//     const submitStep4 = async (
//       serviceData: ServiceData,
//       selectedProducts: SelectedProduct[],
//       selectedTrucks: SelectedTruck[]
//     ): Promise<boolean> => {
//       if (!clienteId) {
//         setRootError("No se encontró el ID del cliente. Vuelva al paso anterior.");
//         return false;
//       }
  
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         const solicitudPayload: PostRequestDTO = {
//           Id_Cliente: clienteId,
//           descripcion: serviceData.serviceDescription,
//           ubicacion: serviceData.serviceAddress,
//           // Camiones seleccionados como string serializado (ajusta según tu backend)
//           camionesenvio: selectedTrucks.length
//             ? selectedTrucks.map((t) => t.name).join(", ")
//             : null,
//           productoenvio: selectedProducts.length
//             ? selectedProducts.map((p) => p.name).join(", ")
//             : null,
//           obsgenerales: null,    // Se actualizará en paso 7
//           obseleccion: null,
//         };
  
//         const solicitudRes = await CreateRequest(solicitudPayload);
//         if ("error" in solicitudRes) {
//           setRootError(solicitudRes.error.error);
//           return false;
//         }
  
//         // Guarda el ID devuelto por el backend (ajusta el campo según tu respuesta real)
//         const newSolicitudId = (solicitudRes as any).ID_Solicitud ?? (solicitudRes as any).id;
//         setSolicitudId(newSolicitudId);
  
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al crear la solicitud. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     /**
//      * Paso 5 → Crea Solicitud-Inventario por cada producto seleccionado
//      */
//     const submitStep5 = async (
//       selectedProducts: SelectedProduct[]
//     ): Promise<boolean> => {
//       if (!solicitudId) {
//         setRootError("No se encontró la solicitud. Vuelva al paso anterior.");
//         return false;
//       }
  
//       if (selectedProducts.length === 0) return true; // Opcional: puede no haber productos
  
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         for (const product of selectedProducts) {
//           const inventarioPayload: PostRequestInventoryDTO = {
//             ID_Inventario: Number(product.productId),
//             cantidad: product.quantity,
//             intencion: product.intent,
//             dias_alquilados: product.intent === "alquilar" ? (product.days ?? 1) : 0,
//           };
  
//           const res = await CreateRequestInventory(solicitudId, inventarioPayload);
//           if ("error" in res) {
//             setRootError(`Error en producto "${product.name}": ${res.error.error}`);
//             return false;
//           }
//         }
  
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al guardar los productos. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     /**
//      * Paso 6 → Crea Solicitud-Servicio por cada camión seleccionado
//      * (Ajusta si camiones usan otro endpoint distinto a /servicios)
//      */
//     const submitStep6 = async (
//       selectedTrucks: SelectedTruck[],
//       serviceData: ServiceData
//     ): Promise<boolean> => {
//       if (!solicitudId) {
//         setRootError("No se encontró la solicitud. Vuelva al paso anterior.");
//         return false;
//       }
  
//       if (selectedTrucks.length === 0) return true;
  
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         for (const truck of selectedTrucks) {
//           const servicioPayload: PostRequestServiceDTO = {
//             ID_Servicio: Number(truck.truckId),
//             fecha_inicio_servicio: serviceData.projectStartDate,
//             horario_servicio: serviceData.hoursPerDay
//               ? `${serviceData.hoursPerDay}h/día`
//               : "Por definir",
//             fecha_fin_servicio: serviceData.projectEndDate || null,
//           };
  
//           const res = await CreateRequestService(solicitudId, servicioPayload);
//           if ("error" in res) {
//             setRootError(`Error en camión "${truck.name}": ${res.error.error}`);
//             return false;
//           }
//         }
  
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al guardar los camiones. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     /**
//      * Paso 7 → Envío final (navega al completar)
//      * Las observaciones podrían actualizarse en la solicitud si tu backend lo permite.
//      */
//     const submitStep7 = async (preferences: PreferencesData): Promise<boolean> => {
//       setIsLoading(true);
//       setRootError(null);
  
//       try {
//         // Si tu backend tiene un endpoint PATCH /solicitudes/:id para actualizar obs,
//         // agrégalo aquí. Por ahora navegamos directamente.
//         console.log("Observaciones finales:", preferences);
  
//         navigate("/intranet/solicitudes/mis-solicitudes", { replace: true });
//         return true;
//       } catch {
//         setRootError("Ocurrió un error al finalizar. Comuníquese con sistemas.");
//         return false;
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     return {
//       isLoading,
//       rootError,
//       clienteId,
//       solicitudId,
//       clearError: () => setRootError(null),
//       // Handlers por paso
//       submitStep2,
//       submitStep3,
//       submitStep4,
//       submitStep5,
//       submitStep6,
//       submitStep7,
//     };
//   }