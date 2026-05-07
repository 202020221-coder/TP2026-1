import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/shared/components/ui/button";
import { useDataFetching } from '../hooks/useDataFetching';
import {
    CreateClient,
    CreateClientContact,
    CreateClientPerfil,
    CreateRequest,
    CreateRequestInventory,
    CreateRequestService,
    UpdateRequest,
} from '../api';
import {
    StepCatalogSelection,
    StepClientData,
    StepClientType,
    StepPreferences,
    StepRequesterData,
    StepServiceData,
    StepTruckSelection,
} from '../components/create';
import type {
    PostClientContactDTO,
    PostClientDTO,
    PostClientPerfilDTO,
    PostRequestDTO,
    PostRequestInventoryDTO,
    PostRequestServiceDTO,
    UpdateRequestDTO,
    ClientFormData,
    ClientOption,
    ContactFormData,
    PerfilFormData,
    PreferencesData,
    SelectedProduct,
    SelectedTruck,
    ServiceFormData,
    TruckOption,
} from '../interfaces';

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

            const requestId = requestResponse.ID ?? requestResponse.id ?? null;
            if (requestId) {
                setCreatedRequestId(requestId);
            }

            return requestId;
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
    const [formData, setFormData] = useState<ClientFormData>({
        DNI_O_RUC: '',
        nombre_comercial: '',
        razon_social: '',
        rubro: '',
        ubicacion_facturacion: '',
        observacion: '',
    });
    const [perfilData, setPerfilData] = useState<PerfilFormData>({
        DNI: '',
        Nombre: '',
        Apellido: '',
        Genero: '',
        correo_contacto: '',
        telefono_contacto: '',
    });
    const [contactData, setContactData] = useState<ContactFormData>({
        DNI_perfil: '',
        cargo_en_empresa: '',
        lugar_trabajo: '',
    });
    const [serviceData, setServiceData] = useState<ServiceFormData>({
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
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    const [selectedTrucks, setSelectedTrucks] = useState<SelectedTruck[]>([]);

    const [preferencesData, setPreferencesData] = useState<PreferencesData>({
        generalObservations: '',
        selectionObservations: '',
    });

    const clientOptions: ClientOption[] = [
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

    const truckOptions: TruckOption[] = (services ?? []).map((s) => {
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

    const handleFormDataChange = (field: keyof ClientFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePerfilDataChange = (field: keyof PerfilFormData, value: string) => {
        setPerfilData((prev) => ({ ...prev, [field]: value }));
    };

    const handleContactDataChange = (field: keyof ContactFormData, value: string) => {
        setContactData((prev) => ({ ...prev, [field]: value }));
    };

    const handleServiceDataChange = (field: keyof ServiceFormData, value: string) => {
        setServiceData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePreferencesDataChange = (field: keyof PreferencesData, value: string) => {
        setPreferencesData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDniChange = (dni: string) => {
        setPerfilData((prev) => ({ ...prev, DNI: dni }));
        setContactData((prev) => ({ ...prev, DNI_perfil: dni }));
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

                {currentStep === 1 && (
                    <StepClientType
                        clientType={clientType}
                        clientOptions={clientOptions}
                        onClientTypeChange={setClientType}
                    />
                )}

                {currentStep === 2 && clientType && (
                    <StepClientData
                        clientType={clientType}
                        formData={formData}
                        onFormDataChange={handleFormDataChange}
                    />
                )}

                {currentStep === 3 && (
                    <StepRequesterData
                        perfilData={perfilData}
                        contactData={contactData}
                        onPerfilDataChange={handlePerfilDataChange}
                        onContactDataChange={handleContactDataChange}
                        onDniChange={handleDniChange}
                    />
                )}

                {currentStep === 4 && (
                    <StepServiceData
                        serviceData={serviceData}
                        onServiceDataChange={handleServiceDataChange}
                    />
                )}

                {currentStep === 5 && (
                    <StepCatalogSelection
                        catalogOptions={catalogOptions}
                        selectedProducts={selectedProducts}
                        onAddProduct={addProductToCart}
                        onUpdateProductDays={updateProductDays}
                        onUpdateProductQuantity={updateProductQuantity}
                        onRemoveProduct={removeProduct}
                    />
                )}

                {currentStep === 6 && (
                    <StepTruckSelection
                        truckOptions={truckOptions}
                        selectedTrucks={selectedTrucks}
                        onAddTruck={addTruckToCart}
                        onUpdateTruckDays={updateTruckDays}
                        onUpdateTruckQuantity={updateTruckQuantity}
                        onRemoveTruck={removeTruck}
                    />
                )}

                {currentStep === 7 && (
                    <StepPreferences
                        preferencesData={preferencesData}
                        onPreferencesChange={handlePreferencesDataChange}
                    />
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
                                    if (!createdRequestId) { alert('Request ID no disponible. Crea la solicitud primero.'); setIsProcessing(false); return; }
                                    const requestId = createdRequestId;
                                    const inventoryData = {} as PostRequestInventoryDTO;
                                    await handleSubmitRequestInventory(requestId, inventoryData);
                                    setCurrentStep(6);
                                    return;
                                }

                                // Step 6 -> crear servicios (camiones u otros)
                                if (currentStep === 6) {
                                    if (!createdRequestId) { alert('Request ID no disponible. Crea la solicitud primero.'); setIsProcessing(false); return; }
                                    const requestId = createdRequestId;
                                    const svcData = (serviceData as unknown) as PostRequestServiceDTO;
                                    await handleCreateRequestService(requestId, svcData);
                                    setCurrentStep(7);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 7 -> actualizar solicitud final
                                if (currentStep === 7) {
                                    if (!createdRequestId) { alert('Request ID no disponible.'); setIsProcessing(false); return; }
                                    const requestId = createdRequestId;
                                    const updateData: UpdateRequestDTO = {
                                        Id_Cliente: serviceData.Id_Cliente,
                                        descripcion: serviceData.descripcion,
                                        ubicacion: serviceData.ubicacion,
                                        productoenvio: serviceData.productoenvio,
                                        camionesenvio: serviceData.camionesenvio,
                                        obsgenerales: preferencesData.generalObservations,
                                        obseleccion: preferencesData.selectionObservations,
                                    };
                                    await handleUpdateRequest(requestId, updateData);
                                    navigate('/intranet/solicitudes', { replace: true });
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