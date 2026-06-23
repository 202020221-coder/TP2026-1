import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/utils';
import { proyectoService, trabajoService } from '../services/organizar-personal.service';
import type { Proyecto, Trabajo } from '../types';

type AssignmentStatus = 'none' | 'partial' | 'complete' | 'unknown';

const statusStyles: Record<AssignmentStatus, string> = {
  none: 'border-red-400 bg-red-50/80 hover:border-red-500',
  partial: 'border-orange-400 bg-orange-50/80 hover:border-orange-500',
  complete: 'border-green-400 bg-green-50/80 hover:border-green-500',
  unknown: 'border-gray-200 bg-white hover:border-orange-400',
};

const statusLabels: Record<AssignmentStatus, string> = {
  none: 'Sin personal asignado',
  partial: 'Asignación parcial',
  complete: 'Personal asignado',
  unknown: 'Sin trabajos programados',
};

const computeAssignmentStatus = (trabajos: Trabajo[]): AssignmentStatus => {
  if (trabajos.length === 0) return 'unknown';
  const assigned = trabajos.filter((t) => Boolean(t.DNI_Trabajador)).length;
  if (assigned === 0) return 'none';
  if (assigned < trabajos.length) return 'partial';
  return 'complete';
};

export default function ProjectPickerPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [statusByProject, setStatusByProject] = useState<Record<number, AssignmentStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    proyectoService
      .getAll(1, 100)
      .then(async (res) => {
        if (cancelled) return;
        setProyectos(res.data);

        const statuses = await Promise.all(
          res.data.map(async (project) => {
            try {
              const trabajos = await trabajoService.getByProyecto(project.id_Proyecto);
              return [project.id_Proyecto, computeAssignmentStatus(trabajos)] as const;
            } catch {
              return [project.id_Proyecto, 'unknown'] as const;
            }
          }),
        );

        if (!cancelled) {
          setStatusByProject(Object.fromEntries(statuses));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProyectos([]);
          setStatusByProject({});
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto bg-gray-50 px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-1">Organizar Personal</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona un proyecto para gestionar el personal asignado por día.
        </p>

        <p className="text-xs text-muted-foreground mb-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm border border-red-400 bg-red-100" />
            Sin asignar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm border border-orange-400 bg-orange-100" />
            Parcial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm border border-green-400 bg-green-100" />
            Completo
          </span>
        </p>

        {loading && (
          <p className="text-sm text-muted-foreground">Cargando proyectos…</p>
        )}

        {!loading && proyectos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay proyectos registrados.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {proyectos.map((p) => {
            const status = statusByProject[p.id_Proyecto] ?? 'unknown';
            return (
              <Link
                key={p.id_Proyecto}
                to={`/intranet/organizar-personal/${p.id_Proyecto}`}
                className={cn(
                  'block rounded-xl border p-4 shadow-sm transition-all hover:shadow-md',
                  statusStyles[status],
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {p.descripcion_servicio ?? '(sin descripción)'}
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                    {statusLabels[status]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {p.Cliente_Nombre ?? 'Sin cliente'}
                </p>
                <p className="text-xs text-gray-500 truncate">{p.ubicacion}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {p.fecha_inicio?.slice(0, 10)} → {p.fecha_fin?.slice(0, 10)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
