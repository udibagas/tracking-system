import { axiosInstance } from "./api";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataTableServerResponse<TData> {
    data: TData[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export default async function fetchData<TData>(
    url: string,
    params: Record<string, any> = {}
) {
    const { data } = await axiosInstance.get<DataTableServerResponse<TData>>(
        url,
        { params }
    );

    return data;
}
