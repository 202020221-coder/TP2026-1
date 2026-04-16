import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
    message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;

    return (
        <div className="flex items-center gap-2 mt-1.5 py-1 px-2 rounded bg-red-50">
            <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <p className="text-xs font-medium text-red-600">{message}</p>
        </div>
    );
}
