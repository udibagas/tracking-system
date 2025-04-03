import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React from "react";

export const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .optional()
        .refine((password) => !password || password.length >= 6, {
            message: 'Password must be at least 6 characters long',
        }),
})

interface UserFormFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>;
}

export const defaultValues = {
    name: '',
    email: '',
    password: '',
}

function UserFormField({ form }: UserFormFieldProps) {
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
                            <Input hasError={fieldState.invalid} placeholder="user@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input hasError={fieldState.invalid} type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

export default React.memo(UserFormField);
