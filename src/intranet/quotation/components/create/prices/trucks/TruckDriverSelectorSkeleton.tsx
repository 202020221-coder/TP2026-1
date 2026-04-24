import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { UserRound } from "lucide-react";

export function TruckDriverSelectorSkeleton() {
  return (
    <Card className="gap-4 border bg-card shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <UserRound className="h-4 w-4 text-primary" />
          Conductor asignado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-14 w-full rounded-md border border-primary/30 bg-primary/10" />
      </CardContent>
    </Card>
  );
}