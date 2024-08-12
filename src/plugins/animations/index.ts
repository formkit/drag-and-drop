import type { SetupNodeData, Node } from "../../types";
import type { AnimationsConfig } from "./types";
import { state, parents } from "../../index";

export function animations(animationsConfig: Partial<AnimationsConfig> = {}) {
  const slideUp = [
    {
      transform: `translateY(${animationsConfig.yScale || 50}%)`,
    },
    {
      transform: `translateY(${animationsConfig.yScale || 0}%)`,
    },
  ];

  const slideDown = [
    {
      transform: `translateY(-${animationsConfig.yScale || 50}%)`,
    },
    {
      transform: `translateY(${animationsConfig.yScale || 0}%)`,
    },
  ];

  const slideLeft = [
    {
      transform: `translateX(${animationsConfig.xScale || 50}%)`,
    },
    {
      transform: `translateX(${animationsConfig.xScale || 0}%)`,
    },
  ];

  const slideRight = [
    {
      transform: `translateX(-${animationsConfig.xScale || 50}%)`,
    },
    {
      transform: `translateX(${animationsConfig.xScale || 0}%)`,
    },
  ];
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setup() {
        if (document.head.querySelector("[data-drag-and-drop]")) return;
      },

      setupNodeRemap<T>(data: SetupNodeData<T>) {
        if (!state) return;

        const duration = animationsConfig.duration || 150;

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
  if (!state) return;

  state.preventEnter = true;

  node.animate(animation, {
    duration: duration,
    easing: "ease-in-out",
  });

  setTimeout(() => {
    if (!state) return;

    state.preventEnter = false;
  }, duration);
}
