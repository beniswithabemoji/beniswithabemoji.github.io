import logo from "./logo.svg";
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Canvas from "./Components/Canvas";

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </HashRouter>
      </React.StrictMode>
      <Canvas></Canvas>
    </div>
  );
}

export default App;
