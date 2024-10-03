import type { SetupNodeData, Node } from "../../types";
import type { AnimationsConfig } from "./types";
import { state, parents, isDragState } from "../../index";

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
        if (!isDragState(state)) return;

        const duration = animationsConfig.duration || 150;

        if (data.node.data.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideUp, duration);

              break;
            case "above":
              animate(data.node.el, slideDown, duration);

              break;
            case "left":
              animate(data.node.el, slideRight, duration);

              break;
            case "right":
              animate(data.node.el, slideLeft, duration);

              break;
          }

          return;
        }

        if (
          !state.affectedNodes
            .map((x) => x.data.value)
            .includes(data.node.data.value)
        )
          return;

        const nodeRect = data.node.el.getBoundingClientRect();

        const nodeIndex = state.affectedNodes.findIndex(
          (x) => x.data.value === data.node.data.value
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
            animate(data.node.el, slideRight, duration);
          } else if (xDiff > yDiff && !ascendingDirection) {
            animate(data.node.el, slideLeft, duration);
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideDown, duration);

              break;
            case "above":
              animate(data.node.el, slideUp, duration);

              break;
            case "left":
              animate(data.node.el, slideLeft, duration);

              break;
            case "right":
              animate(data.node.el, slideRight, duration);

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
