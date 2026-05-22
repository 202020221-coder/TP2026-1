import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Edit2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { usePresupuestosList } from "../hooks/usePresupuestos";
import { PresupuestoEditModal } from "../components/PresupuestoEditModal";
import type { Presupuesto } from "../interfaces/presupuesto";

export function PresupuestosPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Presupuesto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading } = usePresupuestosList(page, 10);

  const presupuestos = data?.data ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 };

  const filtered = presupuestos.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      p.Cotizacion_Nombre?.toLowerCase().includes(term) ||
      p.ID.toString().includes(term)
    );
  });

  const handleEdit = (p: Presupuesto) => {
    setSelected(p);
    setIsEditOpen(true);
  };

  return (
    <div className="flex h-full flex-col bg-background px-6 py-4 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestionar Presupuesto</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona los presupuestos internos de los proyectos
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          placeholder="Buscar por nombre de cotización..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 max-w-md"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-16">ID</TableHead>
              <TableHead className="font-semibold">Nombre Cotización</TableHead>
              <TableHead className="font-semibold text-right">Costos Indirectos</TableHead>
              <TableHead className="font-semibold text-right">Costo Total Est.</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Cargando presupuestos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No hay presupuestos disponibles
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.ID} className="hover:bg-muted/50">
                  <TableCell className="text-muted-foreground">{p.ID}</TableCell>
                  <TableCell className="font-medium">{p.Cotizacion_Nombre}</TableCell>
                  <TableCell className="text-right">
                    S/. {parseFloat(p.costos_indirectos).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    S/. {parseFloat(p.coste_total_estimado).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(p)}
                      className="gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filtered.length} de {pagination.total} presupuesto
          {pagination.total !== 1 ? "s" : ""}
        </p>
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-8 gap-1 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(n)}
                className="h-8 w-8 p-0"
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="h-8 gap-1 px-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <PresupuestoEditModal
        presupuesto={selected}
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
      />
    </div>
  );
}
