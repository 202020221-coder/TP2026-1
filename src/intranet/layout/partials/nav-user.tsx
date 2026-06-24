import { useNavigate } from "react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { clearSession } from "@/security/session/hooks/stores/useSession.store";
import type { UserRole } from "@/security/session/interfaces/roles";
import { RolesRecord } from "@/security/session/enum/roles.enum";

interface Props {
  names: string;
  lastnames: string;
  role: UserRole;
  email: string;
}

const RoletoLabelMap = new Map<UserRole, string>([
  [RolesRecord.client, "Cliente"],
  [RolesRecord.fieldSupervisor, "Supervisor de Campo"],
  [RolesRecord.fieldWorker, "Trabajador de Campo"],
  [RolesRecord.lawyer, "Abogado"],
  [RolesRecord.manager, "Gerente"],
  [RolesRecord.projectAdmin, "Asistente de Proyectos"],
  [RolesRecord.workshopWorker, "Trabajador de Taller"],
]);

function getInitials(names: string, lastnames: string) {
  const first = names.trim().charAt(0) || "";
  const last = lastnames.trim().charAt(0) || "";
  return (first + last).toUpperCase() || "U";
}

export function NavUser({ names, lastnames, email, role }: Props) {
  const navigate = useNavigate();
  const { isMobile, state } = useSidebar();
  const collapsed = state === "collapsed";
  const initials = getInitials(names, lastnames);

  function logout() {
    clearSession();
    navigate("/auth/login");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={`${names} ${lastnames}`}
              className={cn(
                "hover:bg-slate-100 data-[state=open]:bg-slate-100",
                collapsed && "justify-center px-0",
              )}
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
                  !collapsed && "mr-0.5",
                )}
                aria-hidden
              >
                {initials}
              </div>
              {!collapsed ? (
                <>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-slate-800">
                      {names} {lastnames}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 text-slate-400" />
                </>
              ) : null}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {names} {lastnames}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {RoletoLabelMap.get(role)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/intranet/usuarios/mi-perfil")}
              >
                <UserCog />
                Mi Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
