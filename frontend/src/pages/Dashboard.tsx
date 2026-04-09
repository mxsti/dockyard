import {useGetContainers, useStartContainer, useStopContainer} from "../hooks/useContainers.ts";
import ContainerCard from "../components/ContainerCard.tsx";
import {useState} from "react";
import FilterBar, {type StatusFilter} from "../components/FilterBar.tsx";
import useDebounce from "../hooks/useDebounce.ts";

function Dashboard() {
    const [stateFilter, setStateFilter] = useState<StatusFilter> ("all");
    const [nameFilter, setNameFilter] = useState<string> ("");
    const {data: containers } = useGetContainers({status: stateFilter, name: useDebounce(nameFilter, 300)});
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

    return (
        <div className="flex justify-center mt-4">
            <div className="w-[80%]">
                <h1 className="text-2xl">{runningContainers?.length}/{containers?.length} containers running</h1>
                <FilterBar filterByName={setNameFilter} filterByStatus={setStateFilter}/>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {containers?.map(container => (
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
