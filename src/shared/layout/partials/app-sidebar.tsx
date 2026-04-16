import * as React from "react";

import { NavUser } from "@/shared/layout/partials/nav-user";
import { NavMain } from "@/shared/layout/partials/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

// import { useAuthStore } from "@/shared/store/AuthStore";

import { Flame } from "lucide-react";
import { useSession } from "@/profile/hooks/stores/useSession.store";

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
          <a href="#">
            <Flame className="size-6! text-red-500" />
            <span className="text-base font-semibold">ENGINEER FIRE </span>
          </a>
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
