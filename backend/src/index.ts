import express from "express";
import cors from "cors";
import {listContainers, startContainer, stopContainer} from "./docker.service";

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

app.post("/containers/:containerId/start", async (req, res) => {
    try {
        await startContainer(req.params.containerId);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).json({error: "container not found or already running"});
    }
});

app.post("/containers/:containerId/stop", async (req, res) => {
    try {
        await stopContainer(req.params.containerId);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).json({error: "container not found or already stopped"});
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
