import { useNavigate } from "react-router";

// import { useAuthStore } from "@/shared/store/AuthStore";

import { SidebarMenu,SidebarMenuButton,SidebarMenuItem,useSidebar, } from "@/shared/components/ui/sidebar";
import { DropdownMenu,DropdownMenuContent,DropdownMenuGroup,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger, } from "@/shared/components/ui/dropdown-menu";

import { ChevronsUpDown, LogOut, UserCog, } from "lucide-react";

interface Props {
  names: string;
  lastnames: string;
  role: string;
  email: string;
}

export function NavUser({ names, lastnames, email, role }: Props) {
  let navigate = useNavigate();
  
  const { isMobile } = useSidebar()
  
  function logout() {
    // const { clearSession } = useAuthStore.getState();
    
    // clearSession();

    navigate("/auth/login");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{names} {lastnames}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{names} {lastnames}</span>
                  <span className="truncate text-xs">{role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/intranet/usuarios/mi-perfil")}>
                <UserCog />
                Mi Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
