import { useEffect, useRef, useState, type FC } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import { getClients, type ClientEntry } from "../api/clients.api";

interface ClientAutocompleteProps {
  value: string;
  onChange: (ruc: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ClientAutocomplete: FC<ClientAutocompleteProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Buscar por RUC o razón social",
}) => {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.DNI_O_RUC === value);

  useEffect(() => {
    setFetching(true);
    setFetchError(false);
    getClients()
      .then((data) => {
        setClients(data);
        if (data.length > 0 && value) {
          const match = data.find((c) => c.DNI_O_RUC === value);
          if (match) setSearch(`${match.razon_social} (${match.DNI_O_RUC})`);
        }
      })
      .catch(() => {
        setFetchError(true);
      })
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (!value) {
      setSearch("");
    } else if (!open && selectedClient) {
      setSearch(`${selectedClient.razon_social} (${selectedClient.DNI_O_RUC})`);
    }
  }, [value, open, selectedClient]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = search.trim()
    ? clients.filter(
        (c) =>
          c.razon_social?.toLowerCase().includes(search.toLowerCase()) ||
          c.DNI_O_RUC?.includes(search),
      )
    : clients;

  const handleSelect = (ruc: string, display: string) => {
    onChange(ruc);
    setSearch(display);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
    setOpen(false);
  };

  if (disabled) {
    return (
      <Input
        value={selectedClient ? `${selectedClient.razon_social} (${selectedClient.DNI_O_RUC})` : value}
        disabled
        className="bg-muted text-muted-foreground"
      />
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-9 pr-8"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          {fetching ? (
            <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando clientes...
            </div>
          ) : fetchError ? (
            <div className="px-3 py-6 text-sm text-red-500 text-center">
              Error al cargar clientes. Verifica la conexión.
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground text-center">
              No se encontraron clientes
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.map((c) => (
                <li
                  key={c.DNI_O_RUC}
                  onClick={() =>
                    handleSelect(
                      c.DNI_O_RUC,
                      `${c.razon_social} (${c.DNI_O_RUC})`,
                    )
                  }
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    c.DNI_O_RUC === value ? "bg-accent font-medium" : ""
                  }`}
                >
                  <span className="block font-medium">{c.razon_social}</span>
                  <span className="block text-xs text-muted-foreground">
                    {c.DNI_O_RUC}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-border px-1 py-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                handleSelect("00000000", "Exterior a la empresa (00000000)")
              }
            >
              + Exterior a la empresa (RUC 00000000)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
