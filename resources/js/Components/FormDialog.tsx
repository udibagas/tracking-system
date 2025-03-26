import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CircleX, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { ReactNode, useEffect } from "react";
import { create, update } from "@/lib/api";
import { ServerErrorResponse } from "@/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface FormDialogProps<T> {
    url: string;
    visible: boolean;
    title: string;
    data: T | object;
    closeDialog: () => void;
    formSchema: z.ZodObject<any, any>;
    defaultValues: object;
    form: UseFormReturn<any, any, undefined>;
    children: ReactNode;
}

export function FormDialog({
    url,
    visible,
    title,
    data,
    formSchema,
    closeDialog,
    children,
    form
}: FormDialogProps<any>) {
    const queryClient = useQueryClient();

    useEffect(() => {
        form.reset(data);
    }, [data, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            values.id
                ? await update(`${url}/${values.id}`, values)
                : await create(url, values);

            toast.success("Data saved successfully", {
                richColors: true,
            });

            form.reset();
            closeDialog();

            // reload table
            queryClient.invalidateQueries({
                queryKey: [url],
            });
        } catch (error) {
            const axiosError = error as ServerErrorResponse;
            if (axiosError.code === "ERR_BAD_REQUEST") {
                const errors = axiosError.response.data.errors;
                for (const key in errors) {
                    form.setError(key as any, {
                        type: "server",
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
                    <form
                        id="form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {children}
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
    );
}
