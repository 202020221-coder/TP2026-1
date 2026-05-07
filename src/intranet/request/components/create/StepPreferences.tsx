import { Textarea } from '@/shared/components/ui/textarea';
import type { PreferencesData } from './types';

interface StepPreferencesProps {
    preferencesData: PreferencesData;
    onPreferencesChange: (field: keyof PreferencesData, value: string) => void;
}

export function StepPreferences({
    preferencesData,
    onPreferencesChange,
}: StepPreferencesProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-slate-50/70 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="mb-1 text-xl font-semibold text-gray-800">Preferencias Finales</h3>
            <p className="mb-6 text-sm text-gray-500">
                Completa las observaciones para finalizar la solicitud.
            </p>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Observaciones generales
                </label>
                <Textarea
                    value={preferencesData.generalObservations}
                    onChange={(e) => onPreferencesChange('generalObservations', e.target.value)}
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
                    onChange={(e) => onPreferencesChange('selectionObservations', e.target.value)}
                    placeholder="Detalles sobre servicios o camiones seleccionados"
                    className="min-h-24"
                />
            </div>
        </div>
    );
}
