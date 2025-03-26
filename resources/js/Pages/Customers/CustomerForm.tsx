import { Input } from "@/components/ui/input";
import { CustomerType } from "./Index";
import { useForm } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { FormDialog } from "@/components/FormDialog";
import { zodResolver } from "@hookform/resolvers/zod";

interface CustomerFormDialogProps {
    visible: boolean;
    title: string;
    data: CustomerType | undefined;
    closeDialog: () => void;
}

const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
});

const defaultValues = {
    name: "",
    email: "",
    phone: "",
};

export function CustomerForm({
    visible,
    title,
    data,
    closeDialog,
}: CustomerFormDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    return (
        <FormDialog
            url="/customers"
            visible={visible}
            title={title}
            data={data}
            closeDialog={closeDialog}
            formSchema={formSchema}
            defaultValues={defaultValues}
            form={form}
        >
            <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                hasError={fieldState.invalid}
                                placeholder="Your Name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                hasError={fieldState.invalid}
                                placeholder="user@mail.com"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                            <Input
                                hasError={fieldState.invalid}
                                placeholder="+62xxx"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormDialog>
    );
}
