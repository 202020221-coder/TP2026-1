import * as React from "react";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { Flame } from "lucide-react";
import { NavLink } from "react-router";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSession((s) => s.loggedUser);

  if (!user) throw new Error("Usuario no logeado");

  const { correo: email, rol: role } = user;
  const names = "Jhon";
  const lastnames = "Doe";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:p-1.5!"
        >
          <NavLink to="/" title="Ir a la página principal">
            <Flame className="size-6! text-red-500" />
            <span className="text-base font-semibold">ENGINEER FIRE </span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain userRole={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          names={names}
          lastnames={lastnames}
          email={email}
          role={role}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
