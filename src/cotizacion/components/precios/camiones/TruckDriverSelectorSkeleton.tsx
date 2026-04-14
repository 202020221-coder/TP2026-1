import { Field } from "@/shared/components/ui/field";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function TruckDriverSelectorSkeleton() {
  return (
    <Field className="space-y-2">

      <Skeleton className="h-4 w-40 bg-gray-300" />

      <Skeleton className="h-11 w-full bg-gray-300 rounded-md" />

    </Field>
  )
}