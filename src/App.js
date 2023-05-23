import React from "react";

import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Canvas from "./Components/Canvas";
import AboutMe from "./Components/AboutMe";

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <React.StrictMode>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutMe />} />
          </Routes>
        </HashRouter>
      </React.StrictMode>
      <Canvas></Canvas>
    </div>
  );
}

export default App;
