import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeft } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

type SidebarContextValue = {
    isMobile: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
}

function SidebarProvider({ children }: React.ComponentProps<'div'>) {
    const [open, setOpen] = React.useState(true);

    const value = React.useMemo(
        () => ({
            isMobile: false,
            open,
            setOpen,
            toggleSidebar: () => setOpen((prev) => !prev),
        }),
        [open]
    );

    return (
        <SidebarContext.Provider value={value}>
            <div
                data-slot="sidebar-wrapper"
                data-collapsible={open ? '' : 'icon'}
                className="group/sidebar-wrapper flex min-h-screen w-full"
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

function Sidebar({ className, collapsible = 'offcanvas', ...props }: React.ComponentProps<'aside'> & { collapsible?: 'offcanvas' | 'icon' | 'none' }) {
    const { open } = useSidebar();

    const collapsed = collapsible === 'icon' && !open;

    return (
        <aside
            data-slot="sidebar"
            data-state={open ? 'expanded' : 'collapsed'}
            data-collapsible={collapsed ? 'icon' : ''}
            className={cn(
                'sticky top-0 flex max-h-screen flex-col border-r bg-muted/30 transition-all duration-200 ease-linear overflow-y-auto',
                collapsed ? 'w-16' : 'w-64',
                className
            )}
            {...props}
        />
    );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-inset" className={cn('min-w-0 flex-1', className)} {...props} />;
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            type="button"
            data-slot="sidebar-trigger"
            className={cn('inline-flex size-8 items-center justify-center rounded-md border hover:bg-accent', className)}
            onClick={toggleSidebar}
            {...props}
        >
            <PanelLeft className="size-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </button>
    );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
    const { toggleSidebar } = useSidebar();
    return <button type="button" data-slot="sidebar-rail" onClick={toggleSidebar} className={cn('w-1 bg-border/60', className)} {...props} />;
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-header" className={cn('p-2', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-content" className={cn('flex-1 overflow-auto p-2', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-footer" className={cn('p-2', className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-group" className={cn('space-y-1', className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-group-label" className={cn('px-2 py-1 text-xs font-semibold text-muted-foreground', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
    return <ul data-slot="sidebar-menu" className={cn('space-y-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="sidebar-menu-item" className={cn('relative', className)} {...props} />;
}

function SidebarMenuButton({ className, asChild = false, size = 'default', ...props }: React.ComponentProps<'button'> & { asChild?: boolean; size?: 'default' | 'sm' | 'lg'; tooltip?: string }) {
    const Comp = asChild ? Slot : 'button';
    return (
        <Comp
            data-slot="sidebar-menu-button"
            className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-accent',
                size === 'sm' && 'h-8',
                size === 'default' && 'h-9',
                size === 'lg' && 'h-10',
                className
            )}
            {...props}
        />
    );
}

function SidebarMenuAction({ className, ...props }: React.ComponentProps<'button'>) {
    return <button type="button" data-slot="sidebar-menu-action" className={cn('inline-flex size-7 items-center justify-center rounded-md hover:bg-accent', className)} {...props} />;
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
    return <ul data-slot="sidebar-menu-sub" className={cn('mt-1 ml-3 space-y-1 border-l pl-2', className)} {...props} />;
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="sidebar-menu-sub-item" className={cn('relative', className)} {...props} />;
}

function SidebarMenuSubButton({ className, asChild = false, ...props }: React.ComponentProps<'button'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'button';
    return <Comp data-slot="sidebar-menu-sub-button" className={cn('flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-accent', className)} {...props} />;
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
