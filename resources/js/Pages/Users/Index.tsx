import { UserType } from "@/types";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { DataTableProvider } from "@/context/DataTableContext";
import UserTable from "./UserTable";

export default function User() {
    return (
        <MainLayout>
            <Head title="Manage Users" />
            <DataTableProvider<UserType> url='/users'>
                <UserTable />
            </DataTableProvider>
        </MainLayout>
    );
};
