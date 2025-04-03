import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                    Showing {data?.from} - {data?.to} of {data?.total} results
                </span>
            </div>
            {(data?.last_page ?? 1) > 1 &&
                <div className="flex items-center space-x-2">
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-6 w-[110px] text-sm">
                            <SelectValue
                                placeholder={table.getState().pagination.pageSize}
                            />
                        </SelectTrigger>
                        <SelectContent side="top" className="text-sm text-muted-foreground">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}/page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                        Page {data?.current_page} of {data?.last_page}
                    </div>
                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            }
        </div>
    );
}
