import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center gap-1"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="text-xs text-gray-600">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}
