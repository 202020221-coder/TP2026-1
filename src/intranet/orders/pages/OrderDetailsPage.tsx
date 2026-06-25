import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { OrderDetailsInfoSection } from "../components/details/OrderDetailsInfoSection";
import { OrderDetailsContactSection } from "../components/details/OrderDetailsContactSection";
import { OrderDetailsServicesSection } from "../components/details/OrderDetailsServicesSection";
import { OrderDetailsInventorySection } from "../components/details/OrderDetailsInventorySection";
import { OrderDetailsObservationsSection } from "../components/details/OrderDetailsObservationsSection";
import { useOrderDetails } from "./useOrderDetails";

export function OrderDetailsPage() {
  const { idValid, navigate, orderDetailsQuery } = useOrderDetails();
  const { isError, isPending, data } = orderDetailsQuery;
  
  if (!idValid) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 gap-4">
        <h2 className="text-xl font-semibold">ID de solicitud inválido</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/intranet/solicitudes")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al listado
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 gap-4">
        <h2 className="text-xl font-semibold">Error al cargar la solicitud</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          No se pudieron obtener los datos de la solicitud. Intenta de nuevo más
          tarde.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/intranet/solicitudes")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado
          </Button>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (isPending || !data) {
    return <PageSkeleton />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Detalle de Solicitud
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/intranet/solicitudes")}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Regresar
        </Button>
      </div>

      <OrderDetailsInfoSection order={data} />
      <OrderDetailsContactSection medios={data.medios} />
      <OrderDetailsServicesSection order={data} />
      <OrderDetailsInventorySection inventario={data.inventario} />
      <OrderDetailsObservationsSection order={data} />
    </div>
  );
}

const PageSkeleton = () => (
  <div className="p-8 space-y-6">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-1 rounded-full" />
        <Skeleton className="h-7 w-52" />
      </div>
      <Skeleton className="h-9 w-28" />
    </div>

    <Card className="border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-56" />
        </div>
      </CardContent>
    </Card>

    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>

    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full rounded-lg" />
      </CardContent>
    </Card>
  </div>
);

export default OrderDetailsPage;
