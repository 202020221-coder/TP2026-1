import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/shared/components/ui/table";
import { memo, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Bird, Eraser } from "lucide-react";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";

type Service = DesiredQuotationData["services"][number];

type UpdateScheduleHandler = (id: Service["id"], schedule: Service["schedule"]) => void;
type UpdateStartDateHandler = (id: Service["id"], startDate: Service["startDate"]) => void;
type UpdateDueDateHandler = (id: Service["id"], dueDate: Service["dueDate"]) => void;
type UpdateUnitPriceHandler = (id: Service["id"], unitPrice: Service["unitPrice"]) => void;
type DeleteHandler = (id: Service["id"]) => void;

type OptionalProps =
  | {
      readOnly: true;
      onUpdateSchedule: undefined;
      onUpdateStartDate: undefined;
      onUpdateDueDate: undefined;
      onUpdateUnitPrice: undefined;
      onDelete: undefined;
    }
  | {
      readOnly: false;
      onUpdateSchedule: UpdateScheduleHandler;
      onUpdateStartDate: UpdateStartDateHandler;
      onUpdateDueDate: UpdateDueDateHandler;
      onUpdateUnitPrice: UpdateUnitPriceHandler;
      onDelete: DeleteHandler;
    };

type ServicesTableProps = {
  items: Service[];
} & OptionalProps;

export const QuotationServicesTable: FC<ServicesTableProps> = memo(
  ({ items, ...rest }) => {
    const readOnly = rest.readOnly;
    const colCount = readOnly ? 6 : 7;
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur supports-backdrop-filter:bg-muted/60 overflow-hidden">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[200px] overflow-hidden">
                Nombre
              </TableHead>
              <TableHead className="text-center min-w-[140px]">Jornada</TableHead>
              <TableHead className="text-center min-w-[130px]">F. Inicio</TableHead>
              <TableHead className="text-center min-w-[130px]">F. Vencimiento</TableHead>
              <TableHead className="text-center min-w-[100px]">P. Unitario {"($)"}</TableHead>
              {!readOnly && (
                <TableHead className="text-center">Acción</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="bg-gray-50 h-56">
                  <div className="h-full flex flex-col">
                    <Bird className="flex-1 w-auto stroke-1 text-gray-400" />
                    <div className="text-center space-y-1">
                      <h2 className="font-bold text-lg text-gray-500">
                        Sin Servicios
                      </h2>
                      <p className="text-md text-gray-500">
                        No hay servicios registrados en esta cotización.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <ServiceRow key={item.id} service={item} {...rest} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  },
);

type ServiceRowProps = { service: Service } & OptionalProps;
const ServiceRow: FC<ServiceRowProps> = memo(
  ({
    service,
    readOnly,
    onUpdateSchedule,
    onUpdateStartDate,
    onUpdateDueDate,
    onUpdateUnitPrice,
    onDelete,
  }) => (
    <TableRow
      key={service.id}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell>{service.id}</TableCell>
      <TableCell className="whitespace-break-spaces">
        {service.name ?? "-"}
      </TableCell>
      <TableCell className="text-center">
        {readOnly ? (
          <span className="text-sm text-foreground">{service.schedule}</span>
        ) : (
          <Input
            value={service.schedule}
            className="h-9 border-border bg-background text-sm"
            onChange={(e) =>
              onUpdateSchedule?.(service.id, e.target.value)
            }
          />
        )}
      </TableCell>
      <TableCell className="text-center">
        {readOnly ? (
          <span className="text-sm text-foreground">{service.startDate}</span>
        ) : (
          <Input
            type="date"
            value={service.startDate}
            className="h-9 border-border bg-background text-sm"
            onChange={(e) =>
              onUpdateStartDate?.(service.id, e.target.value)
            }
          />
        )}
      </TableCell>
      <TableCell className="text-center">
        {readOnly ? (
          <span className="text-sm text-foreground">{service.dueDate}</span>
        ) : (
          <Input
            type="date"
            value={service.dueDate}
            className="h-9 border-border bg-background text-sm"
            onChange={(e) =>
              onUpdateDueDate?.(service.id, e.target.value)
            }
          />
        )}
      </TableCell>
      <TableCell className="text-center">
        {readOnly ? (
          <span className="text-sm text-foreground">
            ${service.unitPrice}
          </span>
        ) : (
          <Input
            type="number"
            min={0.01}
            step={0.01}
            value={service.unitPrice}
            className="h-9 border-border bg-background text-sm"
            onChange={(e) =>
              onUpdateUnitPrice?.(service.id, Number(e.target.value))
            }
          />
        )}
      </TableCell>
      {!readOnly && (
        <TableCell className="text-center">
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(service.id)}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  ),
);
