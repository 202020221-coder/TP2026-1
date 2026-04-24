import type { Order } from "../../interfaces/order";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

type ClientOrderObservationDialogProps = {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ClientOrderObservationDialog({
    order,
    open,
    onOpenChange,
}: ClientOrderObservationDialogProps) {
    const observation = order.observacion?.trim() || order.descripcion;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Observación
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Textarea
                        value={observation}
                        readOnly
                        className="min-h-[140px] resize-none rounded-xl"
                    />

                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Regresar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}