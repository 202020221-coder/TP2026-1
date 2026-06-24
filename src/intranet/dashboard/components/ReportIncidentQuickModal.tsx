import { useEffect, useRef, useState, type FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Mic, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Project } from "@/intranet/projects/interfaces/project";
import { createIncident } from "@/intranet/incidents/api/incident.api";
import { IncidentStatesRecord } from "@/intranet/incidents/enum/incident-state.record";
import type {
  IncidentCategory,
  IncidentSeverity,
} from "../interfaces/field-supervisor-dashboard.types";
import {
  buildIncidentComment,
  buildIncidentTitle,
} from "../lib/field-supervisor-incident-utils";

const CATEGORIES: IncidentCategory[] = [
  "Seguridad",
  "Retraso de material",
  "Desviación técnica",
  "Clima",
  "Otro",
];

const SEVERITIES: IncidentSeverity[] = ["Baja", "Media", "Alta", "Crítica"];

interface ReportIncidentQuickModalProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId?: number | null;
  defaultClientRuc?: string | null;
}

export const ReportIncidentQuickModal: FC<ReportIncidentQuickModalProps> = ({
  open,
  onClose,
  projects,
  defaultProjectId,
  defaultClientRuc,
}) => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("Seguridad");
  const [severity, setSeverity] = useState<IncidentSeverity>("Media");
  const [description, setDescription] = useState("");
  const [evidenceName, setEvidenceName] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setProjectId(
      defaultProjectId != null ? String(defaultProjectId) : projects[0]?.id_Proyecto?.toString() ?? "",
    );
    setCategory("Seguridad");
    setSeverity("Media");
    setDescription("");
    setEvidenceName(null);
    setSaving(false);
  }, [open, defaultProjectId, projects]);

  const selectedProject = projects.find(
    (p) => String(p.id_Proyecto) === projectId,
  );
  const clientRuc =
    selectedProject?.Id_Cliente ?? defaultClientRuc ?? "";

  const handleDictation = () => {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      start: () => void;
    };

    const win = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognition = win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.message("Usa el dictado por voz del teclado de tu dispositivo.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-PE";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      toast.error("No se pudo iniciar el dictado por voz.");
    };
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!projectId || !clientRuc || !description.trim()) {
      toast.error("Completa proyecto, empresa y descripción.");
      return;
    }

    setSaving(true);
    try {
      await createIncident({
        id_proyecto: Number(projectId),
        empresa_involucrada: clientRuc,
        nombre_incidencia: buildIncidentTitle(category, severity),
        comentario: buildIncidentComment(category, severity, description),
        estado: IncidentStatesRecord.enviado,
      });
      await queryClient.invalidateQueries({ queryKey: ["incidents"] });
      await queryClient.invalidateQueries({
        queryKey: ["field-supervisor-dashboard"],
      });
      toast.success(
        evidenceName
          ? "Incidencia reportada. Adjunta la evidencia en el detalle."
          : "Incidencia reportada correctamente.",
      );
      onClose();
    } catch (error: unknown) {
      const msg =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
          ? String(
              (error.response as { data?: { error?: string } }).data?.error ??
                "Error al reportar",
            )
          : "No se pudo reportar la incidencia.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1rem)] max-w-lg flex-col overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Plus className="size-5 text-primary" />
            Reportar incidencia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label>Proyecto / obra</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Selecciona el proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem
                    key={project.id_Proyecto}
                    value={String(project.id_Proyecto)}
                  >
                    {project.Cotizacion_Nombre ?? project.descripcion_servicio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as IncidentCategory)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Severidad</Label>
              <Select
                value={severity}
                onValueChange={(v) => setSeverity(v as IncidentSeverity)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="fs-description">Descripción rápida</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9"
                onClick={handleDictation}
              >
                <Mic className="mr-1 size-4" />
                Dictar
              </Button>
            </div>
            <Textarea
              id="fs-description"
              rows={4}
              className="min-h-28 text-base"
              placeholder="Describe el problema en campo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Evidencia fotográfica</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setEvidenceName(file?.name ?? null);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-center text-base"
              onClick={() => fileRef.current?.click()}
            >
              <Camera className="mr-2 size-5" />
              {evidenceName ? evidenceName : "Tomar o adjuntar foto"}
            </Button>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full sm:w-auto"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-12 w-full bg-primary text-base font-semibold sm:w-auto"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? "Enviando..." : "Enviar reporte"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
