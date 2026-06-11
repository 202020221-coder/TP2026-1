import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { IncidentInvolved } from "../../interfaces/incident";

interface IncidentPersonnelCardProps {
  item: IncidentInvolved;
  onEdit: () => void;
  onDelete: () => void;
}

export function IncidentPersonnelCard({
  item,
  onEdit,
  onDelete,
}: IncidentPersonnelCardProps) {
  const cargo = item.cargo ?? item.perfil_registrado ?? "—";

  return (
    <article className="rounded-[24px] border-2 border-border bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">Nombre:</span> {item.nombre}
          </p>
          <p className="text-foreground">
            <span className="font-semibold">DNI:</span> {item.dni?.trim() || "—"}
          </p>
          <p className="text-foreground">
            <span className="font-semibold">Cargo:</span> {cargo.trim() || "—"}
          </p>
          <p className="text-foreground">
            <span className="font-semibold">Descargo de la persona:</span>{" "}
            {item.descargo_persona?.trim() || "—"}
          </p>
          <p className="text-foreground">
            <span className="font-semibold">Comentario de la empresa:</span>{" "}
            {item.comentario_empresa?.trim() || "—"}
          </p>
        </div>

        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onEdit}
          >
            <Pencil size={13} />
            Editar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 size={13} />
            Eliminar
          </Button>
        </div>
      </div>
    </article>
  );
}
