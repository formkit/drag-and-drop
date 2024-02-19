import type { SetupNodeData, Node } from "../../types";
import type { AnimationsConfig } from "./types";
import { state, parents } from "../../index";

export function animations(animationsConfig: AnimationsConfig = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setupParent() {
        parentData.config.remapFinished = () => {};

        const style = document.createElement("style");

        if (document.head.querySelector("[data-drag-and-drop]")) return;

        const duration = (animationsConfig.duration || 100) / 1000;

        style.innerHTML = `
          .drag-and-drop-slide-up {
            animation-name: slideUp;
            animation-duration: ${duration}s;
          }

          @keyframes slideUp {
            from {
              transform: translateY(50%);
            }
            to {
              transform: translateY(0);
            }
          }

          .drag-and-drop-slide-down {
            animation-name: slideDown;
            animation-duration: ${duration}s;
          }

          @keyframes slideDown {
            from {
              transform: translateY(-50%);
            }
            to {
              transform: translateY(0%);
            }
          }

          .drag-and-drop-slide-left {
            animation-name: slideLeft;
            animation-duration: ${duration}s;
          }

          @keyframes slideLeft {
            from {
              transform: translateX(50%);
            }
            to {
              transform: translateX(0%);
            }
          }

          .drag-and-drop-slide-right {
            animation-name: slideRight;
            animation-duration: ${duration}s;
          }

          @keyframes slideRight {
            from {
              transform: translateX(-50%);
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

        // I will return in the nodevalue is not that of the swapped node
        if (nodeValue !== state.swappedNodeValue) {
          return;
        }

        //state.preventSortValue = nodeValue;

        switch (state.incomingDirection) {
          case "below":
            setClasses(
              data.node,
              state.draggedNode.el,
              "drag-and-drop-slide-down",
              "drag-and-drop-slide-up",
              animationsConfig.duration || 100
            );
            break;
          case "above":
            setClasses(
              data.node,
              state.draggedNode.el,
              "drag-and-drop-slide-up",
              "drag-and-drop-slide-down",
              animationsConfig.duration || 100
            );
            break;
          case "left":
            setClasses(
              data.node,
              state.draggedNode.el,
              "drag-and-drop-slide-left",
              "drag-and-drop-slide-right",
              animationsConfig.duration || 100
            );
            break;
          case "right":
            setClasses(
              data.node,
              state.draggedNode.el,
              "drag-and-drop-slide-right",
              "drag-and-drop-slide-left",
              animationsConfig.duration || 100
            );
            break;
        }
      },
    };
  };
}

function setClasses(
  node: Node,
  draggedNode: Node,
  nodeClass: string,
  draggedNodeClass: string,
  duration: number
) {
  node.classList.add(nodeClass);

  draggedNode.classList.add(draggedNodeClass);

  setTimeout(() => {
    if (!state) return;

    state.swappedNodeValue = undefined;

    draggedNode.classList.remove(draggedNodeClass);

    node.classList.remove(nodeClass);

    state.preventEnter = false;
  }, duration);
}
