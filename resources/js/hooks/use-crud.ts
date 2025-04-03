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
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export const useCrud = <TData>(url: string, columns: ColumnDef<TData>[]) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState<string | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

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

    const refreshData = useCallback(() => {
        setSearch("");
        document.querySelector<HTMLInputElement>("#search")!.value = "";
        table.setPageIndex(0);
    }, [table]);

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const timeout = setTimeout(() => {
                table.setPageIndex(0);
                setSearch(value);
            }, 500);
            return () => clearTimeout(timeout);
        },
        [table]
    );

    const handleDelete = useCallback((id: number) => {
        setSelectedId(id);
        setDeleteDialogVisible(true);
    }, []);

    const confirmDelete = useCallback(async () => {
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
    }, [selectedId, url, dataQuery]);

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
