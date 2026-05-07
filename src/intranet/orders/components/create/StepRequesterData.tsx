import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { ContactFormData, PerfilFormData } from './types';

interface StepRequesterDataProps {
    perfilData: PerfilFormData;
    contactData: ContactFormData;
    onPerfilDataChange: (field: keyof PerfilFormData, value: string) => void;
    onContactDataChange: (field: keyof ContactFormData, value: string) => void;
    onDniChange: (dni: string) => void;
}

export function StepRequesterData({
    perfilData,
    contactData,
    onPerfilDataChange,
    onContactDataChange,
    onDniChange,
}: StepRequesterDataProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="mb-1 text-xl font-semibold text-gray-800">
                Datos del Solicitante del Servicio
            </h3>
            <p className="mb-6 text-sm text-gray-500">
                Ingresa la informacion de la persona que solicita el servicio.
            </p>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Nombre</label>
                    <Input
                        value={perfilData.Nombre}
                        onChange={(e) => onPerfilDataChange('Nombre', e.target.value)}
                        placeholder="Ej: Maria"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Apellido</label>
                    <Input
                        value={perfilData.Apellido}
                        onChange={(e) => onPerfilDataChange('Apellido', e.target.value)}
                        placeholder="Ej: Gomez"
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">DNI</label>
                    <Input
                        value={perfilData.DNI}
                        onChange={(e) => onDniChange(e.target.value)}
                        placeholder="Ej: 12345678"
                        maxLength={8}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <Input
                        type="email"
                        value={perfilData.correo_contacto}
                        onChange={(e) => onPerfilDataChange('correo_contacto', e.target.value)}
                        placeholder="correo@dominio.com"
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Celular</label>
                    <Input
                        value={perfilData.telefono_contacto}
                        onChange={(e) => onPerfilDataChange('telefono_contacto', e.target.value)}
                        placeholder="Ej: 987654321"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Cargo</label>
                    <Input
                        value={contactData.cargo_en_empresa}
                        onChange={(e) => onContactDataChange('cargo_en_empresa', e.target.value)}
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
                    onChange={(e) => onContactDataChange('lugar_trabajo', e.target.value)}
                    placeholder="Calle, numero, distrito"
                    className="min-h-20"
                />
            </div>
        </div>
    );
}
