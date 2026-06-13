import { useEffect, useState } from "react";
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
  usePresupuestoReal,
  useUpdateGastoReal,
  useIncidenciasPorCotizacion,
} from "../../../hooks/usePresupuestos";
import type { IncidenciaPresupuesto, PresupuestoRealItem } from "../../../interfaces/presupuesto";
import { getIncidenciaValue, buildIncidenciaOptions } from "./gasto-real-shared";

const TIPO = "Mano de Obra" as const;

interface RowProps {
  item: PresupuestoRealItem;
  cotizacionId: number;
  incidencias: IncidenciaPresupuesto[];
}

function GastoRealManoObraRow({ item, cotizacionId, incidencias }: RowProps) {
  const [aumentos, setAumentos] = useState(item.aumentos ?? "");
  const [razon, setRazon] = useState(item.razon ?? "");
  const [incidencia, setIncidencia] = useState(getIncidenciaValue(item));

  const { mutate: save, isPending: isSaving } = useUpdateGastoReal(cotizacionId, TIPO);

  useEffect(() => {
    setAumentos(item.aumentos ?? "");
    setRazon(item.razon ?? "");
    setIncidencia(getIncidenciaValue(item));
  }, [item]);

  const handleSave = () => {
    save({ itemId: item.ID, payload: { aumentos, razon_gasto_real: razon, involucra_incidencia: incidencia } });
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{item.ID}</TableCell>
      <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
      <TableCell className="text-right">{item.hora_total ?? "—"}</TableCell>
      <TableCell className="text-right">{item.costo_x_hora ? parseFloat(item.costo_x_hora).toFixed(2) : "—"}</TableCell>
      <TableCell className="text-right">{item.dias_trabajados ?? "—"}</TableCell>
      <TableCell className="text-right font-semibold">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={aumentos}
          onChange={(e) => setAumentos(e.target.value)}
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
            {buildIncidenciaOptions(incidencias, incidencia).map((inc) => (
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

export function GastoRealManoObraTab({ cotizacionId }: { cotizacionId: number }) {
  const { data: items, isLoading } = usePresupuestoReal(cotizacionId, TIPO);
  const { data: incidencias = [] } = useIncidenciasPorCotizacion(cotizacionId);

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold w-14">ID</TableHead>
            <TableHead className="font-semibold">Profesión</TableHead>
            <TableHead className="font-semibold text-right">Horas</TableHead>
            <TableHead className="font-semibold text-right">S/. x Hora</TableHead>
            <TableHead className="font-semibold text-right">Días</TableHead>
            <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
            <TableHead className="font-semibold">Aumentos</TableHead>
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
                Sin mano de obra registrada
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <GastoRealManoObraRow key={item.ID} item={item} cotizacionId={cotizacionId} incidencias={incidencias} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
