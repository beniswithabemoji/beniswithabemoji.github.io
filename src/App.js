import React from "react";

import Canvas from "./Components/Canvas";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

function App() {
  return (
    <div className='bg-white dark:bg-gray-800'>
      <Header />
      <Canvas />
      <Footer />
    </div>
  );
}

export default App;
