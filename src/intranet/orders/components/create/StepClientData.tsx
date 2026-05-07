import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { ClientFormData, ClientType } from './types';

interface StepClientDataProps {
    clientType: ClientType;
    formData: ClientFormData;
    onFormDataChange: (field: keyof ClientFormData, value: string) => void;
}

export function StepClientData({
    clientType,
    formData,
    onFormDataChange,
}: StepClientDataProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="mb-1 text-xl font-semibold text-gray-800">Datos de la Empresa</h3>
            <p className="mb-6 text-sm text-gray-500">
                Completa la informacion requerida para continuar.
            </p>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">RUC</label>
                    <Input
                        value={formData.DNI_O_RUC}
                        onChange={(e) => onFormDataChange('DNI_O_RUC', e.target.value)}
                        placeholder={clientType === 'jurídica' ? 'Ej: 20512345678' : 'Ej: 74157562'}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nombre Comercial
                    </label>
                    <Input
                        value={formData.nombre_comercial}
                        onChange={(e) => onFormDataChange('nombre_comercial', e.target.value)}
                        placeholder="Ej: Transportes del Norte"
                        disabled={clientType === 'jurídica'}
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Razon Social</label>
                    <Input
                        value={formData.razon_social}
                        onChange={(e) => onFormDataChange('razon_social', e.target.value)}
                        placeholder={clientType === 'jurídica' ? 'Ej: 20123456789' : 'Ej: 12345678'}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Rubro</label>
                    <Input
                        value={formData.rubro}
                        onChange={(e) => onFormDataChange('rubro', e.target.value)}
                        placeholder="Ej: Transporte de carga"
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Ubicación de Facturación
                    </label>
                    <Input
                        value={formData.ubicacion_facturacion}
                        onChange={(e) => onFormDataChange('ubicacion_facturacion', e.target.value)}
                        placeholder="Ej: Surco, Lima"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Observación</label>
                    <Textarea
                        value={formData.observacion}
                        onChange={(e) => onFormDataChange('observacion', e.target.value)}
                        placeholder="Observaciones adicionales sobre el cliente (opcional)"
                        className="min-h-9"
                    />
                </div>
            </div>
        </div>
    );
}
