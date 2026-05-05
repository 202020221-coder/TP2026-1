import { NavLink, useLocation } from "react-router";
import type { LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";

import { sidebarLinks, type IMenu, type ISubMenu } from "../sidebar-links";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import type { UserRole } from "@/security/session/interfaces/roles";

const lucideIconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  Receipt,
  BriefcaseBusiness,
  CalendarDays,
};

export function NavMain({ userRole }: { userRole: UserRole }) {
  const location = useLocation();
  const menu: IMenu[] = sidebarLinks;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menú</SidebarGroupLabel>
      <SidebarMenu>
        {menu.map(({ title, url, items, icon }) => {
          // const isAuthorizated = roles.some(rol => userRole == rol);
          const isAuthorizated = true;

          if (!isAuthorizated) return;

          const isParentActive: boolean =
            url === location.pathname ||
            items?.some((sub) => sub.url === location.pathname) ||
            false;
          const className: string = isParentActive
            ? "text-primary font-semibold"
            : "";
          const Icon = icon ? (lucideIconMap[icon] ?? FileText) : FileText;

          return (
            <Collapsible key={title} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={title}>
                  <NavLink
                    to={url ?? "#"}
                    className={`flex items-center gap-2 text-right ${className}`}
                  >
                    <Icon className="size-5" />
                    <span className="text-right">{title}</span>
                  </NavLink>
                </SidebarMenuButton>

                {items?.length ? (
                  <SubMenu
                    items={items}
                    userRole={userRole}
                    currentPath={location.pathname}
                  />
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const SubMenu = ({
  items,
  currentPath,
}: {
  items: ISubMenu[];
  userRole: UserRole;
  currentPath: string;
}) => {
  return (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:rotate-90">
          <ChevronRight />
        </SidebarMenuAction>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {items?.map(({ title, url }) => {
            const className: string =
              url === currentPath ? "text-primary font-semibold" : "";
            const isAuthorizated = true;
            if (!isAuthorizated) return;

            return (
              <SidebarMenuSubItem key={title}>
                <SidebarMenuSubButton asChild>
                  <NavLink
                    to={url}
                    className={`flex items-center gap-2 ${className}`}
                  >
                    <span>{title}</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </>
  );
};
