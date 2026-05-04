import { FileText } from "lucide-react";
import {
    Table,
    TableBody,
} from "@/shared/components/ui/table";
import { RequestTableHeader } from "./RequestTableHeader";
import { RequestTableRow } from "./RequestTableRow";
import { useRequests } from "../../hooks/useRequests";
import type { ResponseRequestDTO } from "../../interfaces";

export const RequestsList: React.FC = () => {
    const { result } = useRequests();
    const { data, isLoading: isPending, isError, error } = result;

    const requests = data?.data ?? [];

    return (
        <div className="bg-white p-6 rounded-xl shadow-none border">
            {isError ? (
                <div className="px-4 py-6 text-sm text-red-600 flex items-start gap-2">
                    <FileText className="h-4 w-4" />
                    {error instanceof Error ? error.message : "No se pudo cargar el listado de solicitudes"}
                </div>
            ) : isPending ? (
                <div className="px-4 py-6 text-sm text-gray-500">Cargando solicitudes...</div>
            ) : requests.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-gray-500">No hay solicitudes registradas todavía.</div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <RequestTableHeader />
                        <TableBody>
                            {requests.map((request: ResponseRequestDTO) => (
                                <RequestTableRow request={request} key={request.ID} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};
