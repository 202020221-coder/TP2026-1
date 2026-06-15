import { useMemo, type FC } from "react";
import { TruckSelector } from "./TruckSelector";
import { useQuotationTruckStore } from "@/intranet/quotation/hooks/stores/quotation.truck.store.provider";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";
import { useQuotationReferenceStore } from "@/intranet/quotation/hooks/stores/quotation.reference.store.provider";
import {
  computeServiceDates,
  toDateTimeStart,
} from "@/intranet/quotation/lib/quotationSchedule";

export const CreateQuotationTruckSelector: FC = () => {
  const selectedTrucks = useQuotationTruckStore((s) => s.selectedTrucks);
  const setSelectedTrucks = useQuotationTruckStore((s) => s.setSelectedTrucks);
  const serviceItems = useQuotationServiceStore((s) => s.items);
  const phases = useQuotationReferenceStore((s) => s.phases);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );

  // Servicios/subservicios disponibles para vincular un camión (atributo "uso"
  // de COTIZACION_CAMION), con el rango de fechas en que ocurre cada uno.
  const serviceOptions = useMemo(
    () =>
      Object.values(serviceItems).map((service) => {
        const { startDate, dueDate } = computeServiceDates(
          service,
          projectStartDate,
          phases,
        );
        return {
          id: service.id,
          name: service.name ?? `Servicio #${service.id}`,
          startDate,
          dueDate,
        };
      }),
    [serviceItems, projectStartDate, phases],
  );

  // Al elegir el servicio, las fechas de entrada/salida del camión se rigen por
  // la duración (de día a día) de ese servicio. Se guarda como DATETIME con
  // hora 00:00:00 (por ahora solo importa la fecha).
  const handleUpdateUsage = (plate: string, uso: string) => {
    const option = serviceOptions.find((o) => o.id === uso);
    setSelectedTrucks(
      selectedTrucks.map((truck) =>
        truck.plate === plate
          ? {
              ...truck,
              uso: uso || null,
              fecha_hora_entrada: option
                ? toDateTimeStart(option.startDate)
                : null,
              fecha_hora_salida: option
                ? toDateTimeStart(option.dueDate)
                : null,
            }
          : truck,
      ),
    );
  };

  return (
    <TruckSelector
      selectedTrucks={selectedTrucks}
      onSelectedTrucks={setSelectedTrucks}
      serviceOptions={serviceOptions}
      onUpdateTruckUsage={handleUpdateUsage}
      readOnly={false}
    />
  );
};
