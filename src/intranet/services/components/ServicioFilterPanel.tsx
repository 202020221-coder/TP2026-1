import { useRef, useEffect, type FC } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  TIPOS_SERVICIO,
  CONDICIONES_PRECIO,
  type TipoServicio,
  type ServicioFilters,
} from "../interfaces/service-filters";

interface Props {
  filters: ServicioFilters;
  activeCount: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdateFilter: <K extends keyof ServicioFilters>(
    key: K,
    value: ServicioFilters[K]
  ) => void;
  onReset: () => void;
  disabled?: boolean;
}

export const ServicioFilterPanel: FC<Props> = ({
  filters,
  activeCount,
  open,
  onOpenChange,
  onUpdateFilter,
  onReset,
  disabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cierra el panel al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  const toggleTipo = (tipo: TipoServicio) => {
    const next = filters.tiposServicio.includes(tipo)
      ? filters.tiposServicio.filter((t) => t !== tipo)
      : [...filters.tiposServicio, tipo];
    onUpdateFilter("tiposServicio", next);
  };

  const toggleCondicion = (c: string) => {
    const next = filters.condicionesPrecio.includes(c)
      ? filters.condicionesPrecio.filter((x) => x !== c)
      : [...filters.condicionesPrecio, c];
    onUpdateFilter("condicionesPrecio", next);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Botón trigger ─────────────────────────────────────────────────── */}
      <Button
        variant="outline"
        className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 relative"
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white rounded-full leading-none">
            {activeCount}
          </span>
        )}
      </Button>

      {/* ── Panel desplegable ─────────────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">
              Filtrar servicios
            </span>
            <div className="flex items-center gap-1">
              {activeCount > 0 && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 h-7 px-2 text-xs text-gray-500 hover:text-red-500 rounded transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar
                </button>
              )}
              <button
                onClick={() => onOpenChange(false)}
                className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rango de precio */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Rango de precio (S/)
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  S/
                </span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Mín"
                  className="pl-7 h-8 text-sm"
                  value={filters.precioMin}
                  onChange={(e) =>
                    onUpdateFilter(
                      "precioMin",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
              <span className="text-gray-400 text-xs">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  S/
                </span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Máx"
                  className="pl-7 h-8 text-sm"
                  value={filters.precioMax}
                  onChange={(e) =>
                    onUpdateFilter(
                      "precioMax",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Tipo de servicio */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Tipo de servicio
            </Label>
            <div className="flex flex-wrap gap-2">
              {TIPOS_SERVICIO.map((tipo) => {
                const active = filters.tiposServicio.includes(tipo);
                return (
                  <button
                    key={tipo}
                    onClick={() => toggleTipo(tipo)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      active
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500 bg-white"
                    }`}
                  >
                    {tipo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condición de precio */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Condición de precio
            </Label>
            <div className="flex flex-wrap gap-2">
              {CONDICIONES_PRECIO.map((c) => {
                const active = filters.condicionesPrecio.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCondicion(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      active
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500 bg-white"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
