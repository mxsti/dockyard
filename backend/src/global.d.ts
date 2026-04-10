interface ContainerInfo {
    id: string;
    name: string;
    image: string;
    ports: [number, number][];
    state: ContainerState;
    status: string;
    project: string | undefined;
}

type ContainerState = "created" | "running" | "paused" | "restarting" | "exited" | "removing" | "dead";
