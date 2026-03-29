import { NavLink, useLocation } from "react-router";

import { Collapsible,CollapsibleContent,CollapsibleTrigger,} from "@/shared/components/ui/collapsible"
import { SidebarGroup,SidebarGroupLabel,SidebarMenu,SidebarMenuAction,SidebarMenuButton,SidebarMenuItem,SidebarMenuSub,SidebarMenuSubButton,SidebarMenuSubItem,} from "@/shared/components/ui/sidebar"

import { sidebarLinks, type IMenu, type ISubMenu } from "../sidebar-links";

import { ChevronRight } from "lucide-react";

export function NavMain({ userRole }: { userRole: string; }) {
  const location = useLocation();
  const menu: IMenu[] = sidebarLinks;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menú</SidebarGroupLabel>
      <SidebarMenu>
        {
          menu.map(({ title, url, items, roles }) => {
            
            // const isAuthorizated = roles.some(rol => userRole == rol);
            const isAuthorizated = true;

            if(!isAuthorizated) return;
            
            const isParentActive: boolean = url === location.pathname || items?.some(sub => sub.url === location.pathname) || false;
            const className: string =  isParentActive ? "text-primary font-semibold" : "";
          
            return (
              <Collapsible key={ title } asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={ title }>
                    <NavLink to={ url ?? '#' } className={`flex items-center gap-2 ${className}`}>
                      <span> { title } </span>
                    </NavLink>
                  </SidebarMenuButton>

                  { items?.length ? <SubMenu items={ items } userRole={ userRole }/> : null }
                </SidebarMenuItem>
              </Collapsible>
            )
          })
        }
      </SidebarMenu>
    </SidebarGroup>
  )
}

const SubMenu = ({ items, userRole }: { items:ISubMenu[]; userRole: string; }) => {
  return (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:rotate-90">
          <ChevronRight/>
        </SidebarMenuAction>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {
            items?.map(({ title, url, roles }) => {
              const className: string = url === location.pathname ? 'text-primary font-semibold' : '';
              // const isAuthorizated = roles.some(rol => userRole == rol);   
              const isAuthorizated = true;   
              if(!isAuthorizated) return;

              return (
                <SidebarMenuSubItem key={ title }>
                  <SidebarMenuSubButton asChild>
                    <NavLink to={ url } className={`flex items-center gap-2 ${className}`}>
                      <span> { title } </span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })
          }
        </SidebarMenuSub>
      </CollapsibleContent> 
    </>
  )
}