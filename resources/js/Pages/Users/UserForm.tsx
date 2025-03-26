import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CircleX, Save } from "lucide-react";
import { UserType } from "./Index";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import { create, update } from "@/lib/api";
import { AxiosError } from "axios";
import { ServerErrorResponse } from "@/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UserFormDialogProps {
    visible: boolean;
    title: string;
    data: UserType | undefined;
    closeDialog: () => void;
}

const formSchema = z.object({
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

export function UserFormDialog({ visible, title, data, closeDialog }: UserFormDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        form.reset({
            id: data?.id,
            name: data?.name || "",
            email: data?.email || "",
            password: "",
        });
    }, [data, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            values.id
                ? await update(`/users/${values.id}`, values)
                : await create('/users', values);

            toast.success('User saved successfully', {
                richColors: true,
            });
            form.reset();
            closeDialog();

            // reload table
            queryClient.invalidateQueries({
                queryKey: ['/users'],
            });

        } catch (error) {
            const axiosError = error as ServerErrorResponse
            if (axiosError.code === 'ERR_BAD_REQUEST') {
                const errors = axiosError.response.data.errors;
                for (const key in errors) {
                    form.setError(key as any, {
                        type: 'server',
                        message: errors[key][0],
                    });
                }
            }

            toast.error(axiosError.response.data.message, {
                richColors: true,
            });
        }
    }

    function closeForm() {
        form.reset();
        closeDialog();
    }

    return (
        <Dialog open={visible} onOpenChange={closeForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Make sure you fill all the required fields
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => {
                                return <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input hasError={fieldState.invalid} placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
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
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={closeForm}>
                        <CircleX /> Cancel
                    </Button>
                    <Button type="submit" form="form">
                        <Save /> Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
