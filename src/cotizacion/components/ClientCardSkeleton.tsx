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
    <Card className="border shadow-none">

      {/* Header */}
      <CardHeader className="space-y-2">

        <CardTitle className="flex items-center gap-2">

          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Building className="w-5 h-5 opacity-40" />
          </div>

          <Skeleton className="h-5 w-40 bg-muted" />

        </CardTitle>

        <CardDescription className="flex justify-between items-center">

          <Skeleton className="h-4 w-36 bg-muted" />

          <Skeleton className="h-6 w-28 rounded-full bg-muted" />

        </CardDescription>

      </CardHeader>

      {/* Content */}
      <CardContent>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Field 1 */}
          <div className="space-y-2">

            <Skeleton className="h-4 w-16 bg-muted" />

            <Skeleton className="h-10 w-full rounded-md bg-muted" />

          </div>

          {/* Field 2 */}
          <div className="space-y-2">

            <Skeleton className="h-4 w-32 bg-muted" />

            <Skeleton className="h-10 w-full rounded-md bg-muted" />

          </div>

          {/* Field 3 */}
          <div className="sm:col-span-2 space-y-2">

            <Skeleton className="h-4 w-40 bg-muted" />

            <Skeleton className="h-10 w-full rounded-md bg-muted" />

          </div>

        </div>

      </CardContent>

    </Card>
  );
};