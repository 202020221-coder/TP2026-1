import { useState, type FC } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { X, FileText, ExternalLink, Loader2 } from "lucide-react";
import {
  usePresupuestoReal,
  useProyectoCotizacionId,
} from "@/intranet/presupuestos/hooks/usePresupuestos";
import type {
  PresupuestoRealItem,
  TipoPresupuesto,
} from "@/intranet/presupuestos/interfaces/presupuesto";
import type { IncidentQuotation } from "../../interfaces/incident-quotation";

// ── Tabs definition ───────────────────────────────────────────────────────────
type TabId = "material" | "mano-obra" | "servicio" | "gasto-admin";

const TABS: { id: TabId; label: string; tipo: TipoPresupuesto }[] = [
  { id: "material",    label: "Material directo",    tipo: "Material Directo" },
  { id: "mano-obra",   label: "Mano de obra",         tipo: "Mano de Obra" },
  { id: "servicio",    label: "Servicio",              tipo: "Servicios" },
  { id: "gasto-admin", label: "Gasto Administrativo", tipo: "Gastos Administrativos" },
];

// ── Mock quotations (same pattern that IncidentQuotationsTable uses) ──────────
const MOCK_INCIDENT_QUOTATIONS: IncidentQuotation[] = [
  {
    id: 1,
    id_incidencia: 0,
    nombre: "Supermercados Wong",
    fecha_envio: null,
    version: 1,
    precio_subtotal: null,
    estado: "Pendiente",
    mensajes: 0,
  },
  {
    id: 2,
    id_incidencia: 0,
    nombre: "Clínica Internacional",
    fecha_envio: null,
    version: 1,
    precio_subtotal: null,
    estado: "Pendiente",
    mensajes: 0,
  },
  {
    id: 3,
    id_incidencia: 0,
    nombre: "Mall Aventura Plaza",
    fecha_envio: null,
    version: 1,
    precio_subtotal: null,
    estado: "Pendiente",
    mensajes: 0,
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface SumaGastosModalProps {
  incidentId: number;
  idProyecto: number | undefined;
  open: boolean;
  onClose: () => void;
}

// ── Main modal ────────────────────────────────────────────────────────────────
export const SumaGastosModal: FC<SumaGastosModalProps> = ({
  incidentId,
  idProyecto,
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("material");

  // Obtener id_cotizacion del proyecto para usar en el endpoint /real
  const { data: cotizacionId, isLoading: loadingProyecto } =
    useProyectoCotizacionId(idProyecto);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Gastos en incidencia"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 flex flex-col bg-card border border-border rounded-xl shadow-2xl"
        style={{ width: "90vw", maxWidth: "1200px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card rounded-t-xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-0.5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Gastos en incidencia
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
              title="Abre la vista comparativa de gasto real del presupuesto"
              disabled={!cotizacionId}
            >
              <ExternalLink size={12} />
              Comparativa de gastos
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1 min-h-0">
          {loadingProyecto ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando datos del proyecto...
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active tab table */}
              {TABS.map((tab) =>
                activeTab === tab.id ? (
                  <SumaGastosTabTable
                    key={tab.id}
                    cotizacionId={cotizacionId ?? null}
                    tipo={tab.tipo}
                    incidentId={incidentId}
                  />
                ) : null,
              )}

              {/* Summary section */}
              <SumaGastosSummary incidentId={incidentId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Per-tab read-only table ───────────────────────────────────────────────────
const SumaGastosTabTable: FC<{
  cotizacionId: number | null;
  tipo: TipoPresupuesto;
  incidentId: number;
}> = ({ cotizacionId, tipo, incidentId }) => {
  const hasCotizacion = !!cotizacionId;

  const { data: items = [], isLoading } = usePresupuestoReal(
    cotizacionId ?? 0,
    tipo,
    incidentId,
  );

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b border-gray-200">
          <TableRow className="hover:bg-transparent bg-muted/20">
            <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide w-12">
              ID
            </TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Nombre
            </TableHead>
            <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
              Cantidad
            </TableHead>
            <TableHead className="text-right text-gray-500 font-medium text-xs uppercase tracking-wide">
              Costo unitario real
            </TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Realización de gasto
            </TableHead>
            <TableHead className="text-right text-gray-500 font-medium text-xs uppercase tracking-wide font-bold">
              Total
            </TableHead>
            <TableHead className="text-right text-gray-500 font-medium text-xs uppercase tracking-wide">
              Gasto real
            </TableHead>
            <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
              Evidencia
            </TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Razón
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!hasCotizacion ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground italic text-sm"
              >
                No se encontró cotización asociada al proyecto de esta incidencia.
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            <GastoRowSkeleton />
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground italic text-sm"
              >
                No se registraron gastos de este tipo para la incidencia.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => <GastoReadOnlyRow key={item.ID} item={item} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// ── Single read-only row ──────────────────────────────────────────────────────
const realizacionStyles: Record<string, string> = {
  anulada:            "bg-gray-100  text-gray-500  border-gray-200",
  "en preparacion":   "bg-blue-50   text-blue-700  border-blue-200",
  "durante servicio": "bg-green-50  text-green-700 border-green-200",
};

const GastoReadOnlyRow: FC<{ item: PresupuestoRealItem }> = ({ item }) => {
  const badgeClass =
    realizacionStyles[item.realizacion_gastos ?? ""] ??
    "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
      {/* ID */}
      <TableCell className="text-muted-foreground text-sm font-mono">
        {item.ID}
      </TableCell>

      {/* Nombre */}
      <TableCell className="font-medium text-gray-800 text-sm">
        {item.nombre_gasto}
      </TableCell>

      {/* Cantidad */}
      <TableCell className="text-center font-mono text-sm text-gray-700">
        {item.cantidad ?? "—"}
      </TableCell>

      {/* Costo unitario */}
      <TableCell className="text-right font-mono text-sm text-gray-700">
        {item.costo_unitario
          ? `S/ ${parseFloat(item.costo_unitario).toFixed(2)}`
          : "—"}
      </TableCell>

      {/* Realización */}
      <TableCell>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeClass}`}
        >
          {item.realizacion_gastos ?? "—"}
        </span>
      </TableCell>

      {/* Total */}
      <TableCell className="text-right font-mono text-sm font-semibold text-gray-800">
        S/ {parseFloat(item.costo_total).toFixed(2)}
      </TableCell>

      {/* Gasto real (campo "costo_real" en el backend) */}
      <TableCell className="text-right font-mono text-sm text-gray-700">
        {item.costo_real
          ? `S/ ${parseFloat(item.costo_real).toFixed(2)}`
          : "—"}
      </TableCell>

      {/* Evidencia (campo "prueba" en el backend) */}
      <TableCell className="text-center">
        {item.prueba ? (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => window.open(item.prueba, "_blank")}
          >
            <FileText size={11} />
            Ver PDF
          </Button>
        ) : (
          <span className="text-gray-400 italic text-xs">—</span>
        )}
      </TableCell>

      {/* Razón (campo "razon" en el backend) */}
      <TableCell
        className="text-sm text-gray-600 max-w-[160px] truncate"
        title={item.razon ?? ""}
      >
        {item.razon || <span className="text-gray-400 italic">—</span>}
      </TableCell>
    </TableRow>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const GastoRowSkeleton: FC = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i} className="border-b border-gray-100">
        <TableCell><Skeleton className="h-4 w-8 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-36 bg-gray-100" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto bg-gray-100" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-5 w-28 rounded-full bg-gray-100" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto bg-gray-100" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto bg-gray-100" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-7 w-16 mx-auto bg-gray-100 rounded" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28 bg-gray-100" /></TableCell>
      </TableRow>
    ))}
  </>
);

// ── Summary section ───────────────────────────────────────────────────────────
const SumaGastosSummary: FC<{ incidentId: number }> = ({ incidentId }) => {
  const quotations: IncidentQuotation[] = MOCK_INCIDENT_QUOTATIONS.map(
    (q) => ({ ...q, id_incidencia: incidentId }),
  );

  const totalCotizaciones = quotations.reduce(
    (s, q) => s + (q.precio_subtotal ?? 0), 0,
  );
  const totalPagado = quotations
    .filter((q) => q.estado === "Pago realizado")
    .reduce((s, q) => s + (q.precio_subtotal ?? 0), 0);
  const totalAprobado = quotations
    .filter((q) => q.estado === "Aprobado")
    .reduce((s, q) => s + (q.precio_subtotal ?? 0), 0);
  const totalEnviado = quotations
    .filter((q) => q.estado === "Enviado")
    .reduce((s, q) => s + (q.precio_subtotal ?? 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-2">
      {/* ── Left: Gastos Totales ── */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Gastos Totales
        </p>
        <div className="flex flex-col gap-2.5">
          <SummaryRow
            label="Gasto extra total en comparativa de gastos"
            value="S/. 0.00"
          />
          <div className="pl-3 border-l border-border flex flex-col gap-2">
            <SummaryRow label="según Mano de obra"           value="S/. 0.00" small />
            <SummaryRow label="según Material directo"       value="S/. 0.00" small />
            <SummaryRow label="según Servicio"               value="S/. 0.00" small />
            <SummaryRow label="según Gastos administrativos" value="S/. 0.00" small />
          </div>
        </div>
      </div>

      {/* ── Right: Diferencias + Cotizaciones ── */}
      <div className="rounded-lg border border-border bg-muted/20 p-4 flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Total
          </p>
          <div className="flex flex-col gap-2.5">
            <SummaryRow label="Diferencia entre gastos y cotizado"                    value="S/. 0.00" />
            <SummaryRow label="Diferencia entre gastos y remuneraciones confirmadas"  value="S/. 0.00" />
            <SummaryRow label="Diferencia entre gastos y remuneraciones pagadas"      value="S/. 0.00" />
          </div>
        </div>

        <div className="border-t border-border" />

        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Cotizaciones
          </p>
          <div className="flex flex-col gap-2.5">
            <SummaryRow label="Costos cubiertos por cotizaciones"       value={fmt(totalCotizaciones)} />
            <SummaryRow label="Costo ya pagado en cotizaciones"         value={fmt(totalPagado)} />
            <SummaryRow label="Cantidad en cotizaciones aprobadas"      value={fmt(totalAprobado)} />
            <SummaryRow label="Cantidad en cotizaciones no aprobadas"   value={fmt(totalEnviado)} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  `S/. ${n.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SummaryRow: FC<{ label: string; value: string; small?: boolean }> = ({
  label,
  value,
  small,
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className={`text-muted-foreground leading-snug ${small ? "text-xs" : "text-sm"}`}>
      {label}
    </span>
    <span className="font-mono text-sm font-medium text-foreground whitespace-nowrap">
      {value}
    </span>
  </div>
);
