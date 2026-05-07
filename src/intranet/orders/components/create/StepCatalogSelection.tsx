import { Calendar, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { CatalogOption, SelectedProduct } from './types';

interface StepCatalogSelectionProps {
    catalogOptions: CatalogOption[];
    selectedProducts: SelectedProduct[];
    onAddProduct: (
        productId: string,
        name: string,
        intent: 'alquilar' | 'comprar',
        category?: string,
    ) => void;
    onUpdateProductDays: (id: string, days: string) => void;
    onUpdateProductQuantity: (id: string, delta: number) => void;
    onRemoveProduct: (id: string) => void;
}

export function StepCatalogSelection({
    catalogOptions,
    selectedProducts,
    onAddProduct,
    onUpdateProductDays,
    onUpdateProductQuantity,
    onRemoveProduct,
}: StepCatalogSelectionProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Selección de Catálogo</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Busca y selecciona los productos que deseas alquilar o comprar.
                    </p>

                    <div className="custom-scrollbar grid max-h-[500px] grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
                        {catalogOptions.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-4 flex h-24 w-24 items-center justify-center text-blue-500">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-100 bg-slate-100 p-2 text-center text-[10px] font-semibold uppercase">
                                        {product.category || 'Catálogo'}
                                    </div>
                                </div>
                                <h4 className="mb-1 min-h-10 text-center text-sm font-semibold text-gray-800">
                                    {product.name}
                                </h4>
                                <p className="mb-4 min-h-[30px] text-center text-[10px] text-gray-400">
                                    Garantía: {product.garantia}
                                </p>
                                <h4 className="mb-1 min-h-10 text-center text-sm font-semibold text-gray-800">
                                    {product.precio_comercial}
                                </h4>
                                <div className="mt-auto flex w-full gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-blue-200 bg-blue-50 px-2 text-xs text-blue-700 hover:bg-blue-100"
                                        onClick={() =>
                                            onAddProduct(product.id, product.name, 'alquilar', product.category)
                                        }
                                    >
                                        Alquilar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-gray-300 px-2 text-xs text-gray-700 hover:bg-gray-50"
                                        onClick={() =>
                                            onAddProduct(product.id, product.name, 'comprar', product.category)
                                        }
                                    >
                                        Comprar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex h-full flex-col border-l border-gray-200 lg:col-span-5 lg:mt-0 lg:pl-8">
                    <div className="mb-6 flex items-center gap-2">
                        <ShoppingCart className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Selección del catálogo</h3>
                        <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                            {selectedProducts.length}
                        </span>
                    </div>

                    {selectedProducts.length === 0 ? (
                        <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center text-gray-400">
                            <ShoppingCart size={48} className="mb-4 opacity-20" />
                            <p>No hay productos seleccionados</p>
                        </div>
                    ) : (
                        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                            {selectedProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative rounded-lg border border-blue-200 bg-blue-50 p-4 animate-in fade-in"
                                >
                                    <button
                                        onClick={() => onRemoveProduct(item.id)}
                                        className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <h4 className="w-10/12 text-xs font-bold text-gray-800 uppercase">{item.name}</h4>
                                    <p className="mb-2 text-[10px] text-gray-500">{item.category}</p>

                                    <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-16 font-medium">Intención:</span>
                                            <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs capitalize">
                                                {item.intent}
                                            </span>
                                        </div>

                                        {item.intent === 'alquilar' && (
                                            <div className="flex items-center text-gray-600">
                                                <span className="w-16 font-medium">Días:</span>
                                                <div className="relative">
                                                    <Calendar className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={item.days}
                                                        onChange={(e) => onUpdateProductDays(item.id, e.target.value)}
                                                        className="h-7 w-20 bg-white pl-8 text-center text-xs"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center text-gray-600">
                                            <span className="w-16 font-medium">Cantidad:</span>
                                            <div className="flex items-center rounded border border-gray-200 bg-white">
                                                <button
                                                    className="rounded-l px-2 py-1 transition-colors hover:bg-gray-100"
                                                    onClick={() => onUpdateProductQuantity(item.id, -1)}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 border-x border-gray-100 bg-gray-50 px-2 text-center text-xs font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="rounded-r px-2 py-1 transition-colors hover:bg-gray-100"
                                                    onClick={() => onUpdateProductQuantity(item.id, 1)}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
