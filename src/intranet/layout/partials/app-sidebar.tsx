import { NavLink } from "react-router";
import { Flame } from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSession((s) => s.loggedUser);
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  if (!user) throw new Error("Usuario no logeado");
  const { correo: email, rol: role, nombres, apellidos } = user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          tooltip="SWEFIRE"
          className={cn(
            "h-11 hover:bg-slate-100",
            collapsed && "justify-center px-0",
          )}
        >
          <NavLink to="/" title={collapsed ? undefined : "Ir a la página principal"}>
            <Flame className="size-6 shrink-0 text-red-500" />
            {!collapsed ? (
              <span className="truncate text-base font-semibold text-slate-800">
                SWEFIRE
              </span>
            ) : null}
          </NavLink>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain userRole={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          names={nombres}
          lastnames={apellidos}
          email={email}
          role={role}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
