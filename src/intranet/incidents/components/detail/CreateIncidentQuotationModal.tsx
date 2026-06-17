import { useEffect, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  createIncidentQuotation,
  getIncidentQuotationDestinatarios,
  getIncidentQuotations,
} from "../../api/incident.api";
import type {
  CreateIncidentQuotationDestinatarioBody,
  IncidentQuotationDestinatarioOption,
} from "../../interfaces/incident-quotation";

interface CreateIncidentQuotationModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
  returnTo?: string;
}

const optionKey = (
  option: IncidentQuotationDestinatarioOption,
  index: number,
): string => {
  if (option.tipo === "involucrado") {
    return `involucrado-${option.involucrado_id ?? index}`;
  }
  if (option.tipo === "empresa") {
    return `empresa-${option.dni_o_ruc ?? index}`;
  }
  return "no_especificado";
};

const toDestinatarioBody = (
  option: IncidentQuotationDestinatarioOption,
): CreateIncidentQuotationDestinatarioBody => {
  if (option.tipo === "involucrado") {
    return {
      tipo: "involucrado",
      involucrado_id: option.involucrado_id,
    };
  }
  if (option.tipo === "empresa") {
    return {
      tipo: "empresa",
      ...(option.dni_o_ruc ? { dni_o_ruc: option.dni_o_ruc } : {}),
    };
  }
  return { tipo: "no_especificado" };
};

export const CreateIncidentQuotationModal: FC<
  CreateIncidentQuotationModalProps
> = ({ incidentId, open, onClose, returnTo }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<IncidentQuotationDestinatarioOption[]>(
    [],
  );
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    if (!open || !incidentId) return;

    let cancelled = false;
    setLoadingOptions(true);
    setSelectedKey("");

    getIncidentQuotationDestinatarios(incidentId)
      .then((response) => {
        if (cancelled) return;
        setOptions(response.opciones);
        if (response.opciones.length > 0) {
          setSelectedKey(optionKey(response.opciones[0], 0));
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("No se pudieron cargar los destinatarios.");
          setOptions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, incidentId]);

  const selectedOption = useMemo(
    () =>
      options.find((option, index) => optionKey(option, index) === selectedKey),
    [options, selectedKey],
  );

  const handleConfirm = async () => {
    if (!selectedOption) {
      toast.error("Selecciona un destinatario.");
      return;
    }

    setSaving(true);
    try {
      const created = await createIncidentQuotation(incidentId, {
        destinatario: toDestinatarioBody(selectedOption),
      });

      let quotationId = created.id;

      if (!quotationId) {
        const quotations = await getIncidentQuotations(incidentId);
        quotationId = quotations.reduce(
          (max, q) => (q.id > max ? q.id : max),
          0,
        );
      }

      if (!quotationId) {
        toast.error(
          "La cotización se creó pero no se pudo obtener su ID. Revise el listado de cotizaciones de la incidencia.",
        );
        await queryClient.invalidateQueries({
          queryKey: ["incident-quotations", incidentId],
        });
        onClose();
        return;
      }

      if (
        Array.isArray(created.presupuesto_autorrellenado) &&
        created.presupuesto_autorrellenado.length > 0
      ) {
        queryClient.setQueryData(
          ["presupuesto-items", quotationId, "Material Directo"],
          { data: created.presupuesto_autorrellenado },
        );
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["presupuesto-items", quotationId, "Material Directo"],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["incident-quotations", incidentId],
      });
      toast.success("Cotización de incidencia creada correctamente.");
      onClose();
      navigate(`/intranet/cotizaciones/editar/${quotationId}`, {
        state: returnTo ? { returnTo } : undefined,
      });
    } catch {
      toast.error("No se pudo crear la cotización de incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !saving && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            ¿A quién estará destinada esta cotización?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Incidencia #{incidentId}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="destinatario-cotizacion">Destinatario</Label>
            {loadingOptions ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando destinatarios…
              </div>
            ) : options.length === 0 ? (
              <p className="text-sm text-amber-700">
                No hay destinatarios disponibles para esta incidencia.
              </p>
            ) : (
              <select
                id="destinatario-cotizacion"
                className="w-full h-10 rounded-md border border-input bg-white px-3 text-sm"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                disabled={saving}
              >
                {options.map((option, index) => (
                  <option key={optionKey(option, index)} value={optionKey(option, index)}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => void handleConfirm()}
              disabled={saving || loadingOptions || !selectedOption}
            >
              {saving ? "Creando..." : "Crear cotización"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
