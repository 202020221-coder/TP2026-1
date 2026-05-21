import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { uploadPurchaseOrder } from "@/intranet/quotation/api/purchase_order.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { FileCheck2, UploadCloud } from "lucide-react";

type QuotationOrderPurchaseDialogProps = {
    quotationId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function QuotationOrderPurchaseDialog({
    quotationId,
    open,
    onOpenChange,
}: QuotationOrderPurchaseDialogProps) {
    const [orderPurchaseFile, setOrderPurchaseFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setOrderPurchaseFile(null);
        }
    };

    const handleFileChange = (file: File | null) => {
        setOrderPurchaseFile(file);
    };

    const handleDropzoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(event.target.files?.[0] ?? null);
    };

    const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        event.currentTarget.value = "";
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFileChange(event.dataTransfer.files?.[0] ?? null);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!orderPurchaseFile) {
            return;
        }

        // Only accept PDF files
        if (!/\.pdf$/i.test(orderPurchaseFile.name) && orderPurchaseFile.type !== "application/pdf") {
            toast.error("Solo se permiten archivos PDF.");
            return;
        }

        setIsUploading(true);
        toast.promise(
            async () => {
                await uploadPurchaseOrder(quotationId, orderPurchaseFile);
            },
            {
                loading: "Subiendo orden de compra...",
                success: "Orden de compra subida correctamente.",
                error: "Error al subir la orden de compra.",
            },
        ).finally(() => {
            setIsUploading(false);
            handleOpenChange(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Enviar orden de compra — Cotización #{quotationId}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleDropzoneClick}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleDropzoneClick();
                            }
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                        className="flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-solid border-foreground/80 bg-background text-center transition-colors hover:bg-background"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleInputChange}
                            onClick={handleInputClick}
                            className="hidden"
                        />

                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                            {orderPurchaseFile ? (
                                <FileCheck2 className="h-12 w-12 text-foreground" />
                            ) : (
                                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium text-muted-foreground">
                                {orderPurchaseFile ? "ARCHIVO CARGADO" : "SUBIR ORDEN DE COMPRA"}
                            </span>
                            {orderPurchaseFile && (
                                <span className="max-w-[260px] truncate text-sm text-foreground">
                                    {orderPurchaseFile.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {orderPurchaseFile ? orderPurchaseFile.name : "Ningun archivo seleccionado."}
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!orderPurchaseFile || isUploading}>
                            {isUploading ? "Enviando..." : "Enviar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
