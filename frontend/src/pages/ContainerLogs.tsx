import {useNavigate, useParams} from "react-router-dom";
import {useContainerLogs} from "../hooks/useContainers.ts";
import {useEffect, useRef} from "react";

function ContainerLogs() {
    const {containerId} = useParams();
    const logs = useContainerLogs(containerId);
    const navigate = useNavigate();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [logs])

    return (
        <div className="flex flex-col m-4">
            <div className="sticky top-0 bg-background py-2 flex items-center gap-4">
                <button onClick={() => navigate("/")} className="win-button w-fit hover:opacity-70">Zurück</button>
                <h2 className="text-xl">Logstream</h2>
            </div>
            <div>
                {logs.map((log, index) => (
                    <p key={index}><span className="font-bold mr-4">{index + 1}</span>{log}</p>
                ))}
            </div>
            <div ref={bottomRef}/>
        </div>
    )

}

export default ContainerLogs;
