import { getInventoryItems } from "@/intranet/quotation/api/inventory.api";
import type { InventoryItem } from "@/intranet/quotation/interfaces/create/order-inventory";
import {
  SelectInventoryFormSchema,
  type SelectInventoryFormType,
} from "@/intranet/quotation/schemas/addInventoryItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export type AddHandler = (formData: SelectInventoryFormType["items"]) => void;

export const useAddProductsDialog = (
  isDialogOpen: boolean,
  onOpenChange: (open: boolean) => void,
  addHandler: AddHandler,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [preSelectedIds, setPreSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
  const { control, trigger, getValues, formState, reset } =
    useForm<SelectInventoryFormType>({
      resolver: zodResolver(SelectInventoryFormSchema),
      defaultValues: {
        items: [],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  // Fetch catalog with React Query
  const queryInventory = useQuery({
    queryKey: ["inventory", currentPage],
    queryFn: () => getInventoryItems({ page: currentPage }),
    enabled: isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen) {
      setCurrentPage(1);
      setPreSelectedIds(new Set());
      reset();
    }
  }, [isDialogOpen]);

  const toggleItem = useCallback((item: InventoryItem, selected: boolean) => {
    setPreSelectedIds((prev) => {
      const newSet = new Set(prev);
      const ItemID = item.Id_Objeto.toString();
      if (selected) {
        newSet.delete(ItemID);
      } else {
        newSet.add(ItemID);
      }
      return newSet;
    });

    if (selected) {
      //delete from fields
      const deleteFieldIndex = fields.findIndex(
        (field) => field.id === item.Id_Objeto.toString(),
      );

      remove(deleteFieldIndex);
    } else {
      //add to fields
      append({
        /**campos visuales */
        idInventario: item.Id_Objeto.toString(),
        precio_comercial: Number(item.precio_comercial),
        nombre: item.nombre_objeto,
        /**campos modificables por el usuario */
        intencion: "comprar",
        cantidad: 0,
        precio_unitario: 0,
      });
    }
  }, []);

  const removeItem = useCallback((itemId: string, deleteFieldIndex: number) => {
    setPreSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    remove(deleteFieldIndex);
  }, []);

  const confirm = useCallback(async () => {
    setIsConfirming(true);

    const formvalues = getValues();
    console.log("Valores:", formvalues);

    const passed = await trigger();
    if (!passed) {
      console.log("ERROR");

      console.log(formState.errors);

      setIsConfirming(false);
      return;
    }
    const formData = getValues();
    addHandler(formData.items);
    setIsConfirming(false);
    handleClose();
  }, [getValues, addHandler]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return {
    toggleItem,
    removeItem,
    confirm,
    setCurrentPage,
    handleClose,
    queryInventory,
    selectedItemsIds: preSelectedIds,
    selectedItems: fields,
    formControl: control,
    isConfirming,
  };
};
