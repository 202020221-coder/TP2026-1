import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { MessageCircle } from "lucide-react";

interface QuotationCommentsModalProps {
  quotationId: number;
  open: boolean;
  onClose: () => void;
}

// Mock comments — replace with real API call when backend is ready
const MOCK_COMMENTS = [
  {
    id: 1,
    autor: "Carlos Ramos",
    fecha: "2025-05-11",
    texto: "Por favor revisar los precios unitarios de los rociadores.",
  },
  {
    id: 2,
    autor: "Ana Torres",
    fecha: "2025-05-12",
    texto: "Los precios han sido actualizados según el catálogo vigente.",
  },
  {
    id: 3,
    autor: "Carlos Ramos",
    fecha: "2025-05-13",
    texto: "Aprobado. Proceder con la cotización.",
  },
];

export const QuotationCommentsModal: FC<QuotationCommentsModalProps> = ({
  quotationId,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Comentarios — Cotización #{quotationId}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2 max-h-80 overflow-y-auto pr-1">
          {MOCK_COMMENTS.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col gap-1 border border-border rounded-lg px-4 py-3 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {comment.autor}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.fecha).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {comment.texto}
              </p>
            </div>
          ))}

          {MOCK_COMMENTS.length === 0 && (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              No hay comentarios registrados.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
