import { getServicios } from "@/intranet/services/api/service.api";
import type { Servicio } from "@/intranet/services/interfaces/service";
import {
  AddServicesFormSchema,
  defaultServiceFormItem,
  type AddServicesFormType,
  type ServiceFormItemType,
} from "@/intranet/quotation/schemas/addServiceItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export type AddServicesHandler = (formData: ServiceFormItemType[]) => void;

export const useAddServicesDialog = (
  isDialogOpen: boolean,
  onOpenChange: (open: boolean) => void,
  addHandler: AddServicesHandler,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [preSelectedIds, setPreSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
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
    queryKey: ["servicios", currentPage],
    queryFn: () => getServicios({ page: currentPage, limit: 6 }),
    enabled: isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen) {
      setCurrentPage(1);
      setPreSelectedIds(new Set());
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
      } else {
        append(defaultServiceFormItem({
          id: item.id.toString(),
          name: item.nombre,
          unitPrice: Number(item.precio_regular),
        }));
      }
    },
    [fields, append, remove],
  );

  const removeItem = useCallback(
    (itemId: string, deleteFieldIndex: number) => {
      setPreSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
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
    addHandler(formData.items);
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
