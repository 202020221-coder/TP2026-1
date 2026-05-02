import { RadioGroup } from "@/shared/components/ui/radio-group";
import { memo, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircle, Truck as TruckIcon } from "lucide-react";
import { useTruckSelector } from "./useTruckSelector";
import { Field, FieldContent, FieldLabel } from "@/shared/components/ui/field";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { differenceInDays, format } from "date-fns";
import { RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Badge } from "@/shared/components/ui/badge";
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";

interface TruckSelectorProps {
  readOnly?: boolean;
  selectedTruck?: Truck;
  onSelectedTruck?: (truck: Truck) => void;
}

export const TruckSelector: FC<TruckSelectorProps> = ({
  readOnly,
  selectedTruck,
  onSelectedTruck,
}) => {
  const { setPage, trucksQuery } = useTruckSelector();
  const { status, data, isPending } = trucksQuery;
  return (
    <Card className="gap-4 border bg-card shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <TruckIcon className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Selección de camión
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Selecciona el camión que va estar vinculado a la cotización.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "pending" && (
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TruckCardSkeleton />
              <TruckCardSkeleton />
              <TruckCardSkeleton />
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error al cargar camiones
          </div>
        )}
        {status === "success" && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <RadioGroup
                value={selectedTruck?.Placa}
                onValueChange={(placa) => {
                  const truck = data.data.find((t) => t.Placa === placa)                  
                  onSelectedTruck?.(truck!);
                }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((truck) => (
                    <TruckCard
                      key={truck.Placa}
                      truck={truck}
                      readOnly={readOnly}
                    />
                  ))}
                </div>
              </RadioGroup>
            </div>
        )}

        {data && (
          <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3">
            <PaginationControls
              currentPage={data.pagination.page}
              onPageChange={setPage}
              isLoading={isPending}
              totalPages={data.pagination.totalPages}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TruckCardProps {
  truck: Truck;
  readOnly?: boolean;
}

const TruckCard: FC<TruckCardProps> = memo(({ truck, readOnly = false }) => {
  const revisionDate = new Date(truck.fecha_prox_revision);
  const today = new Date();
  const daysUntilRevision = differenceInDays(revisionDate, today);
  const needsRevisionSoon = daysUntilRevision <= 30 && daysUntilRevision >= 0;
  return (
    <FieldLabel
      htmlFor={truck.Placa}
      className={`
        cursor-pointer
        block
        rounded-lg
        border
        bg-card
        p-4
        transition-all
        h-full
        hover:border-primary
        hover:shadow-sm
        data-[state=checked]:border-primary
        data-[state=checked]:ring-4
        data-[state=checked]:ring-primary/30
        data-[state=checked]:bg-primary/5
      `}
    >
      <Field className="gap-3 p-0">
        <RadioGroupItem
          value={truck.Placa}
          id={truck.Placa}
          className="sr-only"
          disabled={readOnly}
        />
        <FieldContent className="space-y-3">
          {/* HEADER */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold tracking-tight">
                {truck.Placa}
              </span>
              <Badge variant={needsRevisionSoon ? "destructive" : "secondary"}>
                {needsRevisionSoon ? "Revisión próxima" : "Vigente"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {truck.nombre}
            </div>
          </div>
          {/* DETAILS */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              {truck.modelo} • {truck.ano_fabricacion}
            </div>
            <div className="text-xs">{truck.color}</div>
            <div className="text-xs">
              Próx revisión: {format(revisionDate, "dd MMM yyyy")}
            </div>
          </div>
        </FieldContent>
      </Field>
    </FieldLabel>
  );
});

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const PaginationControls: FC<PaginationControlsProps> = memo(
  ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
    return (
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="flex items-center gap-1"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>

        <span className="text-xs text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
      </div>
    );
  },
);

const TruckCardSkeleton: FC = memo(() => {
  return (
    <FieldLabel
      className="
        block
        rounded-lg
        border
        bg-card
        p-4
        h-full
        cursor-default
      "
    >
      <Field className="gap-3 p-0">
        <FieldContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 bg-muted" />
              <Skeleton className="h-5 w-28 bg-muted" />
            </div>
            <Skeleton className="h-4 w-40 bg-muted" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 bg-muted" />
            <Skeleton className="h-3 w-28 bg-muted" />
            <Skeleton className="h-3 w-36 bg-muted" />
          </div>
        </FieldContent>
      </Field>
    </FieldLabel>
  );
});
