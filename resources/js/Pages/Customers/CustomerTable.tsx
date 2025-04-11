import { ReloadOutlined } from "@ant-design/icons";
import ActionButton from "@/components/buttons/ActionButton";
import AddButton from "@/components/buttons/AddButton";
import { useDataTableContext } from "@/context/DataTableContext";
import { UserType } from "@/types";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import CustomerForm from "./CustomerForm";
import { Input } from "antd";

export default function UserTable() {
    const {
        currentPage,
        showForm,
        isEditing,
        errors,
        form,
        handleModalClose,
        handleSubmit,
        refreshData,
        handleEdit,
        handleDelete,
        handleAdd,
        setSearch,
        setCurrentPage,
    } = useDataTableContext()

    const columns = [
        {
            title: "No.",
            width: 60,
            render: (_: string, __: UserType, index: number) => (currentPage - 1) * 10 + index + 1,
        },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        {
            title: <ReloadOutlined onClick={refreshData} />,
            key: "action",
            align: "center" as const,
            width: 80,
            render: (_: string, record: UserType) => (
                <ActionButton
                    onEdit={() => handleEdit(record)}
                    onDelete={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Manage Customers">
                <AddButton label="Create New Customer" onClick={handleAdd} />
                <Input.Search
                    placeholder="Search"
                    allowClear
                    onSearch={(value) => {
                        setCurrentPage(1)
                        setSearch(value)
                    }}
                    style={{ width: 200 }}
                />
            </PageHeader>
            <DataTable<UserType> columns={columns} />
            <CustomerForm
                visible={showForm}
                isEditing={isEditing}
                errors={errors}
                form={form}
                onCancel={handleModalClose}
                onOk={handleSubmit}
            />
        </>
    )
}
