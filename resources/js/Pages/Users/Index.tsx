import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserFormDialog } from "./UserForm";
import { Plus } from "lucide-react";

export type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Users() {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<UserType | undefined>(undefined);

    function onEdit(data: UserType) {
        setShowDialog(true);
        setSelectedData(data);
    }

    function closeDialog() {
        setShowDialog(false);
        setSelectedData(undefined);
    }

    function openDialog(data?: UserType) {
        setSelectedData(data);
        setShowDialog(true);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <DataTable
                onEdit={onEdit}
                title="Manage Users"
                columns={columns}
                url="/users"
                showIndexColumn
                showActionColumn
                showSearch
                controls={
                    <Button className="h-8" size='sm' onClick={() => openDialog()}>
                        <Plus /> Create New User
                    </Button>
                }
            />

            <UserFormDialog
                data={selectedData}
                title={selectedData ? 'Edit User' : 'Create User'}
                visible={showDialog}
                closeDialog={closeDialog}
            />
        </AuthenticatedLayout>
    );
}
