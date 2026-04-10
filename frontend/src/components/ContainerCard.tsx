import type {ContainerInfo} from "../types.ts";
import {useNavigate} from "react-router-dom";

interface ContainerCardProps {
    container: ContainerInfo;
    isLoading: boolean;
    projectColorMap: { [key: string]: string };
    toggleContainer: (containerId: string, action: "start" | "stop") => void;
}

export function ContainerCard({container, projectColorMap, toggleContainer, isLoading}: ContainerCardProps) {
    const isRunning = container.state === "running";
    const projectColor = container.project ? projectColorMap[container.project] : "";
    const navigate = useNavigate();

    if (!container) {
        return <></>;
    }

    return (
        <div key={container.id} className="bevel-outset bg-card p-2 text-[11px] flex flex-col cursor-pointer"
             style={{borderLeft: `4px solid ${projectColor}`}} onClick={() => navigate(`${container.id}/logs`)}>
            <div className="mb-1.5 flex items-center">
                <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                        background: isRunning
                            ? "var(--color-status-running)"
                            : "var(--color-status-stopped)",
                    }}
                />
                <span className="flex-1 truncate font-bold">{container.name}</span>
                <span>{container.status}</span>
            </div>
            <div className="mb-1 text-muted-foreground">
                {container.image}
            </div>
            <div className="mb-1 text-muted-foreground">
                {container.ports.map((port) => (<p>{port[0]}:{port[1]}</p>))}
            </div>
            <button
                className="win-button w-full mt-auto hover:opacity-70"
                disabled={isLoading}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleContainer(container.id, isRunning ? "stop" : "start")
                }}
            >
                {isRunning ? "Stop" : "Start"}
            </button>
        </div>
    );
}

export default ContainerCard;
