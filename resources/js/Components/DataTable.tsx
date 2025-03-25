
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import fetchData from "@/lib/fetchData";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "./ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Edit, MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react";
import { remove } from "@/lib/api";

interface DataTableProps<TData, TValue> {
    url: string
    columns: ColumnDef<TData, TValue>[]
    title: string
}

export function DataTable<TData extends { id: number }, TValue>({ url, columns, title }: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [sorting, setSorting] = useState<SortingState>([])
    const [search, setSearch] = useState<string | null>(null)

    const params = useMemo(() => {
        return {
            pageSize: pagination.pageSize,
            page: pagination.pageIndex + 1,
            sort: sorting?.[0]?.id,
            order: sorting?.[0]?.desc ? "desc" : "asc",
            search
        }
    }, [pagination, sorting, search])

    const dataQuery = useQuery({
        queryKey: [url, params],
        queryFn: () => fetchData<TData>(url, params),
        placeholderData: keepPreviousData
    })

    const defaultData = useMemo(() => [], [])

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
    })

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const timeout = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)

        return () => clearTimeout(timeout)
    }

    function handleDelete(id: number | string) {
        remove(`${url}/${id}`)
            .then(() => {
                dataQuery.refetch()
            })
            .catch(() => alert('Failed to delete user'))
    }


    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <div className="flex items-center space-x-2">
                    <Button className="" size='sm'>Create User</Button>
                    <DataTableViewOptions table={table} />
                    <Input placeholder="Search..." className="h-8" onChange={handleSearch} />
                </div>
            </div>

            <div className="border-t border-b">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.column.getSize() }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                                {/* Action column */}
                                <TableHead style={{ width: 40 }} className="text-center">
                                    <Button variant="ghost" size='sm' onClick={() => table.firstPage()}>
                                        <RefreshCcw />
                                        <span className="sr-only">Refresh</span>
                                    </Button>
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="overflow-auto">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" size='sm'>
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => alert(`Edit user: ${row.original.id}`)} >
                                                    <Edit /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(row.original.id)} >
                                                    <Trash2 /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} data={dataQuery.data} />
        </>
    )
}

export function DeleteConfirmation() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
