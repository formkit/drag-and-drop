import Test1 from "./components/Test1.tsx";
import Test2 from "./components/Test2.tsx";

export default function App() {
  return (
    <>
      <div class="logo">
        <img src="/solidjs-icon.svg" alt="Solid Logo" />
      </div>
      <div class="content">
        <Test1 id="solid_drag_and_drop" testDescription="dragAndDrop" />
        <div class="divider"></div>
        <Test2 id="solid_use_drag_and_drop" testDescription="useDragAndDrop" />
      </div>
    </>
  );
}
