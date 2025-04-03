import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { columns } from "./Columns";
import UserFormField, { defaultValues, formSchema } from "./UserForm";
import { CrudTable } from "@/components/CrudTable";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Users() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <CrudTable<UserType>
                title="Manage Users"
                columns={columns}
                url="/users"
                showIndexColumn
                showActionColumn
                showSearch
                form={{
                    form,
                    schema: formSchema,
                    defaultValues: defaultValues,
                    fields: <UserFormField form={form} />
                }}
            />
        </AuthenticatedLayout>
    );
}
