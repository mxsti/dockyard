import Docker from "dockerode";

const docker = new Docker();

export async function listContainers(filters?: Record<string, string[]>): Promise<ContainerInfo[]> {
    const containers = await docker.listContainers({
        all: true,
        filters: filters ?? undefined,
    });
    return containers.map((container) => ({
        id: container.Id,
        name: container.Names[0],
        image: container.Image,
        state: container.State as ContainerState,
        ports: container.Ports
            .filter(p => p.IP !== '::') // filter out ipv6
            .map(port => [port.PrivatePort, port.PublicPort]),
        status: container.Status,
    }));
}

export async function startContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.start();
}

export async function stopContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.stop();
}
