import React from "react";
import Test1 from "./components/Test1";
import Test2 from "./components/Test2";
import Test4 from "./components/Test4";
import reactLogo from "/reactjs-icon.svg";

const App: React.FC = () => {
  return (
    <>
      <div className="logo">
        <img src={reactLogo} alt="React Logo" />
      </div>
      <div className="content">
        <Test1 id="react_drag_and_drop" testDescription="dragAndDrop" />
        <div className="divider"></div>
        <Test2 id="react_use_drag_and_drop" testDescription="useDragAndDrop" />
        <div className="divider"></div>
        <Test4 id="react_deferred_sort" testDescription="deferred renders" />
      </div>
    </>
  );
};

export default App;
