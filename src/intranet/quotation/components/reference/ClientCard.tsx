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
import { Building } from "lucide-react";
import type { Client } from "../../interfaces/create/client";

export const ClientCard: FC<{ client: Client }> = ({ client }) => {
  const isCompany = client.DNI_O_RUC.length > 8;

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
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DNI / RUC */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              {isCompany ? "RUC" : "DNI"}
            </p>
            <Input
              value={client.DNI_O_RUC}
              disabled
              className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
            />
          </div>

          {/* Nombre Comercial */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              Nombre Comercial
            </p>
            <Input
              value={client.nombre_comercial}
              disabled
              className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
            />
          </div>

          {/* Razón Social */}
          <div className="sm:col-span-2 space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              Cliente / Razón Social
            </p>
            <Input
              value={client.razon_social}
              disabled
              className="
                  h-10
                  disabled:bg-muted
                  disabled:text-foreground
                "
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
