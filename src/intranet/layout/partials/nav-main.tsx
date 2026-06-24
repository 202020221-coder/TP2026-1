import { NavLink } from "react-router";
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
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

import { sidebarLinks, type IMenu, type ISubMenu } from "../sidebar-links";

import {
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileArchive,
  FileText,
  LayoutDashboard,
  Receipt,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import type { UserRole } from "@/security/session/interfaces/roles";

const lucideIconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  Receipt,
  BriefcaseBusiness,
  CalendarDays,
  FileArchive,
  Truck,
  Users,
  Wrench,
  Boxes,
};

export function NavMain({ userRole }: { userRole: UserRole }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const menu: IMenu[] = sidebarLinks;

  return (
    <SidebarGroup>
      {!collapsed ? <SidebarGroupLabel>Menú</SidebarGroupLabel> : null}
      <SidebarMenu>
        {menu.map(({ title, url, items, icon }) => {
          const isAuthorizated = (
            sidebarLinks.find((m) => m.title === title)?.roles ?? []
          ).includes(userRole);

          if (!isAuthorizated) return null;
          if (!url) return null;

          const Icon = icon ? (lucideIconMap[icon] ?? FileText) : FileText;

          return (
            <Collapsible key={title} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={title}>
                  <NavLink
                    to={url}
                    end={url === "/intranet/dashboard"}
                    className={({ isActive }) =>
                      cn(
                        isActive &&
                          "bg-primary/10 font-semibold text-primary shadow-sm",
                      )
                    }
                  >
                    <Icon className="size-[1.125rem] shrink-0" />
                    {!collapsed ? (
                      <span className="min-w-0 flex-1 truncate">{title}</span>
                    ) : null}
                  </NavLink>
                </SidebarMenuButton>

                {items?.length && !collapsed ? (
                  <SubMenu items={items} userRole={userRole} />
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
  userRole,
}: {
  items: ISubMenu[];
  userRole: UserRole;
}) => {
  return (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:rotate-90">
          <ChevronRight className="size-4" />
        </SidebarMenuAction>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {items?.map(({ title, url, roles }) => {
            const isAuthorizated = (roles ?? []).includes(userRole);
            if (!isAuthorizated) return null;

            return (
              <SidebarMenuSubItem key={title}>
                <SidebarMenuSubButton asChild>
                  <NavLink
                    to={url}
                    className={({ isActive }) =>
                      cn(
                        isActive && "bg-primary/10 font-medium text-primary",
                      )
                    }
                  >
                    <span className="truncate">{title}</span>
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
