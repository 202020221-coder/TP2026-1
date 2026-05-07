import type { ClientOption, ClientType } from './types';

interface StepClientTypeProps {
    clientType: ClientType | null;
    clientOptions: ClientOption[];
    onClientTypeChange: (value: ClientType) => void;
}

export function StepClientType({
    clientType,
    clientOptions,
    onClientTypeChange,
}: StepClientTypeProps) {
    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-800">
                Selecciona el Tipo de Cliente
            </h3>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
                {clientOptions.map((option) => (
                    <label
                        key={option.id}
                        className={`relative flex cursor-pointer items-center rounded-xl border-2 p-6 transition-all duration-200 ${clientType === option.id
                                ? 'scale-[1.02] border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                            }`}
                    >
                        <input
                            type="radio"
                            name="clientType"
                            value={option.id}
                            checked={clientType === option.id}
                            onChange={(e) => onClientTypeChange(e.target.value as ClientType)}
                            className="h-5 w-5 cursor-pointer text-blue-500 accent-blue-500"
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
    );
}
