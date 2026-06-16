import type { Trabajo } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface Props {
  trabajos: Trabajo[];
  fechaInicio: string | null;
  fechaFin: string | null;
}

export function BudgetAnalysis({ trabajos, fechaInicio, fechaFin }: Props) {
  const getDaysBetween = (): string[] => {
    if (!fechaInicio || !fechaFin) return [];
    const days: string[] = [];
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  // Cobertura por día calculada sobre los slots TRABAJO.
  const coverageByDay = new Map<string, { total: number; asignados: number }>();
  for (const t of trabajos) {
    const key = t.dia.slice(0, 10);
    if (!key) continue;
    const c = coverageByDay.get(key) ?? { total: 0, asignados: 0 };
    c.total += 1;
    if (t.DNI_Trabajador) c.asignados += 1;
    coverageByDay.set(key, c);
  }

  // Solo días con slots; si hay rango de proyecto, recorrer ese rango.
  const days = getDaysBetween();
  const fechas = days.length > 0
    ? days
    : Array.from(coverageByDay.keys()).sort();

  const dailyAnalysis = fechas
    .map((fecha) => {
      const c = coverageByDay.get(fecha) ?? { total: 0, asignados: 0 };
      const falta = Math.max(0, c.total - c.asignados);
      return {
        fecha,
        asignados: c.asignados,
        requerido: c.total,
        completo: c.total > 0 && c.asignados >= c.total,
        falta,
      };
    })
    .filter((d) => d.requerido > 0);

  const diasCompletos = dailyAnalysis.filter((d) => d.completo).length;
  const diasIncompletos = dailyAnalysis.filter((d) => !d.completo).length;
  const brechaTotal = dailyAnalysis.reduce((sum, d) => sum + d.falta, 0);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-muted-foreground">Días con trabajo</p>
          <p className="text-2xl font-bold">{dailyAnalysis.length}</p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-muted-foreground">Días completos</p>
          <p className="text-2xl font-bold text-green-600">{diasCompletos}</p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-muted-foreground">Días incompletos</p>
          <p className="text-2xl font-bold text-orange-600">{diasIncompletos}</p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-muted-foreground">Puestos sin cubrir</p>
          <p className="text-2xl font-bold text-red-600">{brechaTotal}</p>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="font-semibold">Desglose diario</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Asignados</TableHead>
                <TableHead className="text-right">Puestos</TableHead>
                <TableHead className="text-right">Falta</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyAnalysis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No hay trabajos registrados para este proyecto.
                  </TableCell>
                </TableRow>
              ) : (
                dailyAnalysis.map((day) => (
                  <TableRow key={day.fecha}>
                    <TableCell className="font-medium">
                      {formatDate(day.fecha)}
                    </TableCell>
                    <TableCell className="text-right">{day.asignados}</TableCell>
                    <TableCell className="text-right">{day.requerido}</TableCell>
                    <TableCell className="text-right">
                      {day.falta > 0 ? (
                        <span className="text-red-600 font-medium">{day.falta}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {day.completo ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Incompleto
                        </span>
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
  );
}
