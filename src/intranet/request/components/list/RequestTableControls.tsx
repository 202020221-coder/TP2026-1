import { type FC, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Eraser, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useRequests } from "../../hooks/useRequests";
import { RequestStatesRecord, type RequestState } from "../../enum/request-state.record";

export const RequestTableControls: FC<{ children: ReactNode }> = ({ children }) => {
    const TopControls: FC = () => {
        const { query, queryParams, result } = useRequests();

        return (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 items-center">
                <div className="col-span-1 md:col-span-3 relative">
                    <Input
                        placeholder="Buscar por cliente o descripción"
                        className="pl-8"
                        disabled={result.isFetching}
                        value={(queryParams as any).search ?? ""}
                        onChange={(e) => query({ ...(queryParams as any), page: 1, search: e.target.value })}
                    />
                    <Search
                        className="absolute top-1/2 -translate-y-1/2 w-8 text-gray-400"
                        size={20}
                    />
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-x-2">
                    <Select
                        onValueChange={(value) => {
                            query({ ...(queryParams as any), page: 1, status: value as RequestState });
                        }}
                        value={(queryParams as any).status || ""}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Estados</SelectLabel>
                                {Object.values(RequestStatesRecord).map((status, i) => (
                                    <SelectItem key={`${i}-${status}`} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        size={"icon"}
                        onClick={() => query({ ...(queryParams as any), page: 1, status: undefined })}
                        disabled={!(queryParams as any).status}
                    >
                        <Eraser />
                    </Button>
                </div>

            </div>
        );
    };
    const BottomControls: FC = () => {
        const { query, queryParams, result } = useRequests();
        const pagination = result.data?.pagination;

        if (!pagination) return null;

        const nextDisabled =
            result.isPending ||
            result.isFetching ||
            result.isError ||
            pagination.page >= pagination.totalPages;
        const backDisabled =
            result.isPending ||
            result.isFetching ||
            result.isError ||
            pagination.page <= 1;

        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="col-span-1 flex items-center gap-x-2">
                    <Label htmlFor="request-query-size">Tamaño de Página:</Label>
                    <Select
                        onValueChange={(value) => {
                            query({ ...(queryParams as any), page: 1, per_page: Number(value) });
                        }}
                        value={((queryParams as any).per_page ?? pagination.limit).toString()}
                    >
                        <SelectTrigger id="request-query-size">
                            <SelectValue placeholder="Seleccione un tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15" disabled={pagination.total <= 10}>
                                15
                            </SelectItem>
                            <SelectItem value="20" disabled={pagination.total <= 15}>
                                20
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-center gap-x-2">
                    <Button
                        className="w-36"
                        variant="secondary"
                        disabled={backDisabled}
                        onClick={() => {
                            query({ ...(queryParams as any), page: pagination.page - 1 });
                        }}
                    >
                        <ArrowLeft /> Anterior
                    </Button>
                    <Button
                        className="w-36"
                        disabled={nextDisabled}
                        onClick={() => {
                            query({ ...(queryParams as any), page: pagination.page + 1 });
                        }}
                    >
                        Siguiente <ArrowRight />
                    </Button>
                </div>

                <div className="col-span-1 flex justify-end text-sm text-gray-600">
                    Página {pagination.page} de {pagination.totalPages}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <TopControls />
            {children}
            <BottomControls />
        </div>
    );
};
