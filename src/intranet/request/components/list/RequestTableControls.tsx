import { type FC, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Eraser, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
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

    return (
        <div className="space-y-3">
            <TopControls />
            {children}
        </div>
    );
};
