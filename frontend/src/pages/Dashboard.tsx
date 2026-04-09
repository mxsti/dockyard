import {useGetContainers, useStartContainer, useStopContainer} from "../hooks/useContainers.ts";
import ContainerCard from "../components/ContainerCard.tsx";
import {useState} from "react";

function Dashboard() {
    const {data: containers, isLoading} = useGetContainers();
    const startContainer = useStartContainer();
    const stopContainer = useStopContainer();
    const runningContainers = containers?.filter(container => container.state === "running");
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const toggleContainer = (containerId: string, action: "start" | "stop") => {
        setLoadingIds(prev => new Set(prev).add(containerId));

        const mutation = action === "start" ? startContainer : stopContainer;
        mutation.mutate(containerId, {
            onSettled: () => {
                setLoadingIds(prev => {
                    const next = new Set(prev);
                    next.delete(containerId);
                    return next;
                });
            }
        });
    }

    if (isLoading || !containers) {
        return <></>
    }

    return (
        <div className="flex justify-center mt-4">
            <div className="w-[80%]">
                <h1 className="text-xl">{runningContainers?.length}/{containers.length} containers running</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {containers.map(container => (
                        <ContainerCard
                            container={container}
                            toggleContainer={toggleContainer}
                            isLoading={loadingIds.has(container.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
