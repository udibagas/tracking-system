import { remove } from "@/lib/api";
import fetchData from "@/lib/fetchData";
import { ServerErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    ColumnDef,
    getCoreRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const useCrud = <TData>(url: string, columns: ColumnDef<TData>[]) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState<string | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const params = useMemo(() => {
        return {
            pageSize: pagination.pageSize,
            page: pagination.pageIndex + 1,
            sort: sorting?.[0]?.id,
            order: sorting?.[0]?.desc ? "desc" : "asc",
            search,
        };
    }, [pagination, sorting, search]);

    const dataQuery = useQuery({
        queryKey: [url, params],
        queryFn: () => fetchData<TData>(url, params),
        placeholderData: keepPreviousData,
    });

    const defaultData = useMemo(() => [], []);

    const table = useReactTable({
        columns,
        data: dataQuery.data?.data ?? defaultData,
        pageCount: dataQuery.data?.last_page,
        rowCount: dataQuery.data?.data.length,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    function refreshData() {
        setSearch("");
        document.querySelector<HTMLInputElement>("#search")!.value = "";
        table.setPageIndex(0);
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const timeout = setTimeout(() => {
            table.setPageIndex(0);
            setSearch(e.target.value);
        }, 500);

        return () => clearTimeout(timeout);
    }

    function handleDelete(id: number) {
        setSelectedId(id);
        setDeleteDialogVisible(true);
    }

    async function confirmDelete() {
        if (selectedId !== null) {
            try {
                await remove(`${url}/${selectedId}`);
                setDeleteDialogVisible(false);
                dataQuery.refetch();
                toast.success("Data deleted successfully", {
                    richColors: true,
                });
            } catch (error) {
                const axiosError = error as ServerErrorResponse;
                toast.error(axiosError.response?.data.message, {
                    richColors: true,
                });
            }
        }
    }

    return {
        table,
        dataQuery,
        deleteDialogVisible,
        refreshData,
        handleSearch,
        handleDelete,
        confirmDelete,
        setDeleteDialogVisible,
    };
};
