import { AxiosError } from "axios";
import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export type ServerErrorResponse = AxiosError & {
    status: number;
    code: string;
    response: {
        data: {
            message: string;
            errors?: Record<string, string[]>;
        };
    };
};

export type PaginatedData<T> = {
    from: number;
    to: number;
    page: number;
    data: T[];
    total: number;
};

export type AxiosErrorResponseType = {
    message: string;
    errors?: Record<string, string[]>;
};

export type RecursivePartial<T> = NonNullable<T> extends object
    ? {
          [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
              ? RecursivePartial<U>[]
              : NonNullable<T[P]> extends object
              ? RecursivePartial<T[P]>
              : T[P];
      }
    : T;

export type CustomFormProps<T> = {
    visible: boolean;
    isEditing: boolean;
    onCancel: () => void;
    onOk: (values: T) => void;
    errors: { [key: string]: string[] };
    form: FormInstance<T>;
};

export type UserType = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
};

export type CustomerType = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

export type FileType = {
    filename: string;
    mimetype: string;
    originalname: string;
    path: string;
    url: string;
    size: number;
};
