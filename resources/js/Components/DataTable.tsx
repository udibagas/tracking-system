import { useDataTableContext } from "@/context/DataTableContext";
import { PaginatedData, RecursivePartial } from "@/types";
import { Table } from "antd";

interface DataTableProps<T> {
    columns: {
        title: string | JSX.Element;
        dataIndex?: string;
        key?: string;
        render?: (text: string, record: T, index: number) => React.ReactNode;
        width?: number;
        align?: "left" | "right" | "center";
    }[];
}

export default function DataTable<T extends { id: number }>({ columns }: DataTableProps<T>) {
    const { useFetch, handleEdit, setPageSize, setCurrentPage, currentPage } = useDataTableContext()
    const { isPending, data } = useFetch<PaginatedData<T>>();

    return (
        <Table
            scroll={{ y: 'calc(100vh - 300px)' }}
            loading={isPending}
            size="small"
            columns={columns}
            dataSource={data?.data ?? []}
            rowKey="id"
            pagination={{
                size: "small",
                current: currentPage,
                total: data?.total ?? 0,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => {
                    setPageSize(pageSize);
                    setCurrentPage(page);
                },
            }}
            onRow={(record: T) => {
                return {
                    onDoubleClick: () => handleEdit(record as RecursivePartial<T>),
                };
            }}
        />
    )
}
