import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";

export const RequestTableHeader: React.FC = () => {
    return (
        <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="min-w-[180px]">Cliente</TableHead>
                <TableHead className="min-w-[220px]">Descripción</TableHead>
                <TableHead className="min-w-[220px]">Ubicación</TableHead>
                <TableHead className="min-w-[140px]">Estado</TableHead>
                <TableHead className="min-w-40">Creación</TableHead>
                <TableHead className="min-w-40">Productos</TableHead>
                <TableHead className="min-w-40">Camiones</TableHead>
            </TableRow>
        </TableHeader>
    );
};
