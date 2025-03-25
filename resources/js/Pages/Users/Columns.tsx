import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { ColumnDef } from '@tanstack/react-table'

export type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const columns: ColumnDef<UserType>[] = [
    {
        header: 'No.',
        accessorFn: (row, index) => {
            console.log(row)
            return index + 1
        },
        size: 40,
    },
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
]
