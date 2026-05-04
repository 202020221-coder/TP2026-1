'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Truck, ShoppingCart, Trash2, Plus, Minus, Calendar } from "lucide-react";
import { useDataFetching } from '../hooks/useDataFetching';
import type { PostClientContactDTO, PostClientDTO, PostClientPerfilDTO, PostRequestDTO, PostRequestInventoryDTO, PostRequestServiceDTO, UpdateRequestDTO } from '../interfaces';
import { CreateClient, CreateClientContact, CreateClientPerfil, CreateRequest, CreateRequestInventory, CreateRequestService, UpdateRequest } from '../api';

export function CreateRequestPage() {
    const navigate = useNavigate();
    const [clientType, setClientType] = useState<'jurídica' | 'física' | null>(null);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
    const [createdClientId, setCreatedClientId] = useState<number | null>(null);
    const [createdRequestId, setCreatedRequestId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [perfilPayload, setPerfilPayload] = useState<PostClientPerfilDTO | null>(null);


    const { products, services, loading, error } = useDataFetching();

    const handleSubmitClient = async (
        clientData: PostClientDTO
    ): Promise<number | null> => {
        try {
            const clientResponse = await CreateClient(clientData);

            if ("error" in clientResponse) {
                console.error(clientResponse.error);
                return null;
            }

            const clientId = (clientResponse as any)?.id ?? Number(clientData.DNI_O_RUC) ?? null;
            if (clientId) setCreatedClientId(clientId);

            console.log("Cliente creado correctamente");
            return clientId;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const handleSubmitClientContact = async (
        clientId: number,
        data: PostClientContactDTO,
        perfilData?: PostClientPerfilDTO | null
    ) => {
        try {
            // Si se proporciona perfilData, crear el perfil antes del contacto
            if (perfilData) {
                const perfilResponse = await CreateClientPerfil(perfilData);
                if ("error" in perfilResponse) {
                    console.error("Error creando perfil:", perfilResponse.error);
                    // abortar para que el usuario lo revise
                    return;
                }
                console.log("Perfil creado:", perfilResponse);
            } else if (perfilPayload) {
                // si no se pasó como argumento, intentar usar el payload guardado
                const perfilResponse = await CreateClientPerfil(perfilPayload);
                if ("error" in perfilResponse) {
                    console.error("Error creando perfil:", perfilResponse.error);
                    return;
                }
                console.log("Perfil creado desde estado:", perfilResponse);
            }

            const response = await CreateClientContact(clientId, data);

            if ("error" in response) {
                console.error("Error creando contacto:", response.error);
                return;
            }

            console.log("Contacto creado:", response);
        } catch (error) {
            console.error("Error inesperado:", error);
        }
    };

    const handleCreateRequest = async (requestData: PostRequestDTO) => {
        try {
            const requestResponse = await CreateRequest(requestData);

            if ("error" in requestResponse) {
                console.error("Error creando solicitud:", requestResponse.error);
                return null;
            }

            console.log("Solicitud creada:", requestResponse);
            return requestResponse.id;
        } catch (error) {
            console.error("Error inesperado al crear solicitud:", error);
            return null;
        }
    };

    const handleCreateRequestService = async (requestId: number, serviceData: PostRequestServiceDTO) => {
        try {
            const serviceResponse = await CreateRequestService(requestId, serviceData);

            if ("error" in serviceResponse) {
                console.error("Error creando servicio:", serviceResponse.error);
                return null;
            }

            console.log("Servicio creado:", serviceResponse);
            return serviceResponse;
        } catch (error) {
            console.error("Error inesperado al crear servicio:", error);
            return null;
        }
    };

    const handleSubmitRequestInventory = async (
        requestId: number,
        data: PostRequestInventoryDTO
    ) => {
        try {
            const response = await CreateRequestInventory(requestId, data);

            if ("error" in response) {
                console.error("Error creando inventario:", response.error);
                return;
            }

            console.log("Inventario creado:", response);
        } catch (error) {
            console.error("Error inesperado:", error);
        }
    };

    const handleUpdateRequest = async (
        requestId: number,
        data: UpdateRequestDTO
    ) => {
        try {
            const response = await UpdateRequest(requestId, data);

            if ("error" in response) {
                console.error("Error actualizando solicitud:", response.error);
                return;
            }

            console.log("Solicitud actualizada:", response);
        } catch (error) {
            console.error("Error inesperado:", error);
        }
    };
    const [formData, setFormData] = useState({
        DNI_O_RUC: '',
        nombre_comercial: '',
        razon_social: '',
        rubro: '',
        ubicacion_facturacion: '',
        observacion: '',
    });
    const [perfilData, setPerfilData] = useState({
        DNI: '',
        Nombre: '',
        Apellido: '',
        Genero: '',
        correo_contacto: '',
        telefono_contacto: '',
    });
    const [contactData, setContactData] = useState({
        DNI_perfil: '',
        cargo_en_empresa: '',
        lugar_trabajo: '',
    });
    const [serviceData, setServiceData] = useState({
        Id_Cliente: '',
        descripcion: '',
        ubicacion: '',
        productoenvio: '',
        camionesenvio: '',
        obsgenerales: '',
        obseleccion: '',
        estado: '',
        Respuesta: '',
    });
    interface SelectedProduct {
        id: string; // Unique ID for cart item
        productId: string;
        name: string;
        category?: string;
        intent: 'alquilar' | 'comprar';
        days?: number;
        quantity: number;
    }
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    // Nueva pestaña 6: Selección de Camiones
    interface SelectedTruck {
        id: string; // Unique ID for cart item
        truckId?: string;
        name: string;
        description?: string;
        intent: 'alquilar' | 'comprar';
        quantity: number;
        days?: number;
        price?: number | string;
    }
    const [selectedTrucks, setSelectedTrucks] = useState<SelectedTruck[]>([]);

    const [preferencesData, setPreferencesData] = useState({
        generalObservations: '',
        selectionObservations: '',
    });

    const clientOptions = [
        {
            id: 'jurídica',
            label: 'Jurídica',
            description: 'Empresa o Sociedad',
            icon: '🏢',
        },
        {
            id: 'física',
            label: 'Física',
            description: 'Persona Natural',
            icon: '👤',
        },
    ];

    const catalogOptions = (products ?? []).map((p) => ({
        id: `product-${p.Id_Objeto}`,
        category: p.Fabricante_Nombre ?? '',
        name: p.nombre_objeto ?? '',
        garantia: p.garantia ?? '',
        precio_comercial: p.precio_comercial ?? '',
    }));

    const addProductToCart = (productId: string, name: string, intent: 'alquilar' | 'comprar', category?: string) => {
        const newItem: SelectedProduct = {
            id: `${productId}-${Date.now()}`,
            productId,
            name,
            category,
            intent,
            quantity: 1,
            days: intent === 'alquilar' ? 1 : undefined,
        };
        setSelectedProducts((prev) => [...prev, newItem]);
    };

    const updateProductQuantity = (id: string, delta: number) => {
        setSelectedProducts((prev) => prev.map(prod => {
            if (prod.id === id) {
                const newQuantity = Math.max(1, prod.quantity + delta);
                return { ...prod, quantity: newQuantity };
            }
            return prod;
        }));
    };

    const updateProductDays = (id: string, daysStr: string) => {
        const days = Math.max(1, parseInt(daysStr) || 1);
        setSelectedProducts((prev) => prev.map(prod => {
            if (prod.id === id && prod.intent === 'alquilar') {
                return { ...prod, days };
            }
            return prod;
        }));
    };

    const removeProduct = (id: string) => {
        setSelectedProducts((prev) => prev.filter(prod => prod.id !== id));
    };

    const truckOptions = (services ?? []).map((s) => {
        const rawId = (s as any).ID_Servicio ?? (s as any).Id_Objeto ?? (s as any).id ?? Date.now();
        const name = (s as any).nombre ?? (s as any).nombre_objeto ?? (s as any).Fabricante_Nombre ?? `Servicio ${rawId}`;
        const description = (s as any).descripcion ?? (s as any).observaciones ?? '';
        const price = (s as any).precio_regular ?? (s as any).precio_comercial ?? '';

        return {
            id: `service-${rawId}`,
            name,
            description,
            price,
        };
    });

    const steps = [
        { id: 1, label: 'Tipo de Cliente' },
        { id: 2, label: 'Datos del Cliente' },
        { id: 3, label: 'Solicitante' },
        { id: 4, label: 'Datos del Servicio' },
        { id: 5, label: 'Selección de Catálogo' },
        { id: 6, label: 'Selección de Camiones' },
        { id: 7, label: 'Preferencias' },
    ];

    const addTruckToCart = (truckId: string, name: string, intent: 'alquilar' | 'comprar', price?: number | string, description?: string) => {
        const newItem: SelectedTruck = {
            id: `${truckId}-${Date.now()}`,
            truckId,
            name,
            description,
            intent,
            quantity: 1,
            days: intent === 'alquilar' ? 1 : undefined,
            price,
        };
        setSelectedTrucks((prev) => [...prev, newItem]);
    };

    const updateTruckQuantity = (id: string, delta: number) => {
        setSelectedTrucks((prev) => prev.map(truck => {
            if (truck.id === id) {
                const newQuantity = Math.max(1, truck.quantity + delta);
                return { ...truck, quantity: newQuantity };
            }
            return truck;
        }));
    };

    const updateTruckDays = (id: string, daysStr: string) => {
        const days = Math.max(1, parseInt(daysStr) || 1);
        setSelectedTrucks((prev) => prev.map(truck => {
            if (truck.id === id && truck.intent === 'alquilar') {
                return { ...truck, days };
            }
            return truck;
        }));
    };

    const removeTruck = (id: string) => {
        setSelectedTrucks((prev) => prev.filter(truck => truck.id !== id));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                {/* Visual Header / Stepper Progress */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nueva Solicitud</h1>

                    {/* Stepper component */}
                    <div className="w-full relative pt-2 pb-14 mb-4">
                        {/* Línea de fondo */}
                        <div className="absolute top-7 left-8 right-8 h-1 bg-gray-200 z-0"></div>
                        {/* Línea de progreso coloreada */}
                        <div
                            className="absolute top-7 left-8 h-1 bg-blue-600 transition-all duration-500 ease-in-out z-0"
                            style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)` }}
                        ></div>

                        <div className="flex items-start justify-between w-full relative z-10">
                            {steps.map((step) => {
                                const isCompleted = currentStep > step.id;
                                const isActive = currentStep === step.id;

                                return (
                                    <div key={step.id} className="flex flex-col items-center flex-1 max-w-[14%]">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 mb-2 ${isCompleted
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : isActive
                                                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100'
                                                    : 'bg-white text-gray-400 border-2 border-gray-300'
                                                }`}
                                        >
                                            {isCompleted ? '✓' : step.id}
                                        </div>
                                        <span
                                            className={`text-[10px] sm:text-xs text-center leading-tight wrap-break-word px-1 w-full ${isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400 font-medium'
                                                }`}
                                            style={{ hyphens: 'auto' }}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Estado de carga / error del hook */}
                {loading && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">Cargando catálogo y servicios...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">Error cargando datos: {error}</p>
                        <div className="mt-2">
                            <Button onClick={() => window.location.reload()}>Reintentar</Button>
                        </div>
                    </div>
                )}

                Client Type Selection
                {currentStep === 1 && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Selecciona el Tipo de Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {clientOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${clientType === option.id
                                        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value={option.id}
                                        checked={clientType === option.id}
                                        onChange={(e) => setClientType(e.target.value as 'jurídica' | 'física')}
                                        className="w-5 h-5 text-blue-500 cursor-pointer accent-blue-500"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{option.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{option.label}</p>
                                                <p className="text-sm text-gray-500">{option.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 2 && clientType && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Datos de la {clientType === 'jurídica' ? 'Empresa' : 'Empresa'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Completa la informacion requerida para continuar.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    {clientType === 'jurídica' ? 'RUC' : 'RUC'}
                                </label>
                                <Input
                                    value={formData.DNI_O_RUC}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, DNI_O_RUC: e.target.value }))}
                                    placeholder={clientType === 'jurídica' ? 'Ej: 20512345678' : 'Ej: 74157562'}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre Comercial
                                </label>
                                <Input
                                    value={formData.nombre_comercial}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre_comercial: e.target.value }))}
                                    placeholder="Ej: Transportes del Norte"
                                    disabled={clientType === 'jurídica'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Razon Social
                                </label>
                                <Input
                                    value={formData.razon_social}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, razon_social: e.target.value }))}
                                    placeholder={clientType === 'jurídica' ? 'Ej: 20123456789' : 'Ej: 12345678'}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Rubro
                                </label>
                                <Input
                                    value={formData.rubro}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, rubro: e.target.value }))}
                                    placeholder="Ej: Transporte de carga"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Ubicación de Facturación
                                </label>
                                <Input
                                    value={formData.ubicacion_facturacion}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, ubicacion_facturacion: e.target.value }))}
                                    placeholder="Ej: Surco, Lima"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Observación
                                </label>
                                <Textarea
                                    value={formData.observacion}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, observacion: e.target.value }))}
                                    placeholder="Observaciones adicionales sobre el cliente (opcional)"
                                    className="min-h-9"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Datos del Solicitante del Servicio
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Ingresa la informacion de la persona que solicita el servicio.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <Input
                                    value={perfilData.Nombre}
                                    onChange={(e) => setPerfilData((prev) => ({ ...prev, Nombre: e.target.value }))}
                                    placeholder="Ej: Maria"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <Input
                                    value={perfilData.Apellido}
                                    onChange={(e) => setPerfilData((prev) => ({ ...prev, Apellido: e.target.value }))}
                                    placeholder="Ej: Gomez"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    DNI
                                </label>
                                <Input
                                    value={perfilData.DNI}
                                    onChange={(e) => {
                                        const dni = e.target.value;
                                        setPerfilData((prev) => ({ ...prev, DNI: dni }));
                                        setContactData((prev) => ({ ...prev, DNI_perfil: dni }));
                                    }}
                                    placeholder="Ej: 12345678"
                                    maxLength={8}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={perfilData.correo_contacto}
                                    onChange={(e) => setPerfilData((prev) => ({ ...prev, correo_contacto: e.target.value }))}
                                    placeholder="correo@dominio.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Celular
                                </label>
                                <Input
                                    value={perfilData.telefono_contacto}
                                    onChange={(e) => setPerfilData((prev) => ({ ...prev, telefono_contacto: e.target.value }))}
                                    placeholder="Ej: 987654321"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Cargo
                                </label>
                                <Input
                                    value={contactData.cargo_en_empresa}
                                    onChange={(e) => setContactData((prev) => ({ ...prev, cargo_en_empresa: e.target.value }))}
                                    placeholder="Ej: Jefe de Operaciones"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Direccion de Trabajo
                            </label>
                            <Textarea
                                value={contactData.lugar_trabajo}
                                onChange={(e) => setContactData((prev) => ({ ...prev, lugar_trabajo: e.target.value }))}
                                placeholder="Calle, numero, distrito"
                                className="min-h-20"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Datos del Servicio
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Ingresa la informacion del servicio solicitado.
                        </p>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Descripcion del servicio a detalle
                            </label>
                            <Textarea
                                value={serviceData.descripcion}
                                onChange={(e) => setServiceData((prev) => ({ ...prev, descripcion: e.target.value }))}
                                placeholder="Describe el servicio requerido (minimo 20 caracteres)"
                                className="min-h-24"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Direccion del lugar
                            </label>
                            <Textarea
                                value={serviceData.ubicacion}
                                onChange={(e) => setServiceData((prev) => ({ ...prev, ubicacion: e.target.value }))}
                                placeholder="Calle, numero, distrito"
                                className="min-h-20"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Panel Izquierdo: Catálogo de Productos */}
                            <div className="lg:col-span-7">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selección de Catálogo</h3>
                                <p className="text-sm text-gray-500 mb-6">Busca y selecciona los productos que deseas alquilar o comprar.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {catalogOptions.map(product => (
                                        <div key={product.id} className="border border-gray-200 rounded-xl bg-white p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-center w-24 h-24 mb-4 text-blue-500">
                                                {/* Placeholder for real product image */}
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-center font-semibold uppercase p-2 border-2 border-blue-100">
                                                    {product.category || 'Catálogo'}
                                                </div>
                                            </div>
                                            <h4 className="font-semibold text-gray-800 text-center mb-1 min-h-10 text-sm">{product.name}</h4>
                                            <p className="text-[10px] text-gray-400 text-center mb-4 min-h-[30px]">Garantía: {product.garantia}</p>
                                            <h4 className="font-semibold text-gray-800 text-center mb-1 min-h-10 text-sm">{product.precio_comercial}</h4>
                                            <div className="flex w-full gap-2 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs px-2"
                                                    onClick={() => addProductToCart(product.id, product.name, 'alquilar', product.category)}
                                                >
                                                    Alquilar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2"
                                                    onClick={() => addProductToCart(product.id, product.name, 'comprar', product.category)}
                                                >
                                                    Comprar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panel Derecho: Carrito de Selección */}
                            <div className="lg:col-span-5 flex flex-col h-full border-l border-gray-200 lg:pl-8 mt-8 lg:mt-0">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShoppingCart className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">Selección del catálogo</h3>
                                    <span className="ml-auto bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {selectedProducts.length}
                                    </span>
                                </div>

                                {selectedProducts.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                                        <ShoppingCart size={48} className="mb-4 opacity-20" />
                                        <p>No hay productos seleccionados</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedProducts.map(item => (
                                            <div key={item.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative animate-in fade-in">
                                                <button
                                                    onClick={() => removeProduct(item.id)}
                                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <h4 className="font-bold text-gray-800 text-xs w-10/12 uppercase">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500 mb-2">{item.category}</p>

                                                <div className="mt-2 space-y-2 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <span className="w-16 font-medium">Intención:</span>
                                                        <span className="capitalize bg-white px-2 py-0.5 rounded text-xs border border-gray-200">
                                                            {item.intent}
                                                        </span>
                                                    </div>

                                                    {item.intent === 'alquilar' && (
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="w-16 font-medium">Días:</span>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={item.days}
                                                                    onChange={(e) => updateProductDays(item.id, e.target.value)}
                                                                    className="h-7 w-20 text-center text-xs pl-8 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center text-gray-600">
                                                        <span className="w-16 font-medium">Cantidad:</span>
                                                        <div className="flex items-center bg-white rounded border border-gray-200">
                                                            <button
                                                                className="px-2 py-1 hover:bg-gray-100 rounded-l transition-colors"
                                                                onClick={() => updateProductQuantity(item.id, -1)}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="px-2 font-semibold text-xs w-8 text-center bg-gray-50 border-x border-gray-100">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="px-2 py-1 hover:bg-gray-100 rounded-r transition-colors"
                                                                onClick={() => updateProductQuantity(item.id, 1)}
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
                )}

                {/* NUEVO PASO: Selección de Camiones */}
                {currentStep === 6 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Panel Izquierdo: Catálogo de Camiones */}
                            <div className="lg:col-span-7">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selección de Camiones</h3>
                                <p className="text-sm text-gray-500 mb-6">Busca y selecciona los camiones que deseas alquilar o comprar.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {truckOptions.map(truck => (
                                        <div
                                            key={truck.id}
                                            className="group relative overflow-hidden border border-gray-200 rounded-2xl bg-white p-5 flex flex-col items-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                                        >
                                            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-sky-400 to-cyan-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                            <div className="flex items-center justify-center w-24 h-24 bg-linear-to-br from-slate-50 to-blue-50 rounded-full mb-4 text-blue-600 ring-1 ring-blue-100">
                                                <Truck size={40} className="transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <h4 className="mb-2 min-h-12 text-center text-sm font-bold leading-snug text-gray-900">
                                                {truck.name}
                                            </h4>
                                            <p className="mb-4 min-h-[60px] text-center text-xs leading-relaxed text-gray-500">
                                                {truck.description || 'Descripción no disponible por ahora.'}
                                            </p>
                                            <div className="mb-5 inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-gray-800">
                                                {truck.price || 'Precio por definir'}
                                            </div>
                                            <div className="flex w-full gap-2 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs px-2"
                                                    onClick={() => addTruckToCart(truck.id, truck.name, 'alquilar', truck.price, truck.description)}
                                                >
                                                    Alquilar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2"
                                                    onClick={() => addTruckToCart(truck.id, truck.name, 'comprar', truck.price, truck.description)}
                                                >
                                                    Comprar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panel Derecho: Carrito de Selección */}
                            <div className="lg:col-span-5 flex flex-col h-full border-l border-gray-200 lg:pl-8 mt-8 lg:mt-0">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShoppingCart className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">Selección del catálogo</h3>
                                    <span className="ml-auto bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {selectedTrucks.length}
                                    </span>
                                </div>

                                {selectedTrucks.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                                        <Truck size={48} className="mb-4 opacity-20" />
                                        <p>No hay camiones seleccionados</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedTrucks.map(item => (
                                            <div key={item.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative animate-in fade-in">
                                                <button
                                                    onClick={() => removeTruck(item.id)}
                                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <h4 className="font-bold text-gray-800 text-sm w-10/12 uppercase">{item.name}</h4>

                                                <div className="mt-2 space-y-2 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <span className="w-20 font-medium">Intención:</span>
                                                        <span className="capitalize bg-white px-2 py-0.5 rounded text-xs border border-gray-200">
                                                            {item.intent}
                                                        </span>
                                                    </div>

                                                    {item.intent === 'alquilar' && (
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="w-20 font-medium">Días:</span>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={item.days}
                                                                    onChange={(e) => updateTruckDays(item.id, e.target.value)}
                                                                    className="h-7 w-24 text-center text-xs pl-8 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center text-gray-600">
                                                        <span className="w-20 font-medium">Cantidad:</span>
                                                        <div className="flex items-center bg-white rounded border border-gray-200">
                                                            <button
                                                                className="px-2 py-1 hover:bg-gray-100 rounded-l transition-colors"
                                                                onClick={() => updateTruckQuantity(item.id, -1)}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="px-3 font-semibold text-sm w-8 text-center bg-gray-50 border-x border-gray-100">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="px-2 py-1 hover:bg-gray-100 rounded-r transition-colors"
                                                                onClick={() => updateTruckQuantity(item.id, 1)}
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
                )}

                {currentStep === 7 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Preferencias Finales
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Completa las observaciones para finalizar la solicitud.
                        </p>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Observaciones generales
                            </label>
                            <Textarea
                                value={preferencesData.generalObservations}
                                onChange={(e) => setPreferencesData((prev) => ({ ...prev, generalObservations: e.target.value }))}
                                placeholder="Escribe cualquier comentario general"
                                className="min-h-24"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Observaciones de su elección
                            </label>
                            <Textarea
                                value={preferencesData.selectionObservations}
                                onChange={(e) => setPreferencesData((prev) => ({ ...prev, selectionObservations: e.target.value }))}
                                placeholder="Detalles sobre servicios o camiones seleccionados"
                                className="min-h-24"
                            />
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-between pt-6 border-t border-gray-200 mt-10">
                    <Button
                        variant="outline"
                        className="px-6 py-2 rounded-lg"
                        onClick={() => {
                            if (currentStep > 1) {
                                setCurrentStep((prev) => (prev - 1) as typeof currentStep);
                            }
                        }}
                        disabled={currentStep === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        disabled={(currentStep === 1 && !clientType) || isProcessing}
                        onClick={async () => {
                            if (isProcessing) return;
                            setIsProcessing(true);
                            try {
                                // Step 1 -> just advance when clientType selected
                                if (currentStep === 1 && clientType) { setCurrentStep(2); setIsProcessing(false); return; }

                                // Step 2 -> crear cliente (perfil se guardará y se creará en el paso de contacto)
                                if (currentStep === 2) {
                                    const clientData = (formData as unknown) as PostClientDTO;
                                    const newClientId = await handleSubmitClient(clientData);
                                    if (newClientId || formData.DNI_O_RUC) { setCurrentStep(3); }
                                    else { alert('Error creando cliente'); }
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 3 -> crear contacto del cliente (antes se creará el perfil si existe payload)
                                if (currentStep === 3) {
                                    const clientIdentifier = createdClientId ?? Number(formData.DNI_O_RUC);
                                    if (!clientIdentifier || Number.isNaN(clientIdentifier)) { alert('Client ID no disponible. Crea el cliente primero.'); setIsProcessing(false); return; }
                                    const perfilDataPayload: PostClientPerfilDTO = {
                                        DNI: perfilData.DNI,
                                        Nombre: perfilData.Nombre,
                                        Apellido: perfilData.Apellido,
                                        correo_contacto: perfilData.correo_contacto,
                                        telefono_contacto: perfilData.telefono_contacto,
                                        Genero: perfilData.Genero || null,
                                        RUC: clientType === 'jurídica' ? formData.DNI_O_RUC : null,
                                        fecha_nacimiento: null,
                                        estado_civil: null,
                                        distrito_residencia: null,
                                        seguro_vida_ley: null,
                                        aficiones: null,
                                        experiencia: null,
                                        comentarios: null,
                                        estado: null,
                                        alergias: null,
                                        condicion_medica: null,
                                        profesion: null,
                                        nro_cta_bancaria: null,
                                        cv: null,
                                        foto_perfil: null,
                                    };
                                    const contactDataPayload: PostClientContactDTO = {
                                        DNI_perfil: contactData.DNI_perfil || perfilData.DNI,
                                        cargo_en_empresa: contactData.cargo_en_empresa,
                                        lugar_trabajo: contactData.lugar_trabajo,
                                    };
                                    setPerfilPayload(perfilDataPayload);
                                    await handleSubmitClientContact(clientIdentifier, contactDataPayload, perfilDataPayload);
                                    setCurrentStep(4);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 4 -> crear solicitud
                                if (currentStep === 4) {
                                    const requestData = (serviceData as unknown) as PostRequestDTO;
                                    const newRequestId = await handleCreateRequest(requestData);
                                    if (newRequestId) { setCreatedRequestId(newRequestId); }
                                    setCurrentStep(5);
                                    return;
                                }

                                // Step 5 -> crear inventario asociado a la solicitud
                                if (currentStep === 5) {
                                    // if (!createdRequestId) { alert('Request ID no disponible. Crea la solicitud primero.'); setIsProcessing(false); return; }
                                    const inventoryData = {} as PostRequestInventoryDTO;
                                    await handleSubmitRequestInventory(createdRequestId, inventoryData);
                                    setCurrentStep(6);
                                    return;
                                }

                                // Step 6 -> crear servicios (camiones u otros)
                                if (currentStep === 6) {
                                    // if (!createdRequestId) { alert('Request ID no disponible. Crea la solicitud primero.'); setIsProcessing(false); return; }
                                    const svcData = (serviceData as unknown) as PostRequestServiceDTO;
                                    await handleCreateRequestService(createdRequestId, svcData);
                                    setCurrentStep(7);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 7 -> actualizar solicitud final
                                if (currentStep === 7) {
                                    if (!createdRequestId) { alert('Request ID no disponible.'); setIsProcessing(false); return; }
                                    const updateData = (preferencesData as unknown) as UpdateRequestDTO;
                                    await handleUpdateRequest(createdRequestId, updateData);
                                    navigate('/intranet/solicitudes/mis-solicitudes', { replace: true });
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Ocurrió un error. Revisa la consola.');
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        className={`px-8 py-2 rounded-lg font-semibold transition-all ${(currentStep === 1 && !clientType)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            }`}
                    >
                        {currentStep === 7 ? (isProcessing ? 'Enviando...' : 'Enviar Solicitud') : (isProcessing ? 'Procesando...' : 'Siguiente')}
                    </Button>
                </div>
            </div>

            {/* Minimal styles for animations & scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            `}</style>
        </div>
    );
};