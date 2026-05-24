import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getProjectDetail } from "../api/project.api";
import {
  MapPin,
  User,
  Calendar,
  FileText,
  ClipboardList,
  Truck,
  Package,
  Receipt,
} from "lucide-react";

interface ProjectDetailModalProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

const toDateDisplay = (dateStr?: string) => {
  if (!dateStr) return "—";
  const [datePart] = dateStr.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
};

const statusStyles: Record<string, string> = {
  "Completado": "bg-green-100 text-green-700 border-green-300",
  "En Ejecución": "bg-blue-100 text-blue-700 border-blue-300",
  "Pendiente": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "En proceso legal": "bg-red-100 text-red-700 border-red-300",
  "Cancelado": "bg-gray-100 text-gray-600 border-gray-300",
};

export const ProjectDetailModal: FC<ProjectDetailModalProps> = ({
  projectId,
  open,
  onClose,
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: open,
  });

  const totalInventario = data?.inventario.reduce(
    (acc, item) => acc + parseFloat(item.subtotal),
    0
  ) ?? 0;

  const totalGeneral = (data?.Subtotal_camiones ?? 0) + totalInventario;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
        {/* Header rojo */}
        <DialogHeader className="bg-red-500 px-6 py-4 rounded-t-lg sticky top-0 z-10">
          <DialogTitle className="text-white text-xl font-bold">
            Detalle del Proyecto
          </DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-gray-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Error al cargar los datos del proyecto.
          </div>
        ) : data ? (
          <div className="p-6 space-y-6">

            {/* Sección 1: Info general */}
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 border-b border-red-100 pb-1">
                Información General
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex gap-2 items-start">
                  <ClipboardList className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Nombre del servicio</p>
                    <p className="text-sm font-medium text-gray-800 break-words">
                      {data.proyecto.Cotizacion_Nombre ?? data.proyecto.descripcion_servicio}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 flex gap-2 items-start">
                  <FileText className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Descripción</p>
                    <p className="text-sm text-gray-700 break-words">{data.proyecto.descripcion_servicio}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <User className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Cliente</p>
                    <p className="text-sm font-medium text-gray-800 break-words">{data.proyecto.Cliente_Nombre ?? "—"}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <div className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Estado</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusStyles[data.proyecto.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {data.proyecto.estado}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Ubicación</p>
                    <p className="text-sm text-gray-700 break-words">{data.proyecto.ubicacion || "—"}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Calendar className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Fecha inicio</p>
                    <p className="text-sm text-gray-700">{toDateDisplay(data.proyecto.fecha_inicio)}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Calendar className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Fecha fin</p>
                    <p className="text-sm text-gray-700">{toDateDisplay(data.proyecto.fecha_fin)}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Receipt className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Factura</p>
                    <p className="text-sm text-gray-700">{data.proyecto.factura ?? "—"}</p>
                  </div>
                </div>

                {data.proyecto.Trabajo_Comentario && (
                  <div className="col-span-2 flex gap-2 items-start">
                    <FileText className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Comentario del trabajo</p>
                      <p className="text-sm text-gray-700 break-words">{data.proyecto.Trabajo_Comentario}</p>
                    </div>
                  </div>
                )}

                {data.proyecto.observaciones && (
                  <div className="col-span-2 flex gap-2 items-start">
                    <ClipboardList className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Observaciones</p>
                      <p className="text-sm text-gray-700 break-words">{data.proyecto.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección 2: Camiones */}
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 border-b border-red-100 pb-1 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Camiones Asignados
              </h3>
              {data.camiones.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin camiones asignados.</p>
              ) : (
                <div className="rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Camión</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Placa</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Entrada</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Salida</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Estado</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.camiones.map((c) => (
                        <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700 text-center">{c.Camion_Nombre}</td>
                          <td className="px-3 py-2 text-gray-700 text-center">{c.Placa}</td>
                          <td className="px-3 py-2 text-gray-700 text-center">{toDateDisplay(c.fecha_hora_entrada)}</td>
                          <td className="px-3 py-2 text-gray-700 text-center">{toDateDisplay(c.fecha_hora_salida)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                              {c.estado}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center text-gray-700">S/{c.precio.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <td colSpan={5} className="px-3 py-2 text-xs font-semibold text-gray-500 text-right">Subtotal camiones:</td>
                        <td className="px-3 py-2 text-right text-sm font-semibold text-gray-800">S/{(data.Subtotal_camiones ?? 0).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Sección 3: Inventario */}
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 border-b border-red-100 pb-1 flex items-center gap-2">
                <Package className="w-4 h-4" /> Inventario
              </h3>
              {data.inventario.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin inventario asignado.</p>
              ) : (
                <div className="rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Producto</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Cantidad</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Estado</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Precio unit.</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.inventario.map((item, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700 text-center">{item.nombre_del_producto}</td>
                          <td className="px-3 py-2 text-center text-gray-700">{item.cantidad}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                              {item.estado}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center text-gray-700">S/{parseFloat(item.precio).toFixed(2)}</td>
                          <td className="px-3 py-2 text-center text-gray-700">S/{parseFloat(item.subtotal).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <td colSpan={4} className="px-3 py-2 text-xs font-semibold text-gray-500 text-right">Subtotal inventario:</td>
                        <td className="px-3 py-2 text-right text-sm font-semibold text-gray-800">S/{totalInventario.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Total general */}
            <div className="flex justify-end">
              <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-3 flex items-center gap-4">
                <span className="text-sm font-semibold text-red-600">Total General:</span>
                <span className="text-lg font-bold text-red-600">S/{totalGeneral.toFixed(2)}</span>
              </div>
            </div>

          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};