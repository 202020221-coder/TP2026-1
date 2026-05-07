import { Textarea } from '@/shared/components/ui/textarea';
import type { ServiceFormData } from './types';

interface StepServiceDataProps {
    serviceData: ServiceFormData;
    onServiceDataChange: (field: keyof ServiceFormData, value: string) => void;
}

export function StepServiceData({
    serviceData,
    onServiceDataChange,
}: StepServiceDataProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="mb-1 text-xl font-semibold text-gray-800">Datos del Servicio</h3>
            <p className="mb-6 text-sm text-gray-500">
                Ingresa la informacion del servicio solicitado.
            </p>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Descripcion del servicio a detalle
                </label>
                <Textarea
                    value={serviceData.descripcion}
                    onChange={(e) => onServiceDataChange('descripcion', e.target.value)}
                    placeholder="Describe el servicio requerido (minimo 20 caracteres)"
                    className="min-h-24"
                />
            </div>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Direccion del lugar</label>
                <Textarea
                    value={serviceData.ubicacion}
                    onChange={(e) => onServiceDataChange('ubicacion', e.target.value)}
                    placeholder="Calle, numero, distrito"
                    className="min-h-20"
                />
            </div>
        </div>
    );
}
