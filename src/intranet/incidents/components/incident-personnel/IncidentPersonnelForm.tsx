import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { personnelService } from "@/intranet/personnel/services/personnel.service";
import type { Personal } from "@/intranet/personnel/types";
import type { PersonnelFormState } from "./types";

interface IncidentPersonnelFormProps {
  form: PersonnelFormState;
  onFormChange: (next: PersonnelFormState) => void;
}

function getFullName(person: Personal) {
  return `${person.Nombre} ${person.Apellido}`.trim();
}

function getCargo(person: Personal) {
  return person.rol?.trim() || person.profesion?.trim() || "";
}

export function IncidentPersonnelForm({
  form,
  onFormChange,
}: IncidentPersonnelFormProps) {
  const [searchTerm, setSearchTerm] = useState(form.nombre);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ["incident-personnel-profiles"],
    queryFn: async () => {
      const response = await personnelService.list({ limit: 500 });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setSearchTerm(form.nombre);
  }, [form.nombre]);

  const filteredProfiles = useMemo(() => {
    if (!form.tiene_relacion_empresa) {
      return [];
    }

    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return [];
    }

    return profiles
      .filter((person) => {
        const fullName = getFullName(person).toLowerCase();
        const haystack = [
          fullName,
          person.DNI,
          person.rol ?? "",
          person.profesion ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, 8);
  }, [form.tiene_relacion_empresa, profiles, searchTerm]);

  const handleRelationChange = (tieneRelacion: boolean) => {
    onFormChange({
      ...form,
      tiene_relacion_empresa: tieneRelacion,
      nombre: "",
      dni: "",
      cargo: "",
    });
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSelectProfile = (person: Personal) => {
    const nombre = getFullName(person);
    onFormChange({
      ...form,
      nombre,
      dni: person.DNI,
      cargo: getCargo(person),
    });
    setSearchTerm(nombre);
    setIsDropdownOpen(false);
  };

  const dniDisabled = form.tiene_relacion_empresa;
  const cargoDisabled = form.tiene_relacion_empresa;

  return (
    <section className="rounded-[24px] border-2 border-border bg-muted/20 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="personnel-nombre">Nombre</Label>
            {form.tiene_relacion_empresa ? (
              <div className="relative">
                <Input
                  id="personnel-nombre"
                  value={searchTerm}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchTerm(value);
                    onFormChange({
                      ...form,
                      nombre: value,
                      dni: "",
                      cargo: "",
                    });
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setIsDropdownOpen(false)}
                  placeholder="Buscar por nombre del perfil..."
                  autoComplete="off"
                />

                {isDropdownOpen &&
                (searchTerm.trim().length > 0 || loadingProfiles) ? (
                  <div
                    className="absolute z-50 mt-1 w-full rounded-md border bg-card shadow-md"
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <div className="max-h-56 overflow-auto">
                      {loadingProfiles ? (
                        <div className="space-y-2 px-3 py-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      ) : filteredProfiles.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Sin resultados para tu búsqueda.
                        </div>
                      ) : (
                        filteredProfiles.map((person) => (
                          <button
                            key={person.DNI}
                            type="button"
                            className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted/60"
                            onClick={() => handleSelectProfile(person)}
                          >
                            <span className="font-medium text-foreground">
                              {getFullName(person)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              DNI {person.DNI}
                              {getCargo(person) ? ` · ${getCargo(person)}` : ""}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Input
                id="personnel-nombre"
                value={form.nombre}
                onChange={(event) =>
                  onFormChange({ ...form, nombre: event.target.value })
                }
                placeholder="Nombre de la persona"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="personnel-dni">DNI</Label>
            <Input
              id="personnel-dni"
              value={form.dni}
              onChange={(event) =>
                onFormChange({ ...form, dni: event.target.value })
              }
              placeholder={form.tiene_relacion_empresa ? "Se autocompleta" : "Opcional"}
              disabled={dniDisabled}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="personnel-cargo">Cargo</Label>
            <Input
              id="personnel-cargo"
              value={form.cargo}
              onChange={(event) =>
                onFormChange({ ...form, cargo: event.target.value })
              }
              placeholder={form.tiene_relacion_empresa ? "Se autocompleta" : "Opcional"}
              disabled={cargoDisabled}
            />
          </div>
        </div>

        <div className="flex flex-col justify-start gap-3">
          <p className="text-sm font-medium text-foreground">
            ¿Tiene relación con la empresa?
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={form.tiene_relacion_empresa ? "default" : "outline"}
              size="sm"
              className={cn("min-w-16")}
              onClick={() => handleRelationChange(true)}
            >
              Sí
            </Button>
            <Button
              type="button"
              variant={!form.tiene_relacion_empresa ? "default" : "outline"}
              size="sm"
              className={cn("min-w-16")}
              onClick={() => handleRelationChange(false)}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="personnel-descargo">Descargo de la persona</Label>
          <Textarea
            id="personnel-descargo"
            rows={4}
            value={form.descargo_persona}
            onChange={(event) =>
              onFormChange({ ...form, descargo_persona: event.target.value })
            }
            placeholder="Escribe el descargo de la persona..."
            className="resize-y bg-background"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="personnel-comentario">Comentario de la empresa</Label>
          <Textarea
            id="personnel-comentario"
            rows={4}
            value={form.comentario_empresa}
            onChange={(event) =>
              onFormChange({ ...form, comentario_empresa: event.target.value })
            }
            placeholder="Escribe el comentario de la empresa..."
            className="resize-y bg-background"
          />
        </div>
      </div>
    </section>
  );
}
