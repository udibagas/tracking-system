import { createItem, deleteItem, getItems, updateItem } from "@/lib/api";
import { PaginatedData, RecursivePartial, ServerErrorResponse } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, message, Modal, Table } from "antd";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Dayjs } from "dayjs";

interface DataTableContextProps {
    handleAdd: () => void;
    handleModalClose: () => void;
    handleSubmit: (values: any) => Promise<void>;
    handleEdit: (data: RecursivePartial<any>, additionalData?: Record<string, any>) => void;
    handleDelete: (id: number) => void;
    refreshData: () => void;
    form: any;
    showForm: boolean;
    errors: Record<string, string[]>;
    isEditing: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSearch: (search: string) => void;
    setFilter: (filter: Record<string, string>) => void;
    useFetch: <D = any>() => {
        isPending: boolean;
        data: D | undefined;
    };
}

const DataTableContext = createContext<DataTableContextProps | undefined>(undefined)

interface DataTableProviderProps<T> {
    url: string;
    children: React.ReactNode;
}

export function DataTableProvider<T extends { id: number }>({ url, children }: DataTableProviderProps<T>) {
    // form related
    const [form] = Form.useForm<T>();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // pagination and filters
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<Record<string, string>>({});

    const queryClient = useQueryClient();
    const refreshData = () => {
        setCurrentPage(1);
        setSearch("");
        setFilter({});
        queryClient.invalidateQueries({ queryKey: [url] });
    }

    const params = useMemo(
        () => ({ page: currentPage, pageSize, search, ...filter }),
        [currentPage, pageSize, search, filter]
    );

    function useFetch<D = T[]>() {
        return useQuery({
            queryKey: [url, params],
            queryFn: () => getItems<D>(url, params),
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
                    ? await updateItem(url, values.id, values)
                    : await createItem(url, values);

                message.success("Record saved successfully");
                form.resetFields();
                setErrors({});
                setShowForm(false);
                refreshData();
            } catch (error) {
                const axiosError = error as ServerErrorResponse;
                if (axiosError.code === "ERR_BAD_REQUEST") {
                    const errors = axiosError.response.data.errors ?? {};
                    setErrors(errors);
                }

                message.error(axiosError.response.data.message);
            }
        },
        [url, form]
    );

    const handleDelete = useCallback(
        (id: number) => {
            Modal.confirm({
                title: "Are you sure you want to delete this record?",
                content: "This action cannot be undone.",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    deleteItem(url, id).then(() => {
                        message.success("Record deleted successfully");
                        refreshData();
                    });
                },
            });
        },
        [url, refreshData]
    );


    return (
        <DataTableContext.Provider value={{
            handleAdd,
            handleModalClose,
            handleSubmit,
            handleEdit,
            handleDelete,
            refreshData,
            form,
            showForm,
            errors,
            isEditing,
            currentPage,
            setCurrentPage,
            setPageSize,
            setSearch,
            setFilter,
            useFetch
        }}>
            {children}
        </DataTableContext.Provider>
    )
}

export function useDataTableContext() {
    const context = useContext(DataTableContext);
    if (!context) {
        throw new Error("useDataTableContext must be used within a DataTableProvider");
    }
    return context;
}
