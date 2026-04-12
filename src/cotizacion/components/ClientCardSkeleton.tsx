import type { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Building } from "lucide-react";

export const ClientCardSkeleton: FC = () => {
  return (
    <Card className="shadow-none h-[85%] sm:flex sm:h-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <Building className="opacity-40" />
          <span className="pb-0.5 font-[375]">
            <Skeleton className="h-5 w-40" />
          </span>
        </CardTitle>

        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          <Skeleton className="h-4 w-48 mt-2" />
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-5">
        {/* Badge Skeleton */}
        <div className="sm:col-span-2 flex justify-between items-center">
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>

        {/* DNI / RUC */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-14 md:h-9 w-full rounded-md" />
        </div>

        {/* Nombre Comercial */}
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-14 md:h-9 w-full rounded-md" />
        </div>

        {/* Razón Social */}
        <div>
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-14 md:h-9 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};