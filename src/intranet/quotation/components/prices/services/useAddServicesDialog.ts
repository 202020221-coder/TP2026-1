import {
  getServicios,
  getIncidentServiceCatalog,
  getServicioPrincipal,
} from "@/intranet/services/api/service.api";
import type { Servicio, ServicioFase } from "@/intranet/services/interfaces/service";
import {
  AddServicesFormSchema,
  defaultServiceFormItem,
  type AddServicesFormType,
  type ServiceFormItemType,
} from "@/intranet/quotation/schemas/addServiceItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export type AddServicesHandler = (
  formData: ServiceFormItemType[],
  phases?: ServicioFase[],
) => void;

export const useAddServicesDialog = (
  isDialogOpen: boolean,
  onOpenChange: (open: boolean) => void,
  addHandler: AddServicesHandler,
  incidentCatalog = false,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [preSelectedIds, setPreSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
  // Acumula las fases de los servicios seleccionados (clave: id del servicio).
  const selectedFasesRef = useRef<Map<string, ServicioFase[]>>(new Map());
  const { control, trigger, getValues, reset } =
    useForm<AddServicesFormType>({
      resolver: zodResolver(AddServicesFormSchema),
      defaultValues: {
        items: [],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const queryServicios = useQuery({
    queryKey: incidentCatalog
      ? ["servicios", "incidencia-catalogo"]
      : ["servicios", currentPage],
    queryFn: () =>
      incidentCatalog
        ? getIncidentServiceCatalog().then((data) => ({
            data,
            pagination: {
              page: 1,
              limit: data.length,
              total: data.length,
              totalPages: 1,
            },
          }))
        : getServicios({ page: currentPage, limit: 6 }),
    enabled: isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen) {
      setCurrentPage(1);
      setPreSelectedIds(new Set());
      selectedFasesRef.current = new Map();
      reset();
    }
  }, [isDialogOpen, reset]);

  const toggleItem = useCallback(
    (item: Servicio, selected: boolean) => {
      if (!item.activo) return;

      setPreSelectedIds((prev) => {
        const newSet = new Set(prev);
        const itemId = item.id.toString();
        if (selected) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });

      if (selected) {
        const deleteFieldIndex = fields.findIndex(
          (field) => field.id === item.id.toString(),
        );
        if (deleteFieldIndex !== -1) {
          remove(deleteFieldIndex);
        }
        selectedFasesRef.current.delete(item.id.toString());
      } else {
        append(defaultServiceFormItem({
          id: item.id.toString(),
          name: item.nombre,
          unitPrice: Number(item.precio_regular),
        }));
        if (!incidentCatalog) {
          // Trae las fases reales (etapas) del servicio para autocompletarlas
          // luego en la cotización.
          if (item.fases && item.fases.length > 0) {
            selectedFasesRef.current.set(item.id.toString(), item.fases);
          } else {
            getServicioPrincipal(item.id)
              .then(({ fases }) => {
                if (fases.length > 0) {
                  selectedFasesRef.current.set(item.id.toString(), fases);
                }
              })
              .catch(() => {
                /* sin fases: no se autocompleta nada */
              });
          }
        }
      }
    },
    [fields, append, remove, incidentCatalog],
  );

  const removeItem = useCallback(
    (itemId: string, deleteFieldIndex: number) => {
      setPreSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      selectedFasesRef.current.delete(itemId);
      remove(deleteFieldIndex);
    },
    [remove],
  );

  const confirm = useCallback(async () => {
    setIsConfirming(true);

    const passed = await trigger();
    if (!passed) {
      setIsConfirming(false);
      return;
    }

    const formData = getValues();
    // Recolectar las fases de todos los servicios seleccionados (en orden).
    const collectedPhases: ServicioFase[] = formData.items.flatMap(
      (item) => selectedFasesRef.current.get(item.id) ?? [],
    );
    addHandler(formData.items, collectedPhases);
    setIsConfirming(false);
    handleClose();
  }, [trigger, getValues, addHandler]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return {
    toggleItem,
    removeItem,
    confirm,
    setCurrentPage,
    handleClose,
    queryServicios,
    selectedItemsIds: preSelectedIds,
    selectedItems: fields,
    formControl: control,
    isConfirming,
  };
};
