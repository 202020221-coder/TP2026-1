import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Loader2, Save } from "lucide-react";
import {
  usePresupuestoItems,
  useUpdateGastoReal,
  useIncidencias,
} from "../../../hooks/usePresupuestos";
import type { IncidenciaPresupuesto, PresupuestoItem } from "../../../interfaces/presupuesto";

const TIPO = "Gastos Administrativos" as const;

interface RowProps {
  item: PresupuestoItem;
  cotizacionId: number;
  incidencias: IncidenciaPresupuesto[];
}

function GastoRealGastoAdminRow({ item, cotizacionId, incidencias }: RowProps) {
  const [precioReal, setPrecioReal] = useState(item.precio_real ?? "");
  const [razon, setRazon] = useState(item.razon_gasto_real ?? "");
  const [incidencia, setIncidencia] = useState(item.involucra_incidencia ?? "NO");

  const { mutate: save, isPending: isSaving } = useUpdateGastoReal(cotizacionId, TIPO);

  const handleSave = () => {
    save({ itemId: item.ID, payload: { precio_real: precioReal, razon_gasto_real: razon, involucra_incidencia: incidencia } });
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{item.ID}</TableCell>
      <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
      <TableCell className="text-right">{item.costo_unitario ? parseFloat(item.costo_unitario).toFixed(2) : "—"}</TableCell>
      <TableCell className="text-right">{item.cantidad ?? "—"}</TableCell>
      <TableCell className="text-right font-semibold">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
      <TableCell className="text-sm">{item.realizacion_gastos ?? "—"}</TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={precioReal}
          onChange={(e) => setPrecioReal(e.target.value)}
          placeholder="0.00"
          className="w-28 h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={razon}
          onChange={(e) => setRazon(e.target.value)}
          placeholder="Razón..."
          className="w-36 h-8"
        />
      </TableCell>
      <TableCell>
        <Select value={incidencia} onValueChange={setIncidencia}>
          <SelectTrigger className="w-36 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO">NO</SelectItem>
            {incidencias.map((inc) => (
              <SelectItem key={inc.id_incidencia} value={String(inc.id_incidencia)}>
                #{inc.id_incidencia} — {inc.comentario}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-center">
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 w-8 p-0">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function GastoRealGastoAdminTab({ cotizacionId }: { cotizacionId: number }) {
  const { data: items, isLoading } = usePresupuestoItems(cotizacionId, TIPO);
  const { data: incidencias = [] } = useIncidencias();

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold w-14">ID</TableHead>
            <TableHead className="font-semibold">Razón del Gasto</TableHead>
            <TableHead className="font-semibold text-right">Costo Unit.</TableHead>
            <TableHead className="font-semibold text-right">Cant.</TableHead>
            <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
            <TableHead className="font-semibold">Realización</TableHead>
            <TableHead className="font-semibold">Precio Real</TableHead>
            <TableHead className="font-semibold">Razón</TableHead>
            <TableHead className="font-semibold">¿Involucra Incidencia?</TableHead>
            <TableHead className="font-semibold text-center">Guardar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /><span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                Sin gastos administrativos registrados
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <GastoRealGastoAdminRow key={item.ID} item={item} cotizacionId={cotizacionId} incidencias={incidencias} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
