import type { Order } from "../../interfaces/order";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

type ClientOrderDetailsDialogProps = {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

export function ClientOrderDetailsDialog({
    order,
    open,
    onOpenChange,
}: ClientOrderDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Detalle de Mi Solicitud
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                        <p className="text-muted-foreground">Código</p>
                        <p className="font-medium text-foreground">{order.ID}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">ID Cliente</p>
                        <p className="font-medium text-foreground">{order.Id_Cliente ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Ubicación</p>
                        <p className="font-medium text-foreground">{order.ubicacion}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Fecha de Inicio</p>
                        <p className="font-medium text-foreground">{formatDate(order.fecha_inicio)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Estado</p>
                        <p className="font-medium text-foreground">{order.estado}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-2">Descripción</p>
                        <Textarea
                            value={order.descripcion}
                            readOnly
                            className="min-h-[140px] resize-none rounded-xl"
                        />
                    </div>
                </div>

                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Regresar
                </Button>
            </DialogContent>
        </Dialog>
    );
}