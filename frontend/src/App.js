import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home'
import Play from './Play'
import NoPage from './NoPage'
import Layout from './Layout'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="play/:worldParam" element={<Play />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
