import { getAvailableDrivers } from "@/cotizacion/api/order.api";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/field";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { TruckDriverSelectorSkeleton } from "./TruckDriverSelectorSkeleton";
import { useTruck } from "@/cotizacion/hooks/stores/orderTruckStore";

export const TruckDriverSelector = () => {
  const selectedTruckDriverID = useTruck((s) => s.selectedTruckDriverID);
  const update = useTruck((s) => s.update);
  const { status, data, error } = useQuery({
    queryKey: ["available", "drivers"],
    queryFn: () => getAvailableDrivers({}),
  });

  // LOADING STATE
  if (status === "pending") {
    return <TruckDriverSelectorSkeleton />;
  }

  // ERROR STATE
  if (status === "error") {
    console.log(error);
    return (
      <Field>
        <FieldLabel>Conductor asignado</FieldLabel>

        <FieldContent>
          <div className="text-sm text-destructive">
            Error al cargar conductores
          </div>
        </FieldContent>
      </Field>
    );
  }

  // EMPTY STATE
  if (!data || data.length === 0) {
    return (
      <Field>
        <FieldLabel>Conductor asignado</FieldLabel>
        <FieldContent>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sin conductores disponibles" />
            </SelectTrigger>
          </Select>
        </FieldContent>
      </Field>
    );
  }

  // SUCCESS STATE
  return (
    <Field className="space-y-2">
      <FieldLabel>Conductor asignado</FieldLabel>

      <FieldContent>
        <Select
          value={selectedTruckDriverID}
          onValueChange={(DNI) => update("selectedTruckDriverID", DNI)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Seleccionar conductor" />
          </SelectTrigger>

          <SelectContent>
            {data.map((driver) => {
              const initials = `${driver.Nombre[0]}${driver.Apellido[0]}`;

              return (
                <SelectItem
                  key={driver.DNI}
                  value={driver.DNI}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150`}
                        alt={`${driver.Nombre} ${driver.Apellido}`}
                      />

                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {driver.Nombre} {driver.Apellido}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        DNI: {driver.DNI}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  );
};
