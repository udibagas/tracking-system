
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import fetchData from "@/lib/fetchData";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    url: string
    columns: ColumnDef<TData, TValue>[]
    title: string
}

export function DataTable<TData, TValue>({
    url,
    columns,
    title
}: DataTableProps<TData, TValue>) {
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
        }, 1000)

        return () => clearTimeout(timeout)
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
