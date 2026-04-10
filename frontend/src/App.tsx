import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ContainerLogs from "./pages/ContainerLogs.tsx";

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                networkMode: 'online'
            },
            mutations: {
                retry: 1,
                networkMode: 'online'
            }
        }
    });

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/:containerId/logs" element={<ContainerLogs />}/>
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
