import Docker from "dockerode";
import {Readable} from "node:stream";

const docker = new Docker();

export async function listContainers(filters?: Record<string, string>): Promise<ContainerInfo[]> {
    const dockerFilters = filters
        ? Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, [v]]))
        : undefined;

    const containers = await docker.listContainers({
        all: true,
        filters: dockerFilters ?? undefined,
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

export async function getContainerLogStream(containerId: string): Promise<Readable> {
    const container = docker.getContainer(containerId);
    return await container.logs({
        stdout: true,
        stderr: true,
        follow: true,
        tail: 100,
    }) as unknown as Readable;
}
