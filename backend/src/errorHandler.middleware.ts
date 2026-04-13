import type {Request, Response, NextFunction} from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.message?.includes("ECONNREFUSED")) {
        res.status(503).json({error: "Docker daemon not reachable"});
    } else if (err.message?.includes("not running")) {
        res.status(409).json({error: "Container not running"});
    } else if (err.message?.includes("No such container")) {
        res.status(404).json({error: "Container not found"});
    } else {
        res.status(500).json({error: "Internal server error"});
    }
}
