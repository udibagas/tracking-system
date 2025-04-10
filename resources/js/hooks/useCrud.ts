import { Dayjs } from "dayjs";
import { Form, message } from "antd";
import { useCallback, useMemo, useState } from "react";
import { RecursivePartial, ServerErrorResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import { createItem, getItems, updateItem } from "@/lib/api";

const useCrud = <T extends { id?: number }>(endpoint: string) => {
    const [form] = Form.useForm<T>();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<Record<string, string>>({});

    const params = useMemo(
        () => ({ page: currentPage, pageSize, search, ...filter }),
        [currentPage, pageSize, search, filter]
    );

    function useFetch<D = T[]>() {
        return useQuery({
            queryKey: [endpoint, params],
            queryFn: () => getItems<D>(endpoint, params),
            staleTime: 60 * 1000 * 10, // 10 minutes
        });
    }

    const handleAdd = useCallback(() => {
        form.resetFields();
        setIsEditing(false);
        setShowForm(true);
    }, [form]);

    const handleEdit = useCallback(
        (
            data: RecursivePartial<T>,
            additionalData: Record<
                string,
                string | number | boolean | Dayjs | null | number[]
            > = {}
        ) => {
            form.setFieldsValue({ ...data, ...additionalData });
            setIsEditing(true);
            setShowForm(true);
        },
        [form]
    );

    const handleModalClose = useCallback(() => {
        setShowForm(false);
        form.resetFields();
        setErrors({});
    }, [form]);

    const handleSubmit = useCallback(
        async (values: T) => {
            try {
                const res = values.id
                    ? await updateItem(endpoint, values.id, values)
                    : await createItem(endpoint, values);

                message.success("Record saved successfully");
                form.resetFields();
                setErrors({});
                setShowForm(false);
                // TODO: refresh data
            } catch (error) {
                const axiosError = error as ServerErrorResponse;
                if (axiosError.code === "ERR_BAD_REQUEST") {
                    const errors = axiosError.response.data.errors ?? {};
                    setErrors(errors);
                }

                message.error(axiosError.response.data.message);
            }
        },
        [endpoint, form]
    );

    return {
        form,
        errors,
        showForm,
        isEditing,
        currentPage,
        pageSize,
        search,
        filter,
        params,
        setShowForm,
        useFetch,
        handleAdd,
        handleEdit,
        handleSubmit,
        handleModalClose,
        setCurrentPage,
        setPageSize,
        setSearch,
        setFilter,
    };
};

export default useCrud;
