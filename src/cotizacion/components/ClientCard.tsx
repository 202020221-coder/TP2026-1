import type { FC } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Building } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "../api/client.api";
import sleep from "@/shared/lib/sleep";

export const ClientCard: FC<{ clientId: string }> = ({ clientId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      await sleep(1000);
      const answer = await getClient(clientId);
      return answer;
    },
  });

  if (error) {
    console.log(error);
    return <p className="text-destructive">Error al traer datos del cliente</p>;
  }

  const isCompany = !isPending && data?.DNI_O_RUC.length > 8;

  return (
    <Card className="border shadow-none">
      {/* Header */}
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <Building className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Datos del Cliente
          </span>
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>
            Visualiza la información del cliente obtenida durante la elaboración
            de su solicitud.
          </span>

          {isPending ? (
            <Skeleton className="h-6 w-28 rounded-full bg-muted" />
          ) : (
            <Badge
              variant="outline"
              className={
                isCompany
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-secondary-foreground"
              }
            >
              {isCompany ? "Empresa" : "Persona Natural"}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DNI / RUC */}
          <div className="space-y-1.5">
            {isPending ? (
              <Skeleton className="h-5 w-16 bg-muted" />
            ) : (
              <p className="text-sm font-medium text-muted-foreground">
                {isCompany ? "RUC" : "DNI"}
              </p>
            )}

            {isPending ? (
              <Skeleton className="h-10 w-full rounded-md bg-muted" />
            ) : (
              <Input
                value={data.DNI_O_RUC}
                disabled
                className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
              />
            )}
          </div>

          {/* Nombre Comercial */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              Nombre Comercial
            </p>

            {isPending ? (
              <Skeleton className="h-10 w-full rounded-md bg-muted" />
            ) : (
              <Input
                value={data.nombre_comercial}
                disabled
                className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
              />
            )}
          </div>

          {/* Razón Social */}
          <div className="sm:col-span-2 space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              Cliente / Razón Social
            </p>

            {isPending ? (
              <Skeleton className="h-10 w-full rounded-md bg-muted" />
            ) : (
              <Input
                value={data.razon_social}
                disabled
                className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
