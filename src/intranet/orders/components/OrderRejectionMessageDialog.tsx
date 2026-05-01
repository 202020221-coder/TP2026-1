import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

// ---- Props ----
type OrderMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionMessage?: string;
};

export default function OrderRejectionMessageDialog({
  open,
  onOpenChange,
  rejectionMessage,
}: OrderMessageDialogProps) {
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
          <Textarea
            value={rejectionMessage ?? ""}
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
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Regresar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
