import { differenceInDays, format } from "date-fns"
import { RadioGroupItem } from "@/shared/components/ui/radio-group"
import {
  FieldLabel,
  Field,
  FieldContent,
} from "@/shared/components/ui/field"
import { Badge } from "@/shared/components/ui/badge"
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks"

interface TruckCardProps {
  truck: Truck
}

export function TruckCard({
  truck,
}: TruckCardProps) {
  const revisionDate = new Date(truck.fecha_prox_revision)
  const today = new Date()

  const daysUntilRevision = differenceInDays(
    revisionDate,
    today
  )

  const needsRevisionSoon =
    daysUntilRevision <= 30 && daysUntilRevision >= 0

  return (
    <FieldLabel
      className={`
        cursor-pointer
        block
        rounded-lg
        border
        bg-card
        p-4
        transition-all
        h-full

        hover:border-primary
        hover:shadow-sm

        data-[state=checked]:border-primary
        data-[state=checked]:ring-2
        data-[state=checked]:ring-primary/30
        data-[state=checked]:bg-primary/5
      `}
    >
      <RadioGroupItem
        value={JSON.stringify(truck)}
        id={`truck-${truck.Placa}`}
        className="sr-only"
      />

      <Field className="gap-3 p-0">
        <FieldContent className="space-y-3">

          {/* HEADER */}

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold tracking-tight">
                {truck.Placa}
              </span>

              <Badge
                variant={
                  needsRevisionSoon
                    ? "destructive"
                    : "secondary"
                }
              >
                {needsRevisionSoon
                  ? "Revisión próxima"
                  : "Vigente"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground line-clamp-1">
              {truck.nombre}
            </div>
          </div>

          {/* DETAILS */}

          <div className="text-sm text-muted-foreground space-y-1">

            <div>
              {truck.modelo} •{" "}
              {truck.ano_fabricacion}
            </div>

            <div className="text-xs">
              {truck.color}
            </div>

            <div className="text-xs">
              Próx revisión:{" "}
              {format(
                revisionDate,
                "dd MMM yyyy"
              )}
            </div>

          </div>

        </FieldContent>
      </Field>
    </FieldLabel>
  )
}