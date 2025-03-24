import axios from "axios";

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

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default async function fetchData<TData>(
    url: string,
    params: Record<string, any> = {}
) {
    const { data } = await axiosInstance.get<DataTableServerResponse<TData>>(
        url,
        {
            params: {
                pageSize: params.pageSize,
                page: params.pageIndex + 1,
                sort: params.sort?.[0]?.id,
                order: params.sort?.[0]?.desc ? "desc" : "asc",
            },
        }
    );

    return data;
}
