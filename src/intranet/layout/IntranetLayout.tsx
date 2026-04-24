import type { FC } from "react";
import { Outlet } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./partials/app-sidebar";
import { Separator } from "@/shared/components/ui/separator";
export const IntranetLayout: FC<{ className: string }> = ({ className }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-h-full max-h-full">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <CustomBreadcrumb links={breadcrumbs} title={title} /> */}
            </div>
          </header>
          <main className={className}>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
