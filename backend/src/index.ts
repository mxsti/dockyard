import express from "express";
import cors from "cors";
import {getContainerLogStream, listContainers, startContainer, stopContainer} from "./docker.service";
import {errorHandler} from "./errorHandler.middleware";

const app = express();
if (process.env.NODE_ENV !== "production") {
    app.use(cors({origin: "http://localhost:5173"}));
}
const PORT = 3333;

app.use(express.json());

app.get("/containers", async (req, res) => {
    const filters: Record<string, string> = {};
    if (req.query.name) filters.name = req.query.name as any;
    if (req.query.status) filters.status = req.query.status as any;
    const containers = await listContainers(filters);
    res.status(200).json(containers);
});

app.get("/containers/:containerId/logs", async (req, res) => {
    const stream = await getContainerLogStream(req.params.containerId);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    let remaining = Buffer.alloc(0);
    stream.on("data", (chunk: Buffer) => {
        let buffer = Buffer.concat([remaining, chunk]);
        let offset = 0;

        while (offset + 8 <= buffer.length) {
            const size = buffer.readUInt32BE(offset + 4);
            if (offset + 8 + size > buffer.length) break;
            const content = buffer.slice(offset + 8, offset + 8 + size).toString("utf-8").trim();
            if (content) {
                res.write(`data: ${content}\n\n`);
            }
            offset += 8 + size;
        }
        remaining = buffer.slice(offset);
    });

    stream.on("end", () => res.end());
    stream.on("close", () => res.end());
    req.on("close", () => stream.destroy());
});

app.post("/containers/:containerId/start", async (req, res) => {
    await startContainer(req.params.containerId);
    res.sendStatus(204);
});

app.post("/containers/:containerId/stop", async (req, res) => {
    await stopContainer(req.params.containerId);
    res.sendStatus(204);
});

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
