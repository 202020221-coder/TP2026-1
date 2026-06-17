import { Plus, SquareChartGantt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import { QuotationServicesTable } from "./ServicesTable";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";
import { useQuotationReferenceStore } from "@/intranet/quotation/hooks/stores/quotation.reference.store.provider";
import { Button } from "@/shared/components/ui/button";
import { AddServicesDialog } from "./AddServicesDialog";
import { computeServiceDates } from "@/intranet/quotation/lib/quotationSchedule";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";
import type { QuotationPhase } from "@/intranet/quotation/interfaces/phases.types";

import { useIncidentQuotationMode } from "@/intranet/quotation/context/IncidentQuotationModeContext";

export const CreateQuotationServicesSection: FC = () => {
  const incidentCatalog = useIncidentQuotationMode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const items = useQuotationServiceStore((s) => s.items);
  const deleteItem = useQuotationServiceStore((s) => s.removeItem);
  const updateItem = useQuotationServiceStore((s) => s.updateItem);
  const addItems = useQuotationServiceStore((s) => s.addItems);

  const phases = useQuotationReferenceStore((s) => s.phases);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );
  const updateReference = useQuotationReferenceStore((s) => s.update);

  const services = useMemo(() => Object.values(items), [items]);

  // Las fechas de cada servicio se calculan según el día de inicio del proyecto
  // y la etapa en la que ocurre (no editables). Se sincronizan en el store para
  // que el resumen, el PDF y el envío usen siempre las fechas vigentes.
  useEffect(() => {
    for (const service of Object.values(items)) {
      const { startDate, dueDate } = computeServiceDates(
        service,
        projectStartDate,
        phases,
      );
      if (service.startDate !== startDate) {
        updateItem(service.id, "startDate", startDate);
      }
      if (service.dueDate !== dueDate) {
        updateItem(service.id, "dueDate", dueDate);
      }
    }
  }, [items, projectStartDate, phases, updateItem]);

  // Autocompleta las fases del proyecto con las fases predeterminadas de los
  // servicios agregados, evitando duplicar fases por nombre.
  const mergeServicePhases = (incoming: QuotationPhase[]) => {
    if (!incoming || incoming.length === 0) return;
    const existing = phases.items;
    const existingNames = new Set(
      existing.map((p) => p.name.trim().toLowerCase()),
    );
    const toAdd = incoming.filter(
      (p) => !existingNames.has(p.name.trim().toLowerCase()),
    );
    if (toAdd.length === 0) return;
    updateReference("phases", { items: [...existing, ...toAdd] });
    toast.success(
      `Se autocompletaron ${toAdd.length} fase${toAdd.length !== 1 ? "s" : ""} del servicio.`,
    );
  };

  return (
    <Card className="gap-4 border bg-card shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <SquareChartGantt className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Servicios Cotizados
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          {incidentCatalog
            ? "Agregue servicios del catálogo de incidencias. Ningún servicio puede ser principal."
            : "Interactúa con los servicios seleccionados por el cliente, cambia precios y elimina o agrega nuevos items."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="ml-auto flex mb-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus /> Agregar Servicios
        </Button>
        <AddServicesDialog
          addHandler={(items, servicePhases) => {
            addItems(
              items.map(
                (i): DesiredQuotationData["services"][number] => ({
                  id: i.id,
                  name: i.name,
                  unitPrice: i.unitPrice,
                  startDate: i.startDate,
                  dueDate: i.dueDate,
                  scheduleStart: i.scheduleStart,
                  scheduleEnd: i.scheduleEnd,
                  isPrincipal: false,
                }),
              ),
            );
            if (servicePhases && !incidentCatalog) mergeServicePhases(servicePhases);
          }}
          incidentCatalog={incidentCatalog}
          onOpenChange={setIsDialogOpen}
          open={isDialogOpen}
        />
        <QuotationServicesTable
          items={services}
          onDelete={deleteItem}
          onUpdateSchedule={(id, field, value) =>
            updateItem(id, field, value)
          }
          onUpdateUnitPrice={(id, unitPrice) =>
            updateItem(id, "unitPrice", unitPrice)
          }
          readOnly={false}
        />
      </CardContent>
    </Card>
  );
};
