import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function AuthenticatedLayout({
    breadcrumbs,
    children,
}: PropsWithChildren<{ breadcrumbs?: ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {breadcrumbs}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
