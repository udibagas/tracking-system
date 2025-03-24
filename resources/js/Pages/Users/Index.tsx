import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/Components/ui/breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { columns } from "./Columns";

type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Users() {
    return (
        <AuthenticatedLayout
            breadcrumbs={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Users</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        >
            <Head title="Users" />

            <div className="p-4">
                <DataTable title="Manage Users" columns={columns} url="/users" />
            </div>
        </AuthenticatedLayout>
    );
}
