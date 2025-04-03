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

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export function create(url: string, data: any) {
    return axiosInstance.post(url, data);
}

export function get(url: string) {
    return axiosInstance.get(url);
}

export function update(url: string, data: any) {
    return axiosInstance.put(url, data);
}

export function remove(url: string) {
    return axiosInstance.delete(url);
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
