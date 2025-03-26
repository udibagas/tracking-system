import { ColumnDef } from '@tanstack/react-table'
import { CustomerType } from './Index';

export const columns: ColumnDef<CustomerType>[] = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Phone'
    },
]
