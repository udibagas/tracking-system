import React from "react";
import { Modal, Form, Input, Select } from "antd";
import CancelButton from "@/components/buttons/CancelButton";
import SaveButton from "@/components/buttons/SaveButton";
import { CustomFormProps, UserType } from "@/types";

const CustomerForm: React.FC<CustomFormProps<UserType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
    return (
        <Modal
            width={450}
            title={isEditing ? "Edit User" : "Create New User"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
                <SaveButton label={isEditing ? "Update" : "Create"} key='submit' />,
            ]}
        >
            <Form
                id="form"
                form={form}
                onFinish={onOk}
                requiredMark={false}
                labelCol={{ span: 8 }}
            >
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    validateStatus={errors.name ? "error" : ""}
                    help={errors.name?.join(", ")}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.join(", ")}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    validateStatus={errors.phone ? "error" : ""}
                    help={errors.phone?.join(", ")}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal >
    );
};

export default CustomerForm;
