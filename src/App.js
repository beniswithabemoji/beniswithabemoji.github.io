import React from "react";

import Footer from "./Components/Footer";
import Header from "./Components/Header";

function App() {
  return (
    <div className='bg-white dark:bg-zinc-950 flex flex-col h-full'>
      <Header />
      <Footer />
    </div>
  );
}

export default App;
