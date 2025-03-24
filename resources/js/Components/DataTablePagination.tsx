import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { DataTableServerResponse } from "@/lib/fetchData";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    data: DataTableServerResponse<TData> | undefined;
}

export function DataTablePagination<TData>({
    table,
    data,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                    Showing {data?.from} - {data?.to} of {data?.total} results
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                    Page {data?.current_page} of {data?.last_page}
                </div>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}/page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronsLeft />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronsRight />
                </Button>
            </div>
        </div>
    );
}
