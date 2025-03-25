import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";

export default function Users() {
    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <DataTable title="Manage Users" columns={columns} url="/users" />
        </AuthenticatedLayout>
    );
}
