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
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50/40">
        <AppSidebar />
        <SidebarInset className="flex min-h-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
          </header>
          <main
            className={`${className} flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f8fafc] py-4`}
          >
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
