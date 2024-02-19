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
              transform: translateY(100%);
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
              transform: translateY(-100%);
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
              transform: translateX(100%);
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

        if (data.nodeData.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              setClasses(
                data.node,
                "drag-and-drop-slide-up",
                animationsConfig.duration || 100
              );
              break;
            case "above":
              setClasses(
                data.node,
                "drag-and-drop-slide-down",
                animationsConfig.duration || 100
              );
              break;
            case "left":
              setClasses(
                data.node,
                "drag-and-drop-slide-right",
                animationsConfig.duration || 100
              );
              break;
            case "right":
              setClasses(
                data.node,
                "drag-and-drop-slide-left",
                animationsConfig.duration || 100
              );
              break;
          }

          return;
        }

        if (
          !state.affectedNodes
            .map((x) => x.data.value)
            .includes(data.nodeData.value)
        )
          return;

        const nodeRect = data.node.getBoundingClientRect();

        const nodeIndex = state.affectedNodes.findIndex(
          (x) => x.data.value === data.nodeData.value
        );

        const draggedNodeIndex = state.draggedNode.data.index;

        const ascendingDirection = draggedNodeIndex >= state.targetIndex;

        let adjacentNode;
        if (ascendingDirection) {
          adjacentNode = state.affectedNodes[nodeIndex + 1]
            ? state.affectedNodes[nodeIndex + 1]
            : state.affectedNodes[nodeIndex - 1];
        } else {
          adjacentNode = state.affectedNodes[nodeIndex - 1]
            ? state.affectedNodes[nodeIndex - 1]
            : state.affectedNodes[nodeIndex + 1];
        }

        if (adjacentNode) {
          const xDiff = Math.abs(
            nodeRect.x - adjacentNode.el.getBoundingClientRect().x
          );

          const yDiff = Math.abs(
            nodeRect.y - adjacentNode.el.getBoundingClientRect().y
          );

          if (xDiff > yDiff && ascendingDirection) {
            setClasses(
              data.node,
              "drag-and-drop-slide-right",
              animationsConfig.duration || 100
            );
          } else if (xDiff > yDiff && !ascendingDirection) {
            setClasses(
              data.node,
              "drag-and-drop-slide-left",
              animationsConfig.duration || 100
            );
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              setClasses(
                data.node,
                "drag-and-drop-slide-down",
                animationsConfig.duration || 100
              );
              break;
            case "above":
              setClasses(
                data.node,
                "drag-and-drop-slide-up",
                animationsConfig.duration || 100
              );
              break;
            case "left":
              setClasses(
                data.node,
                "drag-and-drop-slide-left",
                animationsConfig.duration || 100
              );
              break;
            case "right":
              setClasses(
                data.node,
                "drag-and-drop-slide-right",
                animationsConfig.duration || 100
              );
              break;
          }
        }
      },
    };
  };
}

function setClasses(node: Node, nodeClass: string, duration: number) {
  node.classList.add(nodeClass);

  setTimeout(() => {
    if (!state) return;

    state.swappedNodeValue = undefined;

    node.classList.remove(nodeClass);

    state.preventEnter = false;
  }, duration);
}
