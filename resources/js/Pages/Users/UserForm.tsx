import { FormFieldInput } from "@/components/ui/form";
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
            <FormFieldInput control={form.control} name="name" label="Name" placeholder="Your name" />
            <FormFieldInput control={form.control} name="email" label="Email" placeholder="user@mail.com" />
            <FormFieldInput control={form.control} name="password" label="Password" placeholder="Enter your password" inputType="password" />
        </>
    )
}

export default React.memo(UserFormField);
