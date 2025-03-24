import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreHorizontal, RefreshCcw, Trash2 } from 'lucide-react';

export type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    },
    {
        id: 'actions',
        header: ({ table }) => (
            <Button variant="ghost" size='sm' onClick={() => table.resetColumnFilters()}>
                <RefreshCcw />
                <span className="sr-only">Refresh</span>
            </Button>
        ),
        size: 40,
        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" size='sm'>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Edit user: ${user.name}`)} >
                            <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Delete user: ${user.name}`)} >
                            <Trash2 /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
