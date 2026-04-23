import { type ReactElement } from 'react'

import { Separator } from '@/shared/components/ui/separator';
import { CustomBreadcrumb, type IBreadcrumb } from '@/shared/components/custom/CustomBreadcrumb';

import { AppSidebar } from './partials/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';

interface Props {
  children: ReactElement | ReactElement[];
  breadcrumbs?: IBreadcrumb[];
  title: string;
  className?: string;
}

export const Layout = ({ children, breadcrumbs = [], title, className = "flex flex-1 flex-col gap-4 p-4 pt-2" }: Props) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className='flex flex-col flex-1 min-h-full max-h-full'>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <CustomBreadcrumb links={breadcrumbs} title={title} />
            </div>
          </header>
          <main className={className}>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
