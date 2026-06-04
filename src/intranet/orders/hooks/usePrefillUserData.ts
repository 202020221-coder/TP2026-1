import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { GetPerfilEmpresasContacto } from "../api";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type {
  ClientFormData,
  ContactFormData,
  PerfilFormData,
} from "../components/create/types";

/**
 * Autocompleta la creación de solicitudes con los datos del usuario logueado:
 *  - Solicitante (Nombre, Apellido, DNI, Email): desde la sesión.
 *  - Datos del cliente/empresa: desde `/perfiles/{DNI_perfil}/empresas_contacto`.
 * Los campos sólo se rellenan si están vacíos; el usuario puede editarlos.
 */
export function usePrefillUserData(
  setFormData: Dispatch<SetStateAction<ClientFormData>>,
  setPerfilData: Dispatch<SetStateAction<PerfilFormData>>,
  setContactData: Dispatch<SetStateAction<ContactFormData>>,
) {
  const loggedUser = useSession((state) => state.loggedUser);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (!loggedUser) return;

    const dni = loggedUser.dni_perfil?.trim();
    if (!dni) return;

    hasRun.current = true;

    // Datos del solicitante: provienen directamente de la sesión.
    setPerfilData((prev) => ({
      ...prev,
      DNI: prev.DNI || dni,
      Nombre: prev.Nombre || (loggedUser.nombres ?? ""),
      Apellido: prev.Apellido || (loggedUser.apellidos ?? ""),
      correo_contacto: prev.correo_contacto || (loggedUser.correo ?? ""),
    }));
    setContactData((prev) => ({ ...prev, DNI_perfil: prev.DNI_perfil || dni }));

    (async () => {
      try {
        const empresas = await GetPerfilEmpresasContacto(dni);

        // Usa la última empresa asociada al perfil (la más reciente).
        const empresa = empresas[empresas.length - 1];
        if (!empresa) return;

        setFormData((prev) => ({
          ...prev,
          DNI_O_RUC: empresa.DNI_O_RUC || prev.DNI_O_RUC,
          nombre_comercial: empresa.nombre_comercial || prev.nombre_comercial,
          razon_social: empresa.razon_social || prev.razon_social,
          rubro: empresa.rubro || prev.rubro,
          ubicacion_facturacion:
            empresa.ubicacion_facturacion || prev.ubicacion_facturacion,
          observacion: empresa.observacion || prev.observacion,
        }));

        setContactData((prev) => ({
          ...prev,
          cargo_en_empresa: empresa.cargo_en_empresa || prev.cargo_en_empresa,
          lugar_trabajo: empresa.lugar_trabajo || prev.lugar_trabajo,
        }));
      } catch (error) {
        // Si falla, el usuario completa los datos manualmente.
        console.warn(
          "[autocompletado solicitud] no se pudieron obtener las empresas del perfil",
          error,
        );
        hasRun.current = false;
      }
    })();
  }, [loggedUser, setFormData, setPerfilData, setContactData]);
}
