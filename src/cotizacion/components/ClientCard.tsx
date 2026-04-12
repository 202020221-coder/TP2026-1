import type { FC } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "../api/client.api";

export const ClientCard: FC<{ clientId: string }> = ({ clientId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId),
  });

  if (isPending) {
    return <p>Cargando...</p>;
  }

  if (error) {
    console.log(error);
    return <p className="text-destructive">Error al traer datos del cliente</p>;
  }

  const { DNI_O_RUC, nombre_comercial, razon_social } = data;

  const isCompany = DNI_O_RUC.length>8
  return (
    <Card className={`shadow-none h-[85%] sm:flex sm:h-auto`}>
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <Building />
          <span className="pb-0.5 font-[375]">Datos del Cliente</span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Información del cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-5">
        <div className="sm:col-span-2 flex justify-between items-center">
          <span className="rounded-full px-3 py-1 text-[14px] font-medium border bg-blue-200 text-blue-600 border-blue-400">
            {isCompany?"Empresa":"Persona Natural"}
          </span>
        </div>
        <div>
          <p className="font-medium text-[14px] mb-0.5">{isCompany?"RUC":"DNI"}</p>
          <Input
            value={DNI_O_RUC}
            disabled
            className="h-14 md:h-9 disabled:bg-gray-100 disabled:text-black"
          />
        </div>
        <div>
          <p className="font-medium text-[14px] mb-0.5">Nombre Comercial</p>
          <Input
            value={nombre_comercial}
            disabled
            className="h-14 md:h-9 disabled:bg-gray-100 disabled:text-black"
          />
        </div>
        <div>
          <p className="font-medium text-[14px] mb-0.5">
            "Cliente/Razón Social"
          </p>
          <Input
            value={razon_social}
            disabled
            className="h-14 md:h-9 disabled:bg-gray-100 disabled:text-black"
          />
        </div>
      </CardContent>
    </Card>
  );
};
