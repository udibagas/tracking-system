import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { columns } from "./Columns";
import { CustomerFormField } from "./CustomerForm";
import { CrudTable } from "@/components/CrudTable";
import { useForm } from "react-hook-form";
import { defaultValues, formSchema } from "./CustomerForm"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type CustomerType = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

export default function Customers() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <CrudTable<CustomerType>
                title="Manage Customers"
                columns={columns}
                url="/customers"
                showIndexColumn
                showActionColumn
                showSearch
                form={{
                    form,
                    schema: formSchema,
                    defaultValues: defaultValues,
                    fields: <CustomerFormField form={form} />
                }}
            />
        </AuthenticatedLayout>
    );
}
