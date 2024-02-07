import React from "react";

import Test1 from "./components/Test1";

import reactLogo from "/reactjs-icon.svg";

function App() {
  return (
    <>
      <div className="logo">
        <img src={reactLogo} alt="React Logo" />
      </div>
      <div className="content">
        <Test1
          id="react_1"
          testDescription="Init parent by passing in the parent elmeent directly to `dragAndDrop` function."
        />
        <div className="divider"></div>
      </div>
    </>
  );
}

export default App;
