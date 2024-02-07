import { useState } from "react";
import reactLogo from "/reactjs-icon.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <div className="header">
          <div className="logo">
            <img src={reactLogo} alt="React Logo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
