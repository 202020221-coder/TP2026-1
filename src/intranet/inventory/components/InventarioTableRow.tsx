import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, History, MapPin, Pencil } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { formatCurrency } from "@/shared/lib/format-currency";
import type {
  InventarioItem,
  InventarioMovimiento,
  InventarioUbicacionesResponse,
} from "../interfaces/inventory.interface";
import { inventoryApi } from "../api/inventory.api";

type StatusBadge = {
  label: string;
  className: string;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return formatCurrency(value, "PEN", 2);
};

const formatMovementDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMovementType = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  return value.replaceAll("_", " ");
};

const formatMovementLocation = (
  tipo?: string | null,
  id?: string | number | null,
) => {
  const tipoLabel = tipo?.trim() ?? "";
  const idLabel = id !== null && id !== undefined ? String(id).trim() : "";

  if (!tipoLabel && !idLabel) {
    return "-";
  }

  if (!idLabel) {
    return tipoLabel || "-";
  }

  if (!tipoLabel) {
    return idLabel;
  }

  return `${tipoLabel} ${idLabel}`;
};

const formatMovementReference = (
  tabla?: string | null,
  id?: number | null,
) => {
  const tablaLabel = tabla?.trim() ?? "";
  const idLabel = id !== null && id !== undefined ? String(id) : "";

  if (!tablaLabel && !idLabel) {
    return "-";
  }

  if (!idLabel) {
    return tablaLabel || "-";
  }

  if (!tablaLabel) {
    return `#${idLabel}`;
  }

  return `${tablaLabel} #${idLabel}`;
};

const formatNullableDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  return formatDate(value);
};

