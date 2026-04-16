'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";


export function CreateRequestPage() {
    const navigate = useNavigate();
    const [clientType, setClientType] = useState<'jurídica' | 'física' | null>(null);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

    const [formData, setFormData] = useState({
        nameOrBusinessName: '',
        lastName: '',
        documentNumber: '',
        email: '',
        phone: '',
        address: '',
    });
    const [requesterData, setRequesterData] = useState({
        name: '',
        lastName: '',
        dni: '',
        email: '',
        phone: '',
        workAddress: '',
        position: '',
    });
    const [serviceData, setServiceData] = useState({
        serviceDescription: '',
        serviceAddress: '',
        projectStartDate: '',
        projectEndDate: '',
        hoursPerDay: '',
    });
    const [selectedCatalogItems, setSelectedCatalogItems] = useState<string[]>([]);
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

    const catalogOptions = [
        {
            id: 'montacarga',
            name: 'Alquiler de Montacarga',
            detail: 'Incluye operador certificado y mantenimiento basico.',
        },
        {
            id: 'camion-grua',
            name: 'Servicio de Camion Grua',
            detail: 'Traslado y maniobra de equipos pesados en obra.',
        },
        {
            id: 'transporte-carga',
            name: 'Transporte de Carga',
            detail: 'Movilizacion de materiales y equipos a nivel local.',
        },
        {
            id: 'operador-extra',
            name: 'Operador Adicional',
            detail: 'Personal de apoyo para turnos extendidos.',
        },
    ];

    const toggleCatalogItem = (itemId: string) => {
        setSelectedCatalogItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Solicitud</h1>
                    <p className="text-gray-500">
                        {currentStep === 1 && 'Selecciona el tipo de cliente para continuar'}
                        {currentStep === 2 && 'Completa los datos del cliente o empresa'}
                        {currentStep === 3 && 'Completa los datos del solicitante del servicio'}
                        {currentStep === 4 && 'Completa los datos del servicio'}
                        {currentStep === 5 && 'Selecciona servicios del catalogo'}
                        {currentStep === 6 && 'Agrega tus preferencias y observaciones finales'}
                    </p>
                </div>

                {/* Client Type Selection */}
                {currentStep === 1 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Tipo de Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clientOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${clientType === option.id
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
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
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Datos del {clientType === 'jurídica' ? 'Empresa' : 'Cliente'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Completa la informacion requerida para continuar.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    {clientType === 'jurídica' ? 'Razon Social' : 'Nombre'}
                                </label>
                                <Input
                                    value={formData.nameOrBusinessName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, nameOrBusinessName: e.target.value }))}
                                    placeholder={clientType === 'jurídica' ? 'Ej: Transportes del Norte S.A.' : 'Ej: Juan'}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Ej: Perez"
                                    disabled={clientType === 'jurídica'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    {clientType === 'jurídica' ? 'RUC' : 'DNI'}
                                </label>
                                <Input
                                    value={formData.documentNumber}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, documentNumber: e.target.value }))}
                                    placeholder={clientType === 'jurídica' ? 'Ej: 20123456789' : 'Ej: 12345678'}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="correo@dominio.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Telefono
                                </label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Ej: 987654321"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Direccion
                                </label>
                                <Textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                    placeholder="Calle, numero, distrito"
                                    className="min-h-9"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6">
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
                                    value={requesterData.name}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ej: Maria"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <Input
                                    value={requesterData.lastName}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, lastName: e.target.value }))}
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
                                    value={requesterData.dni}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, dni: e.target.value }))}
                                    placeholder="Ej: 12345678"
                                    maxLength={8}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    value={requesterData.email}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="correo@dominio.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Telefono / Celular
                                </label>
                                <Input
                                    value={requesterData.phone}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Ej: 987654321"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Cargo
                                </label>
                                <Input
                                    value={requesterData.position}
                                    onChange={(e) => setRequesterData((prev) => ({ ...prev, position: e.target.value }))}
                                    placeholder="Ej: Jefe de Operaciones"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Direccion de Trabajo
                            </label>
                            <Textarea
                                value={requesterData.workAddress}
                                onChange={(e) => setRequesterData((prev) => ({ ...prev, workAddress: e.target.value }))}
                                placeholder="Calle, numero, distrito"
                                className="min-h-20"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6">
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
                                value={serviceData.serviceDescription}
                                onChange={(e) => setServiceData((prev) => ({ ...prev, serviceDescription: e.target.value }))}
                                placeholder="Describe el servicio requerido (minimo 20 caracteres)"
                                className="min-h-24"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Direccion del lugar
                            </label>
                            <Textarea
                                value={serviceData.serviceAddress}
                                onChange={(e) => setServiceData((prev) => ({ ...prev, serviceAddress: e.target.value }))}
                                placeholder="Calle, numero, distrito"
                                className="min-h-20"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Fecha inicio proyecto
                                </label>
                                <Input
                                    type="date"
                                    value={serviceData.projectStartDate}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, projectStartDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Fecha fin proyecto
                                </label>
                                <Input
                                    type="date"
                                    value={serviceData.projectEndDate}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, projectEndDate: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Horas por dia trabajado (Opcional)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={24}
                                value={serviceData.hoursPerDay}
                                onChange={(e) => setServiceData((prev) => ({ ...prev, hoursPerDay: e.target.value }))}
                                placeholder="Ej: 8"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Seleccion de Catalogo
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Elige uno o varios servicios del catalogo para incluir en la solicitud.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {catalogOptions.map((item) => {
                                const isSelected = selectedCatalogItems.includes(item.id);

                                return (
                                    <label
                                        key={item.id}
                                        className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleCatalogItem(item.id)}
                                                className="mt-1 h-4 w-4 accent-blue-500"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.detail}</p>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Preferencias
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
                                Observaciones de su eleccion
                            </label>
                            <Textarea
                                value={preferencesData.selectionObservations}
                                onChange={(e) => setPreferencesData((prev) => ({ ...prev, selectionObservations: e.target.value }))}
                                placeholder="Detalles sobre servicios seleccionados o preferencias"
                                className="min-h-24"
                            />
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        className="px-6 py-2 rounded-lg"
                        onClick={() => {
                            if (currentStep > 1) {
                                setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
                            }
                        }}
                        disabled={currentStep === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        disabled={currentStep === 1 && !clientType}
                        onClick={() => {
                            if (currentStep === 1 && clientType) {
                                setCurrentStep(2);
                                return;
                            }

                            if (currentStep === 2) {
                                setCurrentStep(3);
                                return;
                            }

                            if (currentStep === 3) {
                                setCurrentStep(4);
                                return;
                            }

                            if (currentStep === 4) {
                                setCurrentStep(5);
                                return;
                            }

                            if (currentStep === 5) {
                                setCurrentStep(6);
                                return;
                            }

                            if (currentStep === 6) {
                                // Aquí iría la lógica de envío de la solicitud
                                console.log('Solicitud lista para enviar', {
                                    clientType,
                                    formData,
                                    requesterData,
                                    serviceData,
                                    selectedCatalogItems,
                                    preferencesData,
                                });
                                navigate('/intranet/solicitudes/', { replace: true });
                            }
                        }}
                        className={`px-8 py-2 rounded-lg font-semibold transition-all ${(currentStep === 1 && !clientType)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                            }`}
                    >
                        {currentStep === 6 ? 'Enviar Solicitud' : 'Siguiente'}
                    </Button>
                </div>
            </div>
        </div>
    );
};