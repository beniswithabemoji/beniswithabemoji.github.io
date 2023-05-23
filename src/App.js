import logo from "./logo.svg";
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
