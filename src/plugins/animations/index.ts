import type { SetupNodeData } from "../../types";

import { state } from "../../index";

export function animations(config = {}) {
  return (parent: HTMLElement) => {
    return {
      tearDownParent() {},
      setupParent() {
        //parent.style.position = "relative";
        //parent.style.overflow = "hidden";
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
