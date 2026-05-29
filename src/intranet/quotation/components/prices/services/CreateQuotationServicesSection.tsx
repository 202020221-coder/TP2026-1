import { Plus, SquareChartGantt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useMemo, useState, type FC } from "react";
import { QuotationServicesTable } from "./ServicesTable";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";
import { Button } from "@/shared/components/ui/button";
import { AddServicesDialog } from "./AddServicesDialog";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";

export const CreateQuotationServicesSection: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const items = useQuotationServiceStore((s) => s.items);
  const deleteItem = useQuotationServiceStore((s) => s.removeItem);
  const updateItem = useQuotationServiceStore((s) => s.updateItem);
  const addItems = useQuotationServiceStore((s) => s.addItems);
  const services = useMemo(() => Object.values(items), [items]);

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
          Interactúa con los servicios seleccionados por el cliente, cambia
          precios y elimina o agrega nuevos items.
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
          addHandler={(items) =>
            addItems(
              items.map(
                (i): DesiredQuotationData["services"][number] => ({
                  id: i.id,
                  name: i.name,
                  unitPrice: i.unitPrice,
                  startDate: i.startDate,
                  dueDate: i.dueDate,
                  schedule: i.schedule,
                }),
              ),
            )
          }
          onOpenChange={setIsDialogOpen}
          open={isDialogOpen}
        />
        <QuotationServicesTable
          items={services}
          onDelete={deleteItem}
          onUpdateSchedule={(id, schedule) =>
            updateItem(id, "schedule", schedule)
          }
          onUpdateStartDate={(id, startDate) =>
            updateItem(id, "startDate", startDate)
          }
          onUpdateDueDate={(id, dueDate) =>
            updateItem(id, "dueDate", dueDate)
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
