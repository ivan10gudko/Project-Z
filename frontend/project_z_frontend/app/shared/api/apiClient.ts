import axios from "axios";
import { notify, supabase } from "../lib";

export const apiClient = axios.create({
    paramsSerializer: {
        indexes: null,
    },
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_BACKEND_API_KEY,
    },
    timeout: 30000,
});

apiClient.interceptors.request.use(
    async (config) => {
        const session = await supabase.auth.getSession();
        const token = session?.data.session?.access_token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 402) {
            notify.error("Something went wrong, try later");
        }
        return Promise.reject(error);
    }
);