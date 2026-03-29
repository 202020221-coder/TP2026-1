import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';

export interface IBreadcrumb {
    label: string;
    href?: string;
}

interface CustomBreadcrumbProps {
    links?: IBreadcrumb[];
    title: string;
}

export function CustomBreadcrumb({ links = [], title }: CustomBreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {links.map((link) => (
                    <BreadcrumbItem key={`${link.label}-${link.href ?? ''}`}>
                        {link.href ? <BreadcrumbLink href={link.href}>{link.label}</BreadcrumbLink> : <BreadcrumbPage>{link.label}</BreadcrumbPage>}
                        <BreadcrumbSeparator />
                    </BreadcrumbItem>
                ))}
                <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