const getEstadoBadge = (estado?: string | null): StatusBadge => {
  const normalized = typeof estado === "string" ? estado.trim().toLowerCase() : "";

  switch (normalized) {
    case "disponible":
      return {
        label: "Disponible",
        className: "bg-green-100 text-green-800 border-green-300",
      };
    case "en mantenimiento":
      return {
        label: "En mantenimiento",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    case "malogrado":
      return {
        label: "Malogrado",
        className: "bg-red-100 text-red-800 border-red-300",
      };
    case "en trabajo":
      return {
        label: "En trabajo",
        className: "bg-blue-100 text-blue-800 border-blue-300",
      };
    default:
      return {
        label: normalized ? normalized : "Sin estado",
        className: "bg-gray-200 text-gray-600 border-gray-300",
      };
  }
};

const getMantBadge = (value?: string | null): StatusBadge => {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (normalized === "si") {
    return {
      label: "Requiere",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }

  if (normalized === "no") {
    return {
      label: "No requiere",
      className: "bg-gray-200 text-gray-700 border-gray-300",
    };
  }

  return {
    label: "Sin dato",
    className: "bg-gray-200 text-gray-700 border-gray-300",
  };
};

const renderDetailPairs = (pairs: Array<[string, string]>) =>
  pairs.map(([label, value]) => (
    <div
      key={label}
      className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-2 last:border-b-0 last:pb-0"
    >
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-right font-medium text-foreground break-words max-w-[220px]">
        {value}
      </span>
    </div>
  ));

export const InventarioTableRow: FC<{
  item: InventarioItem;
  onEdit: (id: number) => void;
}> = ({ item, onEdit }) => {
  const [movimientosOpen, setMovimientosOpen] = useState(false);
  const [ubicacionesOpen, setUbicacionesOpen] = useState(false);
  const estadoBadge = getEstadoBadge(item.estado);
  const mantenimientoBadge = getMantBadge(item.mant_requerimiento);
  const fabricanteLabel = item.Fabricante_Nombre?.trim() || "Sin fabricante";

  const movimientosQuery = useQuery({
    queryKey: ["inventario", "movimientos", item.Id_Objeto],
    queryFn: () => inventoryApi.getMovimientos(item.Id_Objeto),
    enabled: movimientosOpen,
  });

  const movimientos = movimientosQuery.data ?? [];
  const movimientosLoading =
    movimientosQuery.isPending || movimientosQuery.isFetching;
  const movimientosError = movimientosQuery.isError
    ? movimientosQuery.error
    : null;
  const movimientosErrorMessage = movimientosError
    ? movimientosError.message
    : "No se pudieron cargar los movimientos.";

  const ubicacionesQuery = useQuery({
    queryKey: ["inventario", "ubicaciones", item.Id_Objeto],
    queryFn: () => inventoryApi.getUbicaciones(item.Id_Objeto),
    enabled: ubicacionesOpen,
  });

  const ubicaciones = ubicacionesQuery.data as
    | InventarioUbicacionesResponse
    | undefined;
  const ubicacionesLoading =
    ubicacionesQuery.isPending || ubicacionesQuery.isFetching;
  const ubicacionesError = ubicacionesQuery.isError
    ? ubicacionesQuery.error
    : null;
  const ubicacionesErrorMessage = ubicacionesError
    ? ubicacionesError.message
    : "No se pudieron cargar las ubicaciones.";

  const detailSections: Array<{ title: string; items: Array<[string, string]> }> = [
    {
      title: "Identificacion",
      items: [
        ["ID", formatValue(item.Id_Objeto)],
        ["Objeto", formatValue(item.nombre_objeto)],
        ["Fabricante", fabricanteLabel],
        ["ID fabricante", formatValue(item.ID_Fabricante)],
        ["Estado", estadoBadge.label],
        ["Ubicacion", formatValue(item.lugar_almacenaje)],
      ],
    },
    {
      title: "Stock",
      items: [
        ["Cantidad", formatValue(item.cantidad)],
        ["Merma/Perdida", formatValue(item.merma_perdida)],
      ],
    },
    {
      title: "Compra",
      items: [
        ["Orden compra", formatValue(item.orden_compra)],
        ["Fecha compra", formatDate(item.fecha_compra)],
        ["Factura", formatValue(item.factura)],
        ["Garantia", formatValue(item.garantia)],
      ],
    },
    {
      title: "Fabricacion",
      items: [
        ["Numero de serie", formatValue(item.numero_serial)],
        ["Ano fabricacion", formatValue(item.ano_fabricacion)],
        ["Peso", formatValue(item.peso)],
      ],
    },
    {
      title: "Costos y envio",
      items: [
        ["Precio compra", formatPrice(item.precio_compra)],
        ["Precio envio", formatPrice(item.precio_envio)],
        ["Precio comercial", formatPrice(item.precio_comercial)],
        ["Responsable envio", formatValue(item.responsable_envio)],
      ],
    },
    {
      title: "Mantenimiento",
      items: [
        ["Mant. requerido", mantenimientoBadge.label],
        ["Ult. mantenimiento", formatDate(item.mant_ultimo)],
        ["Caducidad mantenimiento", formatDate(item.mant_fecha_caducidad)],
        ["Resp. mantenimiento", formatValue(item.mant_responsable)],
        ["Contacto mantenimiento", formatValue(item.mant_contacto)],
      ],
    },
  ];

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{item.Id_Objeto}</TableCell>
      <TableCell className="text-gray-700">{item.nombre_objeto}</TableCell>
      <TableCell className="text-gray-700">{fabricanteLabel}</TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${estadoBadge.className}`}
        >
          {estadoBadge.label}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-700">{item.cantidad}</TableCell>
      <TableCell className="text-gray-700">{item.merma_perdida}</TableCell>
      <TableCell className="text-gray-700">
        {formatValue(item.lugar_almacenaje)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatValue(item.orden_compra)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatDate(item.fecha_compra)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatPrice(item.precio_compra)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatPrice(item.precio_envio)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatPrice(item.precio_comercial)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatValue(item.garantia)}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${mantenimientoBadge.className}`}
        >
          {mantenimientoBadge.label}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-700">
        {formatDate(item.mant_ultimo)}
      </TableCell>
      <TableCell className="text-gray-700">
        {formatDate(item.mant_fecha_caducidad)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors hover:bg-amber-50"
                onClick={() => onEdit(item.Id_Objeto)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
              align="center"
            >
              Editar
            </TooltipContent>
          </Tooltip>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                    aria-label="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
                align="center"
              >
                Ver detalles
              </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Detalle de inventario</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {detailSections.map((section) => (
                  <section
                    key={section.title}
                    className="rounded-lg border border-gray-200 p-4 space-y-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {section.title}
                    </p>
                    <div className="space-y-2">
                      {renderDetailPairs(section.items)}
                    </div>
                  </section>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={movimientosOpen} onOpenChange={setMovimientosOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:border hover:border-slate-400 hover:text-slate-700 transition-colors hover:bg-slate-50"
                    aria-label="Ver movimientos"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-slate-400 text-slate-600 font-normal text-center"
                align="center"
              >
                Ver movimientos
              </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto sm:max-w-5xl">
              <DialogHeader>
                <DialogTitle>
                  Movimientos del objeto #{item.Id_Objeto}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table containerClassname="max-h-[60vh] overflow-auto">
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Fecha
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Tipo
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Cantidad
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Origen
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Destino
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Referencia
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Razon
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientosLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Cargando movimientos...
                        </TableCell>
                      </TableRow>
                    ) : movimientosQuery.isError ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-destructive">
                          {movimientosErrorMessage}
                        </TableCell>
                      </TableRow>
                    ) : movimientos.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-8"
                        >
                          Sin movimientos registrados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      movimientos.map((mov: InventarioMovimiento) => (
                        <TableRow
                          key={mov.id}
                          className="border-b border-gray-100"
                        >
                          <TableCell>{formatMovementDate(mov.fecha)}</TableCell>
                          <TableCell>{formatMovementType(mov.tipo_movimiento)}</TableCell>
                          <TableCell>{formatValue(mov.cantidad)}</TableCell>
                          <TableCell>
                            {formatMovementLocation(
                              mov.origen_tipo,
                              mov.origen_id,
                            )}
                          </TableCell>
                          <TableCell>
                            {formatMovementLocation(
                              mov.destino_tipo,
                              mov.destino_id,
                            )}
                          </TableCell>
                          <TableCell>
                            {formatMovementReference(
                              mov.referencia_tabla,
                              mov.referencia_id,
                            )}
                          </TableCell>
                          <TableCell className="whitespace-normal max-w-[220px]">
                            {formatValue(mov.razon)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={ubicacionesOpen} onOpenChange={setUbicacionesOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-500 hover:border hover:border-emerald-400 hover:text-emerald-600 transition-colors hover:bg-emerald-50"
                    aria-label="Ver mas"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-emerald-400 text-emerald-600 font-normal text-center"
                align="center"
              >
                Ver mas
              </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto sm:max-w-6xl">
              <DialogHeader>
                <DialogTitle>
                  Ubicaciones del objeto #{item.Id_Objeto}
                </DialogTitle>
              </DialogHeader>

              {ubicacionesLoading ? (
                <p className="text-sm text-muted-foreground">
                  Cargando ubicaciones...
                </p>
              ) : ubicacionesQuery.isError ? (
                <p className="text-sm text-destructive">
                  {ubicacionesErrorMessage}
                </p>
              ) : ubicaciones ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Objeto
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {ubicaciones.objeto.nombre_objeto}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID {ubicaciones.objeto.Id_Objeto}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        En taller
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {formatValue(ubicaciones.taller?.cantidad)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Merma/Perdida
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {formatValue(ubicaciones.objeto.merma_perdida)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Camiones
                    </p>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table containerClassname="max-h-[35vh] overflow-auto">
                        <TableHeader className="bg-muted/50">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">
                              Placa
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Cantidad
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Ubicacion
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ubicaciones.camiones.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground py-6"
                              >
                                Sin camiones asignados.
                              </TableCell>
                            </TableRow>
                          ) : (
                            ubicaciones.camiones.map((camion) => (
                              <TableRow key={camion.placa}>
                                <TableCell>{camion.placa}</TableCell>
                                <TableCell>{formatValue(camion.cantidad)}</TableCell>
                                <TableCell>{formatValue(camion.ubicacion)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Proyectos
                    </p>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table containerClassname="max-h-[35vh] overflow-auto">
                        <TableHeader className="bg-muted/50">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">
                              Proyecto
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              ID lote
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Cantidad
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Estado
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Ubicacion
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Placa camion
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Devolucion
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ubicaciones.proyectos.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center text-muted-foreground py-6"
                              >
                                Sin proyectos activos.
                              </TableCell>
                            </TableRow>
                          ) : (
                            ubicaciones.proyectos.map((proyecto) => (
                              <TableRow
                                key={`${proyecto.id_proyecto}-${proyecto.id_proyecto_inventario}`}
                              >
                                <TableCell className="max-w-[280px] whitespace-normal">
                                  {proyecto.proyecto_nombre}
                                </TableCell>
                                <TableCell>
                                  {formatValue(proyecto.id_proyecto_inventario)}
                                </TableCell>
                                <TableCell>
                                  {formatValue(proyecto.cantidad)}
                                </TableCell>
                                <TableCell>
                                  {formatValue(proyecto.estado_linea)}
                                </TableCell>
                                <TableCell>
                                  {formatValue(proyecto.ubicacion)}
                                </TableCell>
                                <TableCell>
                                  {formatValue(proyecto.placa_camion)}
                                </TableCell>
                                <TableCell>
                                  {formatNullableDate(
                                    proyecto.fecha_devolucion_efectiva,
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay datos de ubicaciones disponibles.
                </p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
};
