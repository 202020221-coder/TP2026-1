import * as React from "react";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

import { getClient } from "@/intranet/quotation/api/client.api";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import axiosInstance from "@/shared/api/axios.config";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenuButton, SidebarRail,
} from "@/shared/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const tryOr = <T,>(promise: Promise<T>, fallback: T) =>
  promise.catch(() => fallback);

async function resolveDisplayName(
  dni_perfil: string | undefined,
  role: string,
  email: string
): Promise<{ nombre: string; apellido: string }> {
  const fallback = { nombre: email.split("@")[0] ?? "", apellido: "" };

  if (!dni_perfil) return fallback;

  const perfil = await tryOr(
    axiosInstance.get<any>(`/perfiles/${dni_perfil}`).then((r) => r.data),
    null
  );

  const nombre = perfil?.Nombre ?? perfil?.nombre ?? perfil?.nombre_comercial ?? perfil?.razon_social;
  const apellido = perfil?.Apellido ?? perfil?.apellido ?? perfil?.apellido_paterno ?? "";

  if (nombre) return { nombre, apellido };

  const client = role === RolesRecord.client
    ? await tryOr(getClient(dni_perfil), null)
    : null;

  return {
    nombre: client?.nombre_comercial ?? client?.razon_social ?? fallback.nombre,
    apellido: "",
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSession((s) => s.loggedUser);
  if (!user) throw new Error("Usuario no logeado");

  const { correo: email, rol: role, dni_perfil } = user;
  const [displayName, setDisplayName] = useState({ nombre: "", apellido: "" });

  useEffect(() => {
    let mounted = true;
    resolveDisplayName(dni_perfil, role, email)
      .then((result) => { if (mounted) setDisplayName(result); });
    return () => { mounted = false; };
  }, [role, dni_perfil, email]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
          <a href="#">
            <Flame className="size-6! text-red-500" />
            <span className="text-base font-semibold">ENGINEER FIRE</span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain userRole={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          names={displayName.nombre}
          lastnames={displayName.apellido}
          email={email}
          role={role}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}