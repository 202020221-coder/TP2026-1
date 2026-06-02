"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ExternalLink, LogOut } from "lucide-react";
import { useSession, clearSession } from "@/security/session/hooks/stores/useSession.store";

export function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useSession((s) => s.loggedUser);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = `${user.nombres ?? ""} ${user.apellidos ?? ""}`.trim() || "Usuario";
  const initials = `${user.nombres?.[0] ?? ""}${user.apellidos?.[0] ?? ""}`.toUpperCase();

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        title={displayName}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.correo}</p>
          </div>
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                navigate("/intranet");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ir a Intranet
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
