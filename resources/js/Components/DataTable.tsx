import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import fetchData from "@/lib/fetchData";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "./ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Edit, MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react";
import { remove } from "@/lib/api";
import { toast } from "sonner";
import { ServerErrorResponse } from "@/types";

interface DataTableProps<TData, TValue> {
    url: string;
    columns: ColumnDef<TData, TValue>[];
    title: string;
    showIndexColumn?: boolean;
    showActionColumn?: boolean;
    showToggleColumn?: boolean;
    showSearch?: boolean;
    controls?: React.ReactNode;
    onEdit?: (data: TData) => void;
}

export function DataTable<TData extends { id: number }, TValue>({
    url,
    columns,
    title,
    showIndexColumn,
    showActionColumn,
    showToggleColumn,
    showSearch,
    controls,
    onEdit,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState<string | null>(null);

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
        setSearch('')
        document.querySelector<HTMLInputElement>('#search')!.value = ''
        table.setPageIndex(0)
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const timeout = setTimeout(() => {
            table.setPageIndex(0);
            setSearch(e.target.value);
        }, 500);

        return () => clearTimeout(timeout);
    }

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    function handleDelete(id: number) {
        setSelectedId(id);
        setDeleteDialogVisible(true);
    }

    async function confirmDelete() {
        if (selectedId !== null) {
            try {
                await remove(`${url}/${selectedId}`)
                setDeleteDialogVisible(false);
                dataQuery.refetch();
                toast.success("User deleted successfully", {
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

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <div className="flex items-center space-x-2">
                    {controls}

                    {showToggleColumn && <DataTableViewOptions table={table} />}

                    {showSearch && <Input
                        id="search"
                        placeholder="Search..."
                        className="h-8"
                        onChange={handleSearch}
                    />}
                </div>
            </div>

            <div className="border-t border-b">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {showIndexColumn && (
                                    <TableHead className="w-8">No.</TableHead>
                                )}
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.column.getSize(),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                                {showActionColumn && <TableHead
                                    style={{ width: 40 }}
                                    className="text-center"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => refreshData()}
                                    >
                                        <RefreshCcw />
                                        <span className="sr-only">Refresh</span>
                                    </Button>
                                </TableHead>}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="overflow-auto">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {showIndexColumn && <TableCell>
                                        {(dataQuery.data?.from ?? 1) +
                                            row.index}
                                        .
                                    </TableCell>}
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}

                                    {showActionColumn && <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    size="sm"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                                                    <Edit /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                                    <Trash2 /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} data={dataQuery.data} />

            <DeleteConfirmation
                visible={deleteDialogVisible}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialogVisible(false)}
            />
        </>
    );
}

interface DeleteConfirmationProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmation({
    visible,
    onConfirm,
    onCancel,
}: DeleteConfirmationProps) {
    return (
        <AlertDialog open={visible} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
