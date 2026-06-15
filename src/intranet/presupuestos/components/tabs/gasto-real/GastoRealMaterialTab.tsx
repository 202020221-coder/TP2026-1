import { useEffect, useRef, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Loader2, Save, Upload } from "lucide-react";
import {
  usePresupuestoReal,
  useUpdateGastoReal,
  useIncidenciasPorCotizacion,
} from "../../../hooks/usePresupuestos";
import type { IncidenciaPresupuesto, PresupuestoRealItem } from "../../../interfaces/presupuesto";
import { GastoRealEvidenciaButton, getIncidenciaValue, buildIncidenciaOptions } from "./gasto-real-shared";

const TIPO = "Material Directo" as const;

interface RowProps {
  item: PresupuestoRealItem;
  cotizacionId: number;
  incidencias: IncidenciaPresupuesto[];
}

function GastoRealMaterialRow({ item, cotizacionId, incidencias }: RowProps) {
  const [gastoReal, setGastoReal] = useState(item.costo_real ?? "");
  const [razon, setRazon] = useState(item.razon ?? "");
  const [incidencia, setIncidencia] = useState(getIncidenciaValue(item));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: save, isPending: isSaving } = useUpdateGastoReal(cotizacionId, TIPO);

  useEffect(() => {
    setGastoReal(item.costo_real ?? "");
    setRazon(item.razon ?? "");
    setIncidencia(getIncidenciaValue(item));
  }, [item]);

  const handleSave = () => {
    save({
      itemId: item.ID,
      payload: { gasto_real: gastoReal, razon_gasto_real: razon, involucra_incidencia: incidencia },
      file: selectedFile ?? undefined,
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{item.ID}</TableCell>
      <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
      <TableCell className="text-right">{item.cantidad ?? "—"}</TableCell>
      <TableCell className="text-right">{item.costo_unitario ? parseFloat(item.costo_unitario).toFixed(2) : "—"}</TableCell>
      <TableCell className="text-sm">{item.realizacion_gastos ?? "—"}</TableCell>
      <TableCell className="text-right font-semibold">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={gastoReal}
          onChange={(e) => setGastoReal(e.target.value)}
          placeholder="0.00"
          className="w-28 h-8"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
          >
            <Upload className="h-3 w-3" />
            {selectedFile ? selectedFile.name.slice(0, 10) + "…" : item.prueba ? "Cambiar" : "Subir"}
          </Button>
          <GastoRealEvidenciaButton url={item.prueba} />
        </div>
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

export function GastoRealMaterialTab({ cotizacionId }: { cotizacionId: number }) {
  const { data: items, isLoading } = usePresupuestoReal(cotizacionId, TIPO);
  const { data: incidencias = [] } = useIncidenciasPorCotizacion(cotizacionId);

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold w-14">ID</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold text-right">Cant.</TableHead>
            <TableHead className="font-semibold text-right">Costo Unit.</TableHead>
            <TableHead className="font-semibold">Realización</TableHead>
            <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
            <TableHead className="font-semibold">Gasto Real</TableHead>
            <TableHead className="font-semibold">Evidencia</TableHead>
            <TableHead className="font-semibold">Razón</TableHead>
            <TableHead className="font-semibold">¿Involucra Incidencia?</TableHead>
            <TableHead className="font-semibold text-center">Guardar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /><span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                Sin materiales directos registrados
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <GastoRealMaterialRow key={item.ID} item={item} cotizacionId={cotizacionId} incidencias={incidencias} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
