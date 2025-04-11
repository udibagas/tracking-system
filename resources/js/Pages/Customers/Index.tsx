import React from "react";
import { CustomerType } from "@/types";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { DataTableProvider } from "@/context/DataTableContext";
import CustomerTable from "./CustomerTable";

const User: React.FC = () => {
    return (
        <MainLayout>
            <Head title="Manage Customers" />
            <DataTableProvider<CustomerType> url='/customers'>
                <CustomerTable />
            </DataTableProvider>
        </MainLayout>
    );
};

export default User;
