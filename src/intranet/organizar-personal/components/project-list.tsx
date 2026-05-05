import { cn } from '@/shared/lib/utils';
import type { Proyecto } from '../types';

interface Props {
  proyectos: Proyecto[];
  selectedId: number | null;
  onSelect: (p: Proyecto) => void;
  loading: boolean;
}

export function ProjectList({ proyectos, selectedId, onSelect, loading }: Props) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold px-4 pt-4 pb-2 shrink-0">
        Listado de Proyectos
      </h2>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {loading && (
          <p className="text-sm text-muted-foreground text-center pt-6">
            Cargando proyectos…
          </p>
        )}
        {!loading && proyectos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-6">
            Sin proyectos registrados.
          </p>
        )}
        {proyectos.map((p) => (
          <button
            key={p.id_Proyecto}
            onClick={() => onSelect(p)}
            className={cn(
              'w-full text-left rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-orange-400',
              selectedId === p.id_Proyecto &&
                'border-orange-500 ring-2 ring-orange-200 bg-orange-50'
            )}
          >
            <p className="font-medium text-sm text-gray-900 truncate">
              {p.descripcion_servicio ?? '(sin descripción)'}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {p.Cliente_Nombre}
            </p>
            <p className="text-xs text-gray-500 truncate">{p.ubicacion}</p>
            <p className="text-xs text-gray-400 mt-1">
              {p.fecha_inicio?.slice(0, 10)} → {p.fecha_fin?.slice(0, 10)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
