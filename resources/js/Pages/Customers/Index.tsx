import React from "react";
import { CustomerType } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTableProvider } from "@/context/DataTableContext";
import CustomerTable from "./CustomerTable";

const User: React.FC = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Manage Customers" />
            <DataTableProvider<CustomerType> url='/customers'>
                <CustomerTable />
            </DataTableProvider>
        </AuthenticatedLayout>
    );
};

export default User;
