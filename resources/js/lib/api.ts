import axios from "axios";

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
