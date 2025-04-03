import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

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

interface CustomerFormFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>;
}

export function CustomerFormField({ form }: CustomerFormFieldProps) {
    return (
        <>
            <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input hasError={fieldState.invalid} placeholder="Your Name" {...field} />
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
                            <Input hasError={fieldState.invalid} placeholder="customer@mail.com" {...field} />
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
                            <Input hasError={fieldState.invalid} placeholder="+62xxx" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
