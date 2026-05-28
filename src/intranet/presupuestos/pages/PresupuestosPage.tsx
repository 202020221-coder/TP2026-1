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
import { Edit2, Eye, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCotizacionesList } from "../hooks/usePresupuestos";
import { PresupuestoEditModal } from "../components/PresupuestoEditModal";
import { GastoRealModal } from "../components/GastoRealModal";
import type { Cotizacion } from "../interfaces/presupuesto";

export function PresupuestosPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Cotizacion | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVerOpen, setIsVerOpen] = useState(false);

  const { data, isLoading } = useCotizacionesList(page, 10);

  const cotizaciones = data?.data ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 };

  const filtered = cotizaciones.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      c.nombre?.toLowerCase().includes(term) ||
      c.nombreCliente?.toLowerCase().includes(term) ||
      c.ID.toString().includes(term)
    );
  });

  const handleEdit = (c: Cotizacion) => {
    setSelected(c);
    setIsEditOpen(true);
  };

  const handleVer = (c: Cotizacion) => {
    setSelected(c);
    setIsVerOpen(true);
  };

  return (
    <div className="flex h-full flex-col bg-background px-6 py-4 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestionar Presupuesto</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona los presupuestos internos de los proyectos
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          placeholder="Buscar por nombre de cotización o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 max-w-md"
        />
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-16">ID</TableHead>
              <TableHead className="font-semibold">Nombre Cotización</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold text-right">Precio Total (S/.)</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Cargando cotizaciones...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No hay cotizaciones disponibles
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.ID} className="hover:bg-muted/50">
                  <TableCell className="text-muted-foreground">{c.ID}</TableCell>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{c.nombreCliente}</TableCell>
                  <TableCell className="text-right">
                    S/. {parseFloat(c.precioTotal).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(c)}
                        className="gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVer(c)}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filtered.length} de {pagination.total} cotizaci
          {pagination.total !== 1 ? "ones" : "ón"}
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
        cotizacion={selected}
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
      />

      <GastoRealModal
        cotizacion={selected}
        isOpen={isVerOpen}
        onClose={() => { setIsVerOpen(false); setSelected(null); }}
      />
    </div>
  );
}
