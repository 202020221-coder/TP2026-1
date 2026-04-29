'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Truck, ShoppingCart, Trash2, Plus, Minus, Calendar } from "lucide-react";
import type { GetProductDTO, GetServiceDTO } from '../interfaces/read-service-producs.dto';
import { useDataFetching } from '../hooks/useDataRequest';

export function CreateRequestPage() {
    const navigate = useNavigate();
    const [clientType, setClientType] = useState<'jurídica' | 'física' | null>(null);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
    
    const { products, services, loading, error } = useDataFetching();
      
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
        truckId: string;
        name: string;
        intent: 'alquilar' | 'comprar';
        days?: number;
        quantity: number;
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

    const catalogOptions = [
        { id: 'acidzorb', category: 'ABSORVENTES DE ÁCIDOS E HIDROCARBUROS', name: 'ACIDZORB' },
        { id: 'cf-campanas', category: 'EQUIPOS DE DETECCIÓN', name: 'CAMPANAS DE ALARMA CONTRA INCENDIO' },
        { id: 'cf-humo', category: 'EQUIPOS DE DETECCIÓN', name: 'DETECTORES DE HUMO' },
        { id: 'cf-temp', category: 'EQUIPOS DE DETECCIÓN', name: 'DETECTORES DE TEMPERATURA' },
        { id: 'dualzorb', category: 'SIN CATEGORIZAR', name: 'DUALZORB' },
        { id: 'boquillas-hf500', category: 'BOQUILLAS', name: 'ELKHART BRASS HF-500' },
    ];

    // const addProductToCart = (productId: string, name: string, intent: 'alquilar' | 'comprar', category?: string) => {
    //     const newItem: SelectedProduct = {
    //         id: `${productId}-${Date.now()}`,
    //         productId,
    //         name,
    //         category,
    //         intent,
    //         quantity: 1,
    //         days: intent === 'alquilar' ? 1 : undefined,
    //     };
    //     setSelectedProducts((prev) => [...prev, newItem]);
    // };

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

    const truckOptions = [
        { id: 'spartan', name: 'Camión SPARTAN' },
        { id: 'vw-fire', name: 'Volkswagen Bomberos' },
        { id: 'vw-cisterna', name: 'Cisterna Volkswagen' },
        { id: 'airport-fire', name: 'Airport Firetruck' },
        { id: 'industrial-fire', name: 'Industrial Firetruck' },
        { id: 'rescue-truck', name: 'Camión de Rescate' },
    ];

    const steps = [
        { id: 1, label: 'Tipo de Cliente' },
        { id: 2, label: 'Datos del Cliente' },
        { id: 3, label: 'Solicitante' },
        { id: 4, label: 'Datos del Servicio' },
        { id: 5, label: 'Selección de Catálogo' },
        { id: 6, label: 'Selección de Camiones' },
        { id: 7, label: 'Preferencias' },
    ];

    // const addTruckToCart = (truckId: string, name: string, intent: 'alquilar' | 'comprar') => {
    //     const newItem: SelectedTruck = {
    //         id: `${truckId}-${Date.now()}`,
    //         truckId,
    //         name,
    //         intent,
    //         quantity: 1,
    //         days: intent === 'alquilar' ? 1 : undefined,
    //     };
    //     setSelectedTrucks((prev) => [...prev, newItem]);
    // };

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
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 mb-2 ${
                                                isCompleted 
                                                    ? 'bg-blue-600 text-white shadow-md' 
                                                    : isActive 
                                                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' 
                                                        : 'bg-white text-gray-400 border-2 border-gray-300'
                                            }`}
                                        >
                                            {isCompleted ? '✓' : step.id}
                                        </div>
                                        <span 
                                            className={`text-[10px] sm:text-xs text-center leading-tight break-words px-1 w-full ${
                                                isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400 font-medium'
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

                {/* Client Type Selection */}
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
                                            <h4 className="font-semibold text-gray-800 text-center mb-1 min-h-[40px] text-sm">{product.name}</h4>
                                            <p className="text-[10px] text-gray-400 text-center mb-4 min-h-[30px]">{product.category}</p>
                                            <div className="flex w-full gap-2 mt-auto">
                                                {/* <Button 
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
                                                </Button> */}
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
                                        <div key={truck.id} className="border border-gray-200 rounded-xl bg-white p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-4 text-blue-500">
                                                <Truck size={40} />
                                            </div>
                                            <h4 className="font-semibold text-gray-800 text-center mb-4 min-h-[48px]">{truck.name}</h4>
                                            <div className="flex w-full gap-2 mt-auto">
                                                {/* <Button 
                                                    variant="outline" 
                                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs px-2"
                                                    onClick={() => addTruckToCart(truck.id, truck.name, 'alquilar')}
                                                >
                                                    Alquilar
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2"
                                                    onClick={() => addTruckToCart(truck.id, truck.name, 'comprar')}
                                                >
                                                    Comprar
                                                </Button> */}
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
                        disabled={currentStep === 1 && !clientType}
                        onClick={() => {
                            if (currentStep === 1 && clientType) { setCurrentStep(2); return; }
                            if (currentStep === 2) { setCurrentStep(3); return; }
                            if (currentStep === 3) { setCurrentStep(4); return; }
                            if (currentStep === 4) { setCurrentStep(5); return; }
                            if (currentStep === 5) { setCurrentStep(6); return; }
                            if (currentStep === 6) { setCurrentStep(7); return; }
                            
                            if (currentStep === 7) {
                                console.log('Solicitud lista para enviar', {
                                    clientType,
                                    formData,
                                    requesterData,
                                    serviceData,
                                    selectedProducts,
                                    selectedTrucks,
                                    preferencesData,
                                });
                                navigate('/intranet/solicitudes/mis-solicitudes', { replace: true });
                            }
                        }}
                        className={`px-8 py-2 rounded-lg font-semibold transition-all ${(currentStep === 1 && !clientType)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            }`}
                    >
                        {currentStep === 7 ? 'Enviar Solicitud' : 'Siguiente'}
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