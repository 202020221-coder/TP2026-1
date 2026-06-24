import { useState, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useRejectPurchaseOrder } from "../../hooks/useRejectPurchaseOrder";

type RejectPurchaseOrderDialogProps = {
  quotationId: number;
  quotationName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejected?: () => void;
};

export const RejectPurchaseOrderDialog: FC<RejectPurchaseOrderDialogProps> = ({
  quotationId,
  quotationName,
  open,
  onOpenChange,
  onRejected,
}) => {
  const [motivo, setMotivo] = useState("");
  const rejectMutation = useRejectPurchaseOrder();

  const handleOpenChange = (nextOpen: boolean) => {
    if (rejectMutation.isPending) {
      return;
    }
    if (!nextOpen) {
      setMotivo("");
    }
    onOpenChange(nextOpen);
  };

  const handleReject = async () => {
    const trimmed = motivo.trim();
    if (!trimmed) {
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        quotationId,
        motivo: trimmed,
      });
      setMotivo("");
      onRejected?.();
      handleOpenChange(false);
    } catch {
      /* toast handled in mutation */
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar orden de compra</DialogTitle>
          <DialogDescription>
            {quotationName
              ? `Cotización: ${quotationName}`
              : `Cotización #${quotationId}`}
            . El cliente verá este mensaje y podrá enviar una nueva orden de
            compra.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="motivo-rechazo-oc">Motivo del rechazo</Label>
          <Textarea
            id="motivo-rechazo-oc"
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            placeholder="Indique por qué la orden de compra no es válida..."
            rows={4}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={rejectMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleReject()}
            disabled={rejectMutation.isPending || !motivo.trim()}
          >
            {rejectMutation.isPending ? "Rechazando..." : "Rechazar orden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
