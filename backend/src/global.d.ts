interface ContainerInfo {
    id: string;
    name: string;
    image: string;
    ports: [number, number][];
    state: ContainerState;
    status: string;
}

type ContainerState = "created" | "running" | "paused" | "restarting" | "exited" | "removing" | "dead";
