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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useEffect } from "react";
import { useFormDialog } from "@/hooks/use-form-dialog";

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

const defaultValues = {
    name: '',
    email: '',
    password: '',
}

export function UserFormDialog({ visible, title, data, closeDialog }: UserFormDialogProps) {
    const { form, onSubmit, closeForm } = useFormDialog('/users', formSchema, defaultValues, closeDialog);

    useEffect(() => {
        form.reset(data);
    }, [data, form]);

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
