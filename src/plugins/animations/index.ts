import type { SetupNodeData, Node } from "../../types";
import type { AnimationsConfig } from "./types";
import { state, parents } from "../../index";

const slideUp = [
  {
    transform: "translateY(100%)",
  },
  {
    transform: "translateY(0)",
  },
];

const slideDown = [
  {
    transform: "translateY(-100%)",
  },
  {
    transform: "translateY(0)",
  },
];

const slideLeft = [
  {
    transform: "translateX(100%)",
  },
  {
    transform: "translateX(0)",
  },
];

const slideRight = [
  {
    transform: "translateX(-100%)",
  },
  {
    transform: "translateX(0)",
  },
];

export function animations(animationsConfig: AnimationsConfig = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setup() {
        parentData.config.remapFinished = () => {};

        if (document.head.querySelector("[data-drag-and-drop]")) return;
      },

      setupNodeRemap<T>(data: SetupNodeData<T>) {
        if (!state) return;

        const duration = animationsConfig.duration || 150;

        console.log("setupNodeRemap");

        if (data.nodeData.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node, slideUp, duration);

              break;
            case "above":
              animate(data.node, slideDown, duration);

              break;
            case "left":
              animate(data.node, slideRight, duration);

              break;
            case "right":
              animate(data.node, slideLeft, duration);

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
            animate(data.node, slideRight, duration);
          } else if (xDiff > yDiff && !ascendingDirection) {
            animate(data.node, slideLeft, duration);
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node, slideDown, duration);

              break;
            case "above":
              animate(data.node, slideUp, duration);

              break;
            case "left":
              animate(data.node, slideLeft, duration);

              break;
            case "right":
              animate(data.node, slideRight, duration);

              break;
          }
        }
      },
    };
  };
}

function animate(
  node: Node,
  animation: Keyframe[] | PropertyIndexedKeyframes,
  duration: number
) {
  node.animate(animation, {
    duration: duration,
  });

  setTimeout(() => {
    if (!state) return;

    state.swappedNodeValue = undefined;

    state.preventEnter = false;
  }, duration);
}
