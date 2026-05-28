import { SquareChartGantt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useMemo, type FC } from "react";
import { QuotationServicesTable } from "./ServicesTable";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";

export const CreateQuotationServicesSection: FC = () => {
  const items = useQuotationServiceStore((s) => s.items);
  const deleteItem = useQuotationServiceStore((s) => s.removeItem);
  const updateItem = useQuotationServiceStore((s) => s.updateItem);
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
