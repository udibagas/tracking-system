import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserFormDialog } from "./UserForm";

export default function Users() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />
            <DataTable
                title="Manage Users"
                columns={columns}
                url="/users"
                showIndexColumn
                showActionColumn
                showSearch
                controls={
                    <Button className="h-8" size='sm' onClick={() => setShowDialog(true)}>Create User</Button>
                }
            />

            <UserFormDialog
                title="Create User"
                visible={showDialog}
                onConfirm={() => setShowDialog(false)}
                onCancel={() => setShowDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
