import type { SetupNodeData } from "../../types";

import { state } from "../../index";

export function animations(config = {}) {
  return (parent: HTMLElement) => {
    return {
      tearDownParent() {},
      setupParent() {
        const style = document.createElement("style");

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

        document.head.append(style);
      },
      setupNode(data: SetupNodeData) {
        if (!state) return;

        const nodeValue = data.nodeData.value;

        if (nodeValue === state.swappedNodeValue) {
          state.preventSortValue = nodeValue;

          if (state.incomingDirection === "below") {
            data.node.classList.add("slide-down");

            state.draggedNode.el.classList.add("slide-up");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove("slide-up");
              }

              data.node.classList.remove("slide-down");
            }, 200);
          } else if (state.incomingDirection === "above") {
            data.node.classList.add("slide-up");

            state.draggedNode.el.classList.add("slide-down");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove("slide-down");
              }

              data.node.classList.remove("slide-up");
            }, 200);
          } else if (state.incomingDirection === "left") {
            data.node.classList.add("slide-left");

            state.draggedNode.el.classList.add("slide-right");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove("slide-right");
              }

              data.node.classList.remove("slide-left");
            }, 200);
          } else if (state.incomingDirection === "right") {
            data.node.classList.add("slide-right");

            state.draggedNode.el.classList.add("slide-left");

            setTimeout(() => {
              if (state) {
                state.preventSortValue = undefined;

                state.draggedNode.el.classList.remove("slide-left");
              }

              data.node.classList.remove("slide-right");
            }, 200);
          }
        }
      },
    };
  };
}
