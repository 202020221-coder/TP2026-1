import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/shared/components/ui/table";
import { memo, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Bird, Eraser } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";
import { formatJornada } from "@/intranet/quotation/lib/quotationSchedule";

type Service = DesiredQuotationData["services"][number];

type UpdateScheduleHandler = (
  id: Service["id"],
  field: "scheduleStart" | "scheduleEnd",
  value: string,
) => void;
type UpdateUnitPriceHandler = (id: Service["id"], unitPrice: Service["unitPrice"]) => void;
type DeleteHandler = (id: Service["id"]) => void;

type OptionalProps =
  | {
      readOnly: true;
      onUpdateSchedule: undefined;
      onUpdateUnitPrice: undefined;
      onDelete: undefined;
    }
  | {
      readOnly: false;
      onUpdateSchedule: UpdateScheduleHandler;
      onUpdateUnitPrice: UpdateUnitPriceHandler;
      onDelete: DeleteHandler;
    };

type ServicesTableProps = {
  items: Service[];
} & OptionalProps;

const serviceDays = (service: Service): number => {
  if (!service.startDate || !service.dueDate) return 0;
  const diff = differenceInDays(
    parseISO(service.dueDate),
    parseISO(service.startDate),
  );
  return Number.isFinite(diff) ? Math.max(0, diff) : 0;
};

export const QuotationServicesTable: FC<ServicesTableProps> = memo(
  ({ items, ...rest }) => {
    const readOnly = rest.readOnly;
    const colCount = readOnly ? 7 : 8;
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur supports-backdrop-filter:bg-muted/60 overflow-hidden">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[200px] overflow-hidden">
                Nombre
              </TableHead>
              <TableHead className="text-center min-w-[240px]">Jornada</TableHead>
              <TableHead className="text-center min-w-[130px]">F. Inicio</TableHead>
              <TableHead className="text-center min-w-[130px]">F. Vencimiento</TableHead>
              <TableHead className="text-center min-w-[70px]">Días</TableHead>
              <TableHead className="text-center min-w-[110px]">P. Unitario {"($)"}</TableHead>
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
    onUpdateUnitPrice,
    onDelete,
  }) => {
    const days = serviceDays(service);
    return (
    <TableRow
      key={service.id}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell>{service.id}</TableCell>
      <TableCell className="whitespace-break-spaces">
        <div className="flex flex-col gap-1">
          <span>{service.name ?? "-"}</span>
          {service.isPrincipal && (
            <Badge variant="secondary" className="w-fit text-[10px]">
              Principal
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {readOnly ? (
          <span className="text-sm text-foreground">
            {formatJornada(service.scheduleStart, service.scheduleEnd)}
          </span>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <Input
              type="time"
              value={service.scheduleStart}
              className="h-9 w-[110px] border-border bg-background text-sm"
              onChange={(e) =>
                onUpdateSchedule?.(service.id, "scheduleStart", e.target.value)
              }
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="time"
              value={service.scheduleEnd}
              className="h-9 w-[110px] border-border bg-background text-sm"
              onChange={(e) =>
                onUpdateSchedule?.(service.id, "scheduleEnd", e.target.value)
              }
            />
          </div>
        )}
      </TableCell>
      {/* Las fechas se calculan según el día de inicio y la etapa (no editables). */}
      <TableCell className="text-center">
        <span className="text-sm text-foreground">{service.startDate}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="text-sm text-foreground">{service.dueDate}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="text-sm text-foreground">{days}</span>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          {readOnly ? (
            <span className="text-sm text-foreground">${service.unitPrice}</span>
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
          {service.pagoPorDia && (
            <Badge variant="outline" className="text-[10px]">
              × {days} día{days !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
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
    );
  },
);
