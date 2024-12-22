import {Route, Routes} from "react-router-dom";
import {Widget} from "./widget/Widget.tsx";
import {Generator} from "./generator/Generator.tsx";

export const App = () => {
  return <>
    <Routes>
      <Route path="/widget/generator" element={<Generator/>}/>
      <Route path="/widget/" element={<Widget/>}/>
    </Routes>
  </>
}