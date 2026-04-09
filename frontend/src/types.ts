export type ContainerInfo =
    {
        id: string;
        name: string;
        image: string;
        ports: [number, number][];
        state: ContainerState;
        status: string;
    }


export type ContainerState = "created" | "running" | "paused" | "restarting" | "exited" | "removing" | "dead";

