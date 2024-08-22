import {Route, Routes} from "react-router-dom";
import {Widget} from "./pages/Widget.tsx";
import {Generator} from "./pages/Generator.tsx";

export const App = () => {
    return <>
        <Routes>
            <Route path="/widget/generator" element={<Generator/>}/>
            <Route path="/widget/" element={<Widget/>}/>
        </Routes>
    </>
}