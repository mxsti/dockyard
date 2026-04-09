import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import type {ContainerInfo} from "../types.ts";
import {fetchBackend} from "../utils/api.ts";

export const useGetContainers = () => {
    return useQuery({
        queryKey: ['containers'],
        queryFn: async (): Promise<ContainerInfo[]> => {
            const res = await fetchBackend("/containers");
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
