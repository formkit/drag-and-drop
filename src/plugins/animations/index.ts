import type { SetupNodeData } from "../../types";

import { state } from "../../index";

export function animations() {
  return () => {
    return {
      tearDownParent() {},
      setupParent() {
        const style = document.createElement("style");

        if (document.head.querySelector("[data-drag-and-drop]")) return;

        style.innerHTML = `
          .drag-and-drop-slide-up {
            animation-name: slideUp;
            animation-duration: 0.2s;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .drag-and-drop-slide-down {
            animation-name: slideDown;
            animation-duration: 0.2s;
          }

          @keyframes slideDown {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0%);
            }
          }

          .drag-and-drop-slide-left {
            animation-name: slideLeft;
            animation-duration: 0.2s;
          }

          @keyframes slideLeft {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0%);
            }
          }

          .drag-and-drop-slide-right {
            animation-name: slideRight;
            animation-duration: 0.2s;
          }

          @keyframes slideRight {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `;

        style.setAttribute("type", "text/css");

        style.setAttribute("data-drag-and-drop", "true");

        document.head.append(style);
      },
      setupNode(data: SetupNodeData) {
        if (!state) return;

        const nodeValue = data.nodeData.value;

        if (nodeValue === state.swappedNodeValue) {
          state.preventSortValue = nodeValue;

          if (state.incomingDirection === "below") {
            data.node.classList.add("drag-and-drop-slide-down");

            state.draggedNode.el.classList.add("drag-and-drop-slide-up");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove("drag-and-drop-slide-up");
              }

              data.node.classList.remove("drag-and-drop-slide-down");
            }, 200);
          } else if (state.incomingDirection === "above") {
            data.node.classList.add("drag-and-drop-slide-up");

            state.draggedNode.el.classList.add("drag-and-drop-slide-down");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove(
                  "drag-and-drop-slide-down"
                );
              }

              data.node.classList.remove("drag-and-drop-slide-up");
            }, 200);
          } else if (state.incomingDirection === "left") {
            data.node.classList.add("drag-and-drop-slide-left");

            state.draggedNode.el.classList.add("drag-and-drop-slide-right");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove(
                  "drag-and-drop-slide-right"
                );
              }

              data.node.classList.remove("drag-and-drop-slide-left");
            }, 200);
          } else if (state.incomingDirection === "right") {
            data.node.classList.add("drag-and-drop-slide-right");

            state.draggedNode.el.classList.add("drag-and-drop-slide-left");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove(
                  "drag-and-drop-slide-left"
                );
              }

              data.node.classList.remove("drag-and-drop-slide-right");
            }, 200);
          }
        }
      },
    };
  };
}
