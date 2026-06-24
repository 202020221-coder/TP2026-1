import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

const SIDEBAR_STORAGE_KEY = "swefire-sidebar-open";

type SidebarContextValue = {
  isMobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

function readStoredOpen(): boolean {
  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {
    /* ignore */
  }
  return true;
}

function SidebarProvider({ children }: React.ComponentProps<"div">) {
  const [open, setOpenState] = React.useState(readStoredOpen);

  const setOpen = React.useCallback((value: boolean) => {
    setOpenState(value);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(
    () => ({
      isMobile: false,
      open,
      setOpen,
      toggleSidebar: () => setOpen(!open),
      state: open ? ("expanded" as const) : ("collapsed" as const),
    }),
    [open, setOpen],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        data-collapsible={open ? "" : "icon"}
        className="group/sidebar-wrapper flex min-h-screen w-full"
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  className,
  collapsible = "offcanvas",
  ...props
}: React.ComponentProps<"aside"> & {
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { open, state } = useSidebar();
  const collapsed = collapsible === "icon" && !open;

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-collapsible={collapsed ? "icon" : ""}
      className={cn(
        "group/sidebar relative sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-slate-200/90 bg-gradient-to-b from-slate-50 to-white transition-[width] duration-200 ease-in-out overflow-x-hidden overflow-y-auto",
        collapsed ? "w-[4.5rem]" : "w-64",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("min-w-0 flex-1 transition-[margin] duration-200", className)}
      {...props}
    />
  );
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900",
        className,
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Alternar menú lateral</span>
    </button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label="Alternar menú lateral"
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 -right-2 z-20 hidden w-4 transition-colors sm:block",
        "hover:bg-primary/5",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "border-b border-slate-200/80 p-2 group-data-[state=collapsed]/sidebar:px-1.5",
        className,
      )}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex-1 overflow-x-hidden overflow-y-auto p-2 group-data-[state=collapsed]/sidebar:px-1.5",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "border-t border-slate-200/80 p-2 group-data-[state=collapsed]/sidebar:px-1.5",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-group" className={cn("space-y-1", className)} {...props} />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500",
        "group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="sidebar-menu" className={cn("space-y-0.5", className)} {...props} />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props} />
  );
}

function SidebarMenuButton({
  className,
  asChild = false,
  size = "default",
  tooltip,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  size?: "default" | "sm" | "lg";
  tooltip?: string;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const Comp = asChild ? Slot : "button";

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm text-slate-700 transition-colors",
        "hover:bg-slate-100 hover:text-slate-900",
        collapsed && "justify-center px-0",
        size === "sm" && "h-8",
        size === "default" && "h-10",
        size === "lg" && "h-12",
        className,
      )}
      {...props}
    />
  );

  if (collapsed && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

function SidebarMenuAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-action"
      className={cn(
        "absolute top-1.5 right-1 inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100",
        "group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "mt-1 ml-3 space-y-0.5 border-l border-slate-200 pl-2",
        "group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-sub-item" className={cn("relative", className)} {...props} />
  );
}

function SidebarMenuSubButton({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      className={cn(
        "flex h-8 w-full items-center rounded-md px-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
