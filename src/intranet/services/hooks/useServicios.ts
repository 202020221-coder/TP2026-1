import { useListServicios } from "../context/ListServiciosContext";

export const useServicios = () => {
  const ctx = useListServicios();
  return ctx;
};
