import { BrowserRouter } from "react-router-dom";
import { Generator } from "./generator/Generator.tsx";
import "./styles/app.less";
import ReactDOM from "react-dom/client";
import { createContext } from "react";

export const LanguageContext = createContext(null);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Generator />
  </BrowserRouter>,
);
