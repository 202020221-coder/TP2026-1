import { getAvailableDrivers } from "@/intranet/quotation/api/order.api";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { TruckDriverSelectorSkeleton } from "./TruckDriverSelectorSkeleton";
import { useTruck } from "@/intranet/quotation/hooks/stores/orderTruckStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircle, UserRound } from "lucide-react";

export const TruckDriverSelector = () => {
  const selectedTruckDriver = useTruck((s) => s.selectedTruckDriver);
  const update = useTruck((s) => s.update);
  const { status, data, error } = useQuery({
    queryKey: ["available", "drivers"],
    queryFn: () => getAvailableDrivers({}),
  });

  const Header = () => (
    <CardHeader className="pb-0">
      <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
        <UserRound className="text-primary" />
        <span className="pb-0.5 font-[375] text-[18px]">
          {" "}
          Conductor Asignado
        </span>
      </CardTitle>
      <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
        Selecciona el conductor para el camión.
      </CardDescription>
    </CardHeader>
  );

  // LOADING STATE
  if (status === "pending") {
    return <TruckDriverSelectorSkeleton />;
  }

  // ERROR STATE
  if (status === "error") {
    console.log(error);
    return (
      <Card className="gap-4 border bg-card shadow-none">
        <Header />
        <CardContent>
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error al cargar conductores
          </div>
        </CardContent>
      </Card>
    );
  }

  // EMPTY STATE
  if (!data || data.length === 0) {
    return (
      <Card className="gap-4 border bg-card shadow-none">
        <Header />
        <CardContent>
          <Select disabled>
            <SelectTrigger className="h-14 border-primary/30 bg-primary/10 px-4 text-foreground">
              <SelectValue placeholder="Sin conductores disponibles" />
            </SelectTrigger>
          </Select>
        </CardContent>
      </Card>
    );
  }

  // SUCCESS STATE
  return (
    <Card className="gap-4 border bg-card shadow-none">
      <Header />
      <CardContent>
        <Select
          value={JSON.stringify(selectedTruckDriver)}
          onValueChange={(JSONDriver) => update("selectedTruckDriver", JSON.parse(JSONDriver))}
        >
          <SelectTrigger className="h-14 w-full border-primary/30 bg-primary/10 px-4 text-foreground">
            <SelectValue placeholder="Seleccionar conductor" />
          </SelectTrigger>

          <SelectContent align="center" position="item-aligned">
            {data.map((driver) => {
              const initials = `${driver.Nombre[0]}${driver.Apellido[0]}`;

              return (
                <SelectItem
                  key={driver.DNI}
                  value={JSON.stringify(driver)}
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
      </CardContent>
    </Card>
  );
};
