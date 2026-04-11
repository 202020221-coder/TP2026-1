import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
// ---- Fake API function (3 seconds delay) ----
const fetchOrderMessage = async (
  orderId: number,
  signal?: AbortSignal
): Promise<string> => {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 3000);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  return `Mensaje cargado para la orden #${orderId}`;
};

// ---- Props ----
type OrderMessageDialogProps = {
  orderId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function OrderRejectionMessageDialog({
  orderId,
  open,
  onOpenChange,
}: OrderMessageDialogProps) {
  // ---- React Query ----
  const { data, isLoading } = useQuery({
    queryKey: ["order-message", orderId],
    queryFn: ({signal}) => fetchOrderMessage(orderId, signal),
    enabled: open, // Only fetch when dialog opens
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          bg-background
          text-foreground
          border-border
          max-w-lg
          rounded-2xl
          shadow-lg
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Detalle de Mensaje
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* ---- Text Area Section ---- */}
          {isLoading ? (
            <Skeleton className="h-32 w-full rounded-xl bg-muted" />
          ) : (
            <Textarea
              value={data ?? ""}
              readOnly
              className="
                bg-background
                border-border
                text-foreground
                placeholder:text-muted-foreground
                min-h-[130px]
                resize-none
                rounded-xl
              "
            />
          )}

          {/* ---- Button Section ---- */}
          {isLoading ? (
            <Skeleton className="h-10 w-32 rounded-xl bg-muted" />
          ) : (
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Regresar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
