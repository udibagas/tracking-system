import React from "react";
import { UserType } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTableProvider } from "@/context/DataTableContext";
import UserTable from "./UserTable";

const User: React.FC = () => {
    const url = "/users";

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />
            <DataTableProvider<UserType> url={url}>
                <UserTable />
            </DataTableProvider>
        </AuthenticatedLayout>
    );
};

export default User;
