import {useGetContainers, useStartContainer, useStopContainer} from "../hooks/useContainers.ts";
import ContainerCard from "../components/ContainerCard.tsx";
import {useState} from "react";
import FilterBar, {type StatusFilter} from "../components/FilterBar.tsx";
import useDebounce from "../hooks/useDebounce.ts";

const PROJECT_COLORS = [
    "#4A90D9", "#E85D75", "#50B86C", "#F5A623", "#9B59B6",
    "#1ABC9C", "#E67E22", "#3498DB", "#E74C3C", "#2ECC71",
    "#F39C12", "#8E44AD", "#16A085", "#D35400", "#2980B9",
    "#C0392B", "#27AE60", "#F1C40F", "#7F8C8D", "#34495E",
];


function Dashboard() {
    const [stateFilter, setStateFilter] = useState<StatusFilter>("all");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [projectFilter, setProjectFilter] = useState<string>("all");
    const {data: containers} = useGetContainers({status: stateFilter, name: useDebounce(nameFilter, 300)});
    const filteredContainers = containers?.filter(container =>
        projectFilter === "all" || container.project === projectFilter
    );
    const startContainer = useStartContainer();
    const stopContainer = useStopContainer();
    const runningContainers = filteredContainers?.filter(container => container.state === "running");
    const containerProjects = new Set(containers?.map(container => container.project).filter(project => project !== undefined));
    const projectColorMap = Object.fromEntries(
        [...containerProjects].map((project, index) => [project, PROJECT_COLORS[index % PROJECT_COLORS.length]])
    );
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
                <h1 className="text-2xl">{runningContainers?.length}/{filteredContainers?.length} containers running</h1>
                <FilterBar filterByName={setNameFilter} filterByStatus={setStateFilter} projects={containerProjects} filterByProject={setProjectFilter}/>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {filteredContainers?.map(container => (
                        <ContainerCard
                            container={container}
                            toggleContainer={toggleContainer}
                            projectColorMap={projectColorMap}
                            isLoading={loadingIds.has(container.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
