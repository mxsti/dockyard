import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import type {ContainerInfo} from "../types.ts";
import {fetchBackend} from "../utils/api.ts";
import {useEffect, useState} from "react";

export const useGetContainers = (filters?: Record<string, string>) => {
    return useQuery({
        queryKey: ['containers', filters],
        queryFn: async (): Promise<ContainerInfo[]> => {
            const params = new URLSearchParams();
            if (filters?.name) params.set('name', filters.name);
            if (filters?.status) {
                const status = filters.status === "all" ? "" : filters.status;
                params.set('status', status);
            }
            const query = params.toString();
            const res = await fetchBackend(`/containers${query ? `?${query}` : ''}`);
            return res.json();
        }
    });
};

export const useStartContainer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (containerId: string) => {
            const res = await fetchBackend(`/containers/${containerId}/start`, {method: 'POST'});
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['containers']});
        }
    });
};

export const useStopContainer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (containerId: string) => {
            const res = await fetchBackend(`/containers/${containerId}/stop`, {method: 'POST'});
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['containers']});
        }
    });
};

export const useContainerLogs = (containerId?: string) => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!containerId) return;

        setLogs([]);
        const url = `${import.meta.env.VITE_BACKEND_URL || ''}/containers/${containerId}/logs`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (e) => {
            setLogs((prev: string[]) => [...prev, e.data]);
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => eventSource.close();
    }, [containerId]);

    return logs;
};
