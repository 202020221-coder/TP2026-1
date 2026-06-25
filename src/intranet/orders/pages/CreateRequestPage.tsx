import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from "@/shared/components/ui/button";
import { useDataFetching } from '../hooks/useDataFetching';
import { usePrefillUserData } from '../hooks/usePrefillUserData';
import { usePublicServicesSelection } from '../hooks/usePublicServicesSelection';
import {
    CreateClient,
    CreateClientContact,
    CreateClientPerfil,
    CreateRequest,
} from '../api';
import {
    StepCatalogSelection,
    StepClientData,
    StepClientType,
    StepPreferences,
    StepRequesterData,
    StepServiceData,
    StepServicesSelection,
} from '../components/create';
import type {
    PostClientContactDTO,
    PostClientDTO,
    PostClientPerfilDTO,
    PostRequestDTO,
    ClientFormData,
    ClientOption,
    ContactFormData,
    PerfilFormData,
    PreferencesData,
    SelectedProduct,
    SelectedTruck,
    ServiceFormData,
} from '../interfaces';
import type { AxiosError } from 'axios';
import {
    buildSolicitudInventarioPayload,
    buildSolicitudServiciosPayload,
    findCatalogServiceByName,
    resolvePrincipalServiceId,
} from '../lib/order-service.utils';

const extractApiErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<{ error?: string }>;
    return axiosError.response?.data?.error ?? 'Error desconocido';
};

const buildSelectedServicesDetails = (services: SelectedTruck[]) =>
    services
        .map((service, index) =>
            [
                `Servicio ${index + 1}: ${service.name}`,
                `Dirección del lugar: ${service.direccionLugar.trim()}`,
                `Observaciones de su elección: ${service.observacionesEleccion.trim()}`,
            ].join('\n'),
        )
        .join('\n---\n');

