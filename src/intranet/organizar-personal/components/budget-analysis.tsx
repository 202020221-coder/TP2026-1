import type { Jornada } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface Props {
  jornadas: Jornada[];
  personalRequerido: number;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export function BudgetAnalysis({
  jornadas,
  personalRequerido,
  fechaInicio,
  fechaFin,
}: Props) {
  // Generate list of all days between fechaInicio and fechaFin
  const getDaysBetween = (): Date[] => {
    if (!fechaInicio || !fechaFin) return [];

    const days: Date[] = [];
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    // Ensure we're using midnight UTC to avoid timezone issues
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  };

  const days = getDaysBetween();

  // Calculate daily coverage
  const dailyAnalysis = days.map((day) => {
    const dayStr = day.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Count unique workers assigned on this day
    const workersOnDay = new Set<string>();
    jornadas.forEach((jornada) => {
      if (jornada.dia.slice(0, 10) === dayStr) {
        workersOnDay.add(jornada.DNI_Trabajador);
      }
    });

    const asignados = workersOnDay.size;
    const isComplete = asignados >= personalRequerido;
    const falta = Math.max(0, personalRequerido - asignados);

    return {
      fecha: dayStr,
      asignados,
      requerido: personalRequerido,
      completo: isComplete,
      falta,
    };
  });

  // Calculate summary
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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-muted-foreground">Total de días</p>
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
          <p className="text-sm text-muted-foreground">Operarios por contratar</p>
          <p className="text-2xl font-bold text-red-600">{brechaTotal}</p>
        </div>
      </div>

      {/* Daily Breakdown Table */}
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
                <TableHead className="text-right">Requerido</TableHead>
                <TableHead className="text-right">Falta</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyAnalysis.map((day) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
