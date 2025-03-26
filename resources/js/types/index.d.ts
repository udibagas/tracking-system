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
