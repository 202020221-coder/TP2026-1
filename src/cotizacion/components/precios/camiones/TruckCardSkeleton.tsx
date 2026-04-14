import { Field, FieldContent, FieldLabel } from "@/shared/components/ui/field";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function TruckCardSkeleton() {
  return (
    <FieldLabel
      className="
        block
        rounded-lg
        border
        p-4
        h-full
        cursor-default
      "
    >
      <Field className="gap-3 p-0">
        <FieldContent className="space-y-3">
          {/* HEADER */}

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 bg-muted" />

              <Skeleton className="h-5 w-28 bg-muted" />
            </div>

            <Skeleton className="h-4 w-40 bg-muted" />
          </div>

          {/* DETAILS */}

          <div className="space-y-1">
            <Skeleton className="h-4 w-44 bg-muted" />

            <Skeleton className="h-3 w-28 bg-muted" />

            <Skeleton className="h-3 w-36 bg-muted" />
          </div>
        </FieldContent>
      </Field>
    </FieldLabel>
  );
}
