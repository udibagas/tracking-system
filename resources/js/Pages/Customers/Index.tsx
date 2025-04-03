import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CrudTable } from "@/components/CrudTable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldInput } from "@/components/ui/form";
import { ColumnDef } from "@tanstack/react-table";

export type CustomerType = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

export const columns: ColumnDef<CustomerType>[] = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Phone'
    },
]

export const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
});

export const defaultValues = {
    name: "",
    email: "",
    phone: "",
};

export default function Customers() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Manage Customers" />

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
                    fields: <>
                        <FormFieldInput control={form.control} name="name" label="Name" placeholder="Customer name" />
                        <FormFieldInput control={form.control} inputType="email" name="email" label="Email" placeholder="customer@mail.com" />
                        <FormFieldInput control={form.control} name="phone" label="Phone" placeholder="+62xxx" />
                    </>
                }}
            />
        </AuthenticatedLayout>
    );
}
