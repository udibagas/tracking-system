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
import { Form } from "@/components/ui/form";
import { z } from "zod";
import React, { ReactNode, useCallback } from "react";
import { create, update } from "@/lib/api";
import { ServerErrorResponse } from "@/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { FormType } from "./CrudTable";

interface FormDialogProps {
    url: string;
    visible: boolean;
    form: FormType
    children: ReactNode;
    closeForm: () => void;
}

function FormDialog({
    url,
    visible,
    form,
    children,
    closeForm,
}: FormDialogProps) {
    const queryClient = useQueryClient();
    const id = form.form.getValues("id");

    const onSubmit = useCallback(async (values: z.infer<typeof form.schema>) => {
        try {
            values.id
                ? await update(`${url}/${values.id}`, values)
                : await create(url, values);

            toast.success("Data saved successfully", {
                richColors: true,
            });

            closeForm();

            // reload table
            queryClient.invalidateQueries({
                queryKey: [url],
            });
        } catch (error) {
            const axiosError = error as ServerErrorResponse;
            if (axiosError.code === "ERR_BAD_REQUEST") {
                const errors = axiosError.response.data.errors;
                for (const key in errors) {
                    form.form.setError(key as any, {
                        type: "server",
                        message: errors[key][0],
                    });
                }
            }

            toast.error(axiosError.response.data.message, {
                richColors: true,
            });
        }
    }, [url, form.form, queryClient, closeForm]);

    return (
        <Dialog open={visible} onOpenChange={closeForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{id ? "Update Data" : "Create Data"}</DialogTitle>
                    <DialogDescription>
                        Make sure you fill all the required fields
                    </DialogDescription>
                </DialogHeader>
                <Form {...form.form}>
                    <form
                        onSubmit={form.form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {children}

                        <DialogFooter>
                            <Button variant="outline" onClick={closeForm}>
                                <CircleX /> Cancel
                            </Button>
                            <Button type="submit">
                                <Save /> {id ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default React.memo(FormDialog);
