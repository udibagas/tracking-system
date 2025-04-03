import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Edit, MoreHorizontal, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { useCrud } from "@/hooks/use-crud";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { FormDialog } from "./FormDialog";
import { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export interface FormType {
    form: UseFormReturn<any, any, undefined>;
    schema: z.ZodObject<any, any>;
    defaultValues: object;
    fields: ReactNode;
}

interface CrudTableProps<TData> {
    url: string;
    columns: ColumnDef<TData>[];
    title: string;
    form: FormType;
    showIndexColumn?: boolean;
    showActionColumn?: boolean;
    showToggleColumn?: boolean;
    showSearch?: boolean;
    controls?: React.ReactNode;
}

export function CrudTable<TData extends { id: number }>({
    url,
    columns,
    title,
    form,
    showIndexColumn,
    showActionColumn,
    showToggleColumn,
    showSearch,
}: CrudTableProps<TData>) {
    const [showForm, setShowForm] = useState(false)

    const {
        table,
        dataQuery,
        deleteDialogVisible,
        handleSearch,
        handleDelete,
        refreshData,
        setDeleteDialogVisible,
        confirmDelete,
    } = useCrud<TData>(url, columns);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <div className="flex items-center space-x-2">
                    <Button
                        className="h-8"
                        size="sm"
                        onClick={() => {
                            form.form.reset({})
                            setShowForm(true)
                        }}
                    >
                        <Plus /> Create New Data
                    </Button>

                    {showToggleColumn && <DataTableViewOptions table={table} />}

                    {showSearch && (
                        <Input
                            id="search"
                            placeholder="Search..."
                            className="h-8"
                            onChange={handleSearch}
                        />
                    )}
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
                                {showActionColumn && (
                                    <TableHead
                                        style={{ width: 40 }}
                                        className="text-center"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => refreshData()}
                                        >
                                            <RefreshCcw />
                                            <span className="sr-only">
                                                Refresh
                                            </span>
                                        </Button>
                                    </TableHead>
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {showIndexColumn && (
                                        <TableCell>
                                            {(dataQuery.data?.from ?? 1) +
                                                row.index}
                                            .
                                        </TableCell>
                                    )}
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}

                                    {showActionColumn && (
                                        <TableCell className="text-center">
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            form.form.reset(row.original)
                                                            setShowForm(true)
                                                        }
                                                        }
                                                    >
                                                        <Edit /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(row.original.id)} >
                                                        <Trash2 /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
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
            </div >

            <DataTablePagination table={table} data={dataQuery.data} />

            <DeleteConfirmation
                visible={deleteDialogVisible}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialogVisible(false)}
            />

            <FormDialog
                url={url}
                visible={showForm}
                title={title}
                form={form}
                closeForm={() => {
                    form.form.reset({})
                    setShowForm(false);
                }}>
                {form.fields}
            </FormDialog>
        </>
    );
}