export function CreateRequestPage() {
    const navigate = useNavigate();
    const [clientType, setClientType] = useState<'jurídica' | 'física' | null>(null);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
    const [createdClientId, setCreatedClientId] = useState<number | null>(null);
    const [createdRequestId, setCreatedRequestId] = useState<number | null>(null);
    const [clientAlreadyExists, setClientAlreadyExists] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [perfilPayload, setPerfilPayload] = useState<PostClientPerfilDTO | null>(null);


    const { products, loading, error } = useDataFetching();
    const {
        serviceOptions,
        isLoading: loadingPublicServices,
    } = usePublicServicesSelection();

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
            alert(`No se pudo crear la solicitud: ${extractApiErrorMessage(error)}`);
            return null;
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
    const [principalServiceId, setPrincipalServiceId] = useState<number | null>(null);

    const [preferencesData, setPreferencesData] = useState<PreferencesData>({
        generalObservations: '',
        selectionObservations: '',
    });

    // Autocompletado de datos del cliente/solicitante según el usuario logueado.
    usePrefillUserData(setFormData, setPerfilData, setContactData, setClientAlreadyExists);

    // Autocompletado desde la landing ("Solicitar" en Nuestros Servicios).
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const desc = searchParams.get('desc');
        const obs = searchParams.get('obs');
        const subs = searchParams.get('subs');
        const servicioId = searchParams.get('servicioId');
        if (desc) {
            setServiceData((prev) => ({ ...prev, descripcion: desc }));
        }
        if (obs) {
            setPreferencesData((prev) => ({ ...prev, generalObservations: obs }));
        }
        if (servicioId) {
            const parsedId = Number(servicioId);
            if (!Number.isNaN(parsedId) && parsedId > 0) {
                setPrincipalServiceId(parsedId);
            }
        }
        // Auto-añade los subservicios predeterminados del servicio (pestaña 6).
        if (subs) {
            try {
                const parsed = JSON.parse(subs) as { id: number; nombre: string }[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSelectedTrucks((prev) => {
                        const next = [...prev];
                        parsed.forEach((sub, index) => {
                            const serviceId = Number(sub?.id);
                            if (!serviceId || next.some((t) => t.serviceId === serviceId)) return;
                            next.push({
                                id: `service-${serviceId}-${Date.now()}-${index}`,
                                serviceId,
                                truckId: `service-${serviceId}`,
                                name: sub.nombre,
                                direccionLugar: '',
                                observacionesEleccion: '',
                            });
                        });
                        return next;
                    });
                }
            } catch {
                // Parámetro inválido: se ignora.
            }
        }
        // Solo al entrar con parámetros de prefill.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const steps = [
        { id: 1, label: 'Tipo de Cliente' },
        { id: 2, label: 'Datos del Cliente' },
        { id: 3, label: 'Solicitante' },
        { id: 4, label: 'Datos del Servicio' },
        { id: 5, label: 'Selección de Catálogo' },
        { id: 6, label: 'Sub Servicios' },
        { id: 7, label: 'Preferencias' },
    ];

    const addTruckToCart = (serviceId: number, name: string, price?: number | string, description?: string) => {
        // Evita duplicar el mismo servicio en el carrito.
        setSelectedTrucks((prev) => {
            const alreadyExists = prev.some((truck) => truck.serviceId === serviceId);
            if (alreadyExists) return prev;

        const newItem: SelectedTruck = {
                id: `service-${serviceId}-${Date.now()}`,
                serviceId,
                truckId: `service-${serviceId}`,
            name,
            description,
            price,
                direccionLugar: '',
                observacionesEleccion: '',
        };
            return [...prev, newItem];
        });
    };

    const updateTruckDireccion = (id: string, direccion: string) => {
        setSelectedTrucks((prev) => prev.map(truck => {
            if (truck.id === id) {
                return { ...truck, direccionLugar: direccion };
            }
            return truck;
        }));
    };

    const updateTruckObservaciones = (id: string, observaciones: string) => {
        setSelectedTrucks((prev) => prev.map(truck => {
            if (truck.id === id) {
                return { ...truck, observacionesEleccion: observaciones };
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
        <div className="min-h-full p-8">
            <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xs border p-8">

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
                        <p className="text-sm text-yellow-800">Cargando catálogo...</p>
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
                    <StepServicesSelection
                        serviceOptions={serviceOptions}
                        selectedServices={selectedTrucks}
                        isLoading={loadingPublicServices}
                        onAddService={addTruckToCart}
                        onUpdateServiceDireccion={updateTruckDireccion}
                        onUpdateServiceObservaciones={updateTruckObservaciones}
                        onRemoveService={removeTruck}
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
                                    // Si el cliente/empresa ya existe (autocompletado), no se recrea.
                                    if (clientAlreadyExists) {
                                        setCreatedClientId(Number(formData.DNI_O_RUC) || null);
                                        setCurrentStep(3);
                                        setIsProcessing(false);
                                        return;
                                    }
                                    const clientData = (formData as unknown) as PostClientDTO;
                                    const newClientId = await handleSubmitClient(clientData);
                                    if (newClientId || formData.DNI_O_RUC) { setCurrentStep(3); }
                                    else { alert('Error creando cliente'); }
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 3 -> crear contacto del cliente (antes se creará el perfil si existe payload)
                                if (currentStep === 3) {
                                    // Si el cliente/perfil ya existe (autocompletado), no se recrea.
                                    if (clientAlreadyExists) {
                                        setCurrentStep(4);
                                        setIsProcessing(false);
                                        return;
                                    }
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

                                // Step 4 -> autocompletar la dirección de los servicios
                                // con la del servicio principal y avanzar.
                                if (currentStep === 4) {
                                    const direccionPrincipal = serviceData.ubicacion.trim();
                                    if (direccionPrincipal) {
                                        setSelectedTrucks((prev) =>
                                            prev.map((truck) =>
                                                truck.direccionLugar.trim()
                                                    ? truck
                                                    : { ...truck, direccionLugar: direccionPrincipal },
                                            ),
                                        );
                                    }
                                    setCurrentStep(5);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 5 -> solo avanzar (selección de catálogo)
                                if (currentStep === 5) {
                                    setCurrentStep(6);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 6 -> validar servicios y avanzar (aún no se crea nada)
                                if (currentStep === 6) {
                                    if (selectedTrucks.length === 0) {
                                        alert('Debes agregar al menos un sub servicio.');
                                        setIsProcessing(false);
                                        return;
                                    }

                                    const missingRequiredFields = selectedTrucks.some(
                                        (service) =>
                                            service.direccionLugar.trim().length === 0,
                                    );

                                    if (missingRequiredFields) {
                                        alert('Completa Dirección del lugar para todos los sub servicios agregados.');
                                        setIsProcessing(false);
                                        return;
                                    }

                                    setCurrentStep(7);
                                    setIsProcessing(false);
                                    return;
                                }

                                // Step 7 -> crear la solicitud completa en un solo envío
                                if (currentStep === 7) {
                                    // Evita duplicar si ya se creó en un intento anterior.
                                    if (createdRequestId) {
                                        navigate('/intranet/solicitudes', { replace: true });
                                        return;
                                    }

                                    const selectedServiceNames = selectedTrucks.map((s) => s.name).join(', ');
                                    const serviceSelectionDetails = buildSelectedServicesDetails(selectedTrucks);
                                    const finalSelectionObservations = [
                                        serviceSelectionDetails,
                                        preferencesData.selectionObservations.trim()
                                            ? `Observación final: ${preferencesData.selectionObservations.trim()}`
                                            : '',
                                    ].filter(Boolean).join('\n---\n');

                                    const resolvedPrincipalId = await resolvePrincipalServiceId(
                                        serviceData.descripcion,
                                        principalServiceId,
                                    );

                                    if (!resolvedPrincipalId) {
                                        alert(
                                            'No se pudo identificar el servicio principal. Use el formato "Solicito el servicio: ..." en la descripción o ingrese desde la página de servicios.',
                                        );
                                        setIsProcessing(false);
                                        return;
                                    }

                                    let descripcionFinal = serviceData.descripcion.trim();
                                    if (!/^Solicito el servicio:/i.test(descripcionFinal)) {
                                        const principalCatalog =
                                            await findCatalogServiceByName(
                                                descripcionFinal.split('\n')[0] ?? '',
                                            );
                                        if (principalCatalog) {
                                            descripcionFinal =
                                                `Solicito el servicio: ${principalCatalog.nombre}.\n\n${descripcionFinal}`.trim();
                                        }
                                    }

                                    const solicitudServicios = await buildSolicitudServiciosPayload(
                                        resolvedPrincipalId,
                                        selectedTrucks.map((service) => ({
                                            serviceId: service.serviceId,
                                            name: service.name,
                                            observacionesEleccion: service.observacionesEleccion,
                                        })),
                                    );

                                    const inventarioPayload = buildSolicitudInventarioPayload(
                                        selectedProducts.map((p) => ({
                                            productId: p.productId,
                                            intent: p.intent,
                                            quantity: p.quantity,
                                            days: p.days,
                                        })),
                                    );

                                    const requestData: PostRequestDTO = {
                                        Id_Cliente: serviceData.Id_Cliente || formData.DNI_O_RUC,
                                        descripcion: descripcionFinal,
                                        ubicacion: serviceData.ubicacion,
                                        productoenvio: serviceData.productoenvio || null,
                                        camionesenvio: selectedServiceNames || null,
                                        obsgenerales: preferencesData.generalObservations || null,
                                        obseleccion: finalSelectionObservations || null,
                                        ...solicitudServicios,
                                        ...(inventarioPayload.length > 0
                                            ? { inventario: inventarioPayload }
                                            : {}),
                                    };

                                    const newRequestId = await handleCreateRequest(requestData);
                                    if (!newRequestId) {
                                        setIsProcessing(false);
                                        return;
                                    }
                                    setCreatedRequestId(newRequestId);

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