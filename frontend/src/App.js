import { BrowserRouter, Routes, Route } from "react-router-dom";

import NoPage from './NoPage'
import Layout from './Layout'

import Home from './Home'
import Play from './Play'
import Create from './Create'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="play/:worldParam" element={<Play />} />
                    <Route path="create/" element={<Create />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
