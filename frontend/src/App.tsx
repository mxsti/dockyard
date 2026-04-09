import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
