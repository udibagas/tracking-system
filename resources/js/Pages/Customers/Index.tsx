import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { FormDialog } from "@/components/FormDialog";
import { CustomerForm } from "./CustomerForm";

export type CustomerType = {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export default function Users() {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<CustomerType | undefined>(undefined);

    function onEdit(data: CustomerType) {
        setShowDialog(true);
        setSelectedData(data);
    }

    function closeDialog() {
        setShowDialog(false);
        setSelectedData(undefined);
    }

    function openDialog(data?: CustomerType) {
        setSelectedData(data);
        setShowDialog(true);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <DataTable
                onEdit={onEdit}
                title="Manage Customers"
                columns={columns}
                url="/customers"
                showIndexColumn
                showActionColumn
                showSearch
                controls={
                    <Button className="h-8" size='sm' onClick={() => openDialog()}>
                        <Plus /> Create New Customer
                    </Button>
                }
            />

            <CustomerForm visible={showDialog} title="Create Customer" data={selectedData} closeDialog={closeDialog} />

        </AuthenticatedLayout>
    );
}
