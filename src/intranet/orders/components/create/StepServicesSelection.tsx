import type { LucideIcon } from "lucide-react";
import { Calendar, Minus, Plus, ShoppingCart, Trash2, Wrench } from "lucide-react";
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { SelectedTruck, ServiceOption } from './types';

function formatServicePrice(price: number | string | undefined): string | null {
    if (price === undefined || price === null || price === '') return null;
    const num = typeof price === 'number' ? price : Number(price);
    if (!Number.isNaN(num) && num <= 0) return null;
    return String(price);
}

interface StepServicesSelectionProps {
    serviceOptions: ServiceOption[];
    selectedServices: SelectedTruck[];
    isLoading?: boolean;
    onAddService: (
        serviceId: string,
        name: string,
        intent: 'alquilar' | 'comprar',
        price?: number | string,
        description?: string,
    ) => void;
    onUpdateServiceDays: (id: string, days: string) => void;
    onUpdateServiceQuantity: (id: string, delta: number) => void;
    onRemoveService: (id: string) => void;
}

function ServiceCardVisual({
    imageUrl,
    Icon,
    name,
}: {
    imageUrl?: string;
    Icon: LucideIcon;
    name: string;
}) {
    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                className="mb-4 h-24 w-24 rounded-full object-cover ring-1 ring-blue-100"
            />
        );
    }

    return (
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-slate-50 to-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Icon size={40} className="transition-transform duration-300 group-hover:scale-110" />
        </div>
    );
}

export function StepServicesSelection({
    serviceOptions,
    selectedServices,
    isLoading = false,
    onAddService,
    onUpdateServiceDays,
    onUpdateServiceQuantity,
    onRemoveService,
}: StepServicesSelectionProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Selección de Servicios</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Busca y selecciona los servicios que deseas contratar o adquirir.
                    </p>

                    {isLoading ? (
                        <p className="text-sm text-gray-500">Cargando servicios...</p>
                    ) : serviceOptions.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay servicios disponibles en este momento.</p>
                    ) : (
                        <div className="custom-scrollbar grid max-h-[500px] grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
                            {serviceOptions.map((service) => {
                                const Icon = service.Icon;
                                const priceLabel = formatServicePrice(service.price);
                                return (
                                    <div
                                        key={service.id}
                                        className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-sky-400 to-cyan-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <ServiceCardVisual
                                            imageUrl={service.imageUrl}
                                            Icon={Icon}
                                            name={service.name}
                                        />
                                        <h4 className="mb-2 min-h-12 text-center text-sm leading-snug font-bold text-gray-900">
                                            {service.name}
                                        </h4>
                                        <p className="mb-4 min-h-[60px] text-center text-xs leading-relaxed text-gray-500">
                                            {service.description || 'Descripción no disponible por ahora.'}
                                        </p>
                                        {priceLabel ? (
                                            <div className="mb-5 inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-gray-800">
                                                {priceLabel}
                                            </div>
                                        ) : null}
                                        <div className="mt-auto flex w-full gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-blue-200 bg-blue-50 px-2 text-xs text-blue-700 hover:bg-blue-100"
                                                onClick={() =>
                                                    onAddService(
                                                        service.id,
                                                        service.name,
                                                        'alquilar',
                                                        service.price,
                                                        service.description,
                                                    )
                                                }
                                            >
                                                Alquilar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-gray-300 px-2 text-xs text-gray-700 hover:bg-gray-50"
                                                onClick={() =>
                                                    onAddService(
                                                        service.id,
                                                        service.name,
                                                        'comprar',
                                                        service.price,
                                                        service.description,
                                                    )
                                                }
                                            >
                                                Comprar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-8 flex h-full flex-col border-l border-gray-200 lg:col-span-5 lg:mt-0 lg:pl-8">
                    <div className="mb-6 flex items-center gap-2">
                        <ShoppingCart className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Servicios seleccionados</h3>
                        <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                            {selectedServices.length}
                        </span>
                    </div>

                    {selectedServices.length === 0 ? (
                        <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center text-gray-400">
                            <Wrench size={48} className="mb-4 opacity-20" />
                            <p>No hay servicios seleccionados</p>
                        </div>
                    ) : (
                        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                            {selectedServices.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative rounded-lg border border-blue-200 bg-blue-50 p-4 animate-in fade-in"
                                >
                                    <button
                                        onClick={() => onRemoveService(item.id)}
                                        className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <h4 className="w-10/12 text-sm font-bold text-gray-800 uppercase">{item.name}</h4>

                                    <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Intención:</span>
                                            <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs capitalize">
                                                {item.intent}
                                            </span>
                                        </div>

                                        {item.intent === 'alquilar' && (
                                            <div className="flex items-center text-gray-600">
                                                <span className="w-20 font-medium">Días:</span>
                                                <div className="relative">
                                                    <Calendar className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={item.days}
                                                        onChange={(e) => onUpdateServiceDays(item.id, e.target.value)}
                                                        className="h-7 w-24 bg-white pl-8 text-center text-xs"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Cantidad:</span>
                                            <div className="flex items-center rounded border border-gray-200 bg-white">
                                                <button
                                                    className="rounded-l px-2 py-1 transition-colors hover:bg-gray-100"
                                                    onClick={() => onUpdateServiceQuantity(item.id, -1)}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 border-x border-gray-100 bg-gray-50 px-3 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="rounded-r px-2 py-1 transition-colors hover:bg-gray-100"
                                                    onClick={() => onUpdateServiceQuantity(item.id, 1)}
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
