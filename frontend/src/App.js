import { BrowserRouter, Routes, Route } from "react-router-dom";

import NoPage from './NoPage'
import Layout from './Layout'

import Home from './Home'
import Create from './Create'
import PlayOverview from './PlayOverview'
import PlayNormal from './PlayNormal'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="play/overview/:worldParam" element={<PlayOverview />} />
                    <Route path="play/normal/:worldParam" element={<PlayNormal />} />
                    <Route path="create/" element={<Create />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
