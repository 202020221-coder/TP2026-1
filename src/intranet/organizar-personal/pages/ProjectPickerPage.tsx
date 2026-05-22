import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/utils';
import { proyectoService } from '../services/organizar-personal.service';
import type { Proyecto } from '../types';

export default function ProjectPickerPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proyectoService
      .getAll(1, 100)
      .then((res) => setProyectos(res.data))
      .catch(() => setProyectos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto bg-gray-50 px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-1">Organizar Personal</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona un proyecto para gestionar el personal asignado por día.
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
          {proyectos.map((p) => (
            <Link
              key={p.id_Proyecto}
              to={`/intranet/organizar-personal/${p.id_Proyecto}`}
              className={cn(
                'block rounded-xl border bg-white p-4 shadow-sm transition-all',
                'hover:shadow-md hover:border-orange-400',
              )}
            >
              <p className="font-medium text-sm text-gray-900 truncate">
                {p.descripcion_servicio ?? '(sin descripción)'}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {p.Cliente_Nombre ?? 'Sin cliente'}
              </p>
              <p className="text-xs text-gray-500 truncate">{p.ubicacion}</p>
              <p className="text-xs text-gray-400 mt-1">
                {p.fecha_inicio?.slice(0, 10)} → {p.fecha_fin?.slice(0, 10)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
