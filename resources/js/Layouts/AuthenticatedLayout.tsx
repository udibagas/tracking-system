import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Toaster } from 'sonner';

const queryClient = new QueryClient()

export default function AuthenticatedLayout({
    children,
}: PropsWithChildren<{}>) {
    const { pathname } = window.location
    const pages = pathname.split('/')

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {pages.map((page, index) => (
                                        <BreadcrumbItem key={index}>
                                            <BreadcrumbPage>{page}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <QueryClientProvider client={queryClient}>
                            <div className="p-4">
                                {children}
                            </div>
                        </QueryClientProvider>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </>
    );
}
