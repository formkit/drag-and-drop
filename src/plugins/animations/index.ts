import type { SetupNodeData, Node } from "../../types";
import type { AnimationsConfig } from "./types";
import { state, parents, isDragState, isSynthDragState } from "../../index";
import { eq } from "../../utils";

const slideAnimations = new WeakMap<Node, Set<Animation>>();

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
        if (animationsConfig.drop) {
          parentData.on("dragStarted", () => {
            if (!isDragState(state) || state.initialParent.el !== parent) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const dragState = state;
            const controller = new AbortController();
            const options = { capture: true, signal: controller.signal };
            let point = { ...dragState.coordinates };

            document.addEventListener("dragover", (event) => {
              point = { x: event.clientX, y: event.clientY };
            }, options);

            const release = (event: Event) => {
              if (isSynthDragState(dragState) !== (event.type === "pointerup")) return;
              const releaseRect = isSynthDragState(dragState)
                ? dragState.clonedDraggedNode.getBoundingClientRect()
                : { left: point.x - dragState.startLeft, top: point.y - dragState.startTop };
              const left = releaseRect.left;
              const top = releaseRect.top;
              controller.abort();

              requestAnimationFrame(() => {
                const target = parents.get(dragState.currentParent.el);
                if (!target) return;
                const available = [...target.enabledNodes];
                const elements = dragState.draggedNodes.flatMap((dragged) => {
                  const index = available.findIndex((node) => eq(node.data.value, dragged.data.value));
                  return index < 0 ? [] : [available.splice(index, 1)[0].el];
                });
                // Finish existing sort animations before measuring the destination.
                elements.forEach((el) => slideAnimations.get(el)?.forEach((animation) => animation.cancel()));
                const destinations = elements.map((el) => el.getBoundingClientRect());
                const drop = typeof animationsConfig.drop === "object" ? animationsConfig.drop : {};
                elements.forEach((el, index) => {
                  const rect = destinations[index];
                  el.animate([
                    { transform: `translate(${left - rect.left}px, ${top - rect.top}px)` },
                    { transform: "translate(0px, 0px)" },
                  ], { duration: drop.duration ?? 180, easing: drop.easing ?? "ease-in-out" });
                });
              });
            };
            document.addEventListener("drop", release, options);
            document.addEventListener("pointerup", release, options);
            document.addEventListener("pointercancel", () => {
              if (isSynthDragState(dragState)) controller.abort();
            }, options);
            document.addEventListener("dragend", () => controller.abort(), options);
          });
        }
        if (document.head.querySelector("[data-drag-and-drop]")) return;
      },

      setupNodeRemap<T>(data: SetupNodeData<T>) {
        if (!isDragState(state)) return;

        const duration = animationsConfig.duration || 150;

        const easing = animationsConfig.easing || "ease-in-out";

        if (data.node.data.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideUp, duration, easing);

              break;
            case "above":
              animate(data.node.el, slideDown, duration, easing);

              break;
            case "left":
              animate(data.node.el, slideRight, duration, easing);

              break;
            case "right":
              animate(data.node.el, slideLeft, duration, easing);

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
            animate(data.node.el, slideRight, duration, easing);
          } else if (xDiff > yDiff && !ascendingDirection) {
            animate(data.node.el, slideLeft, duration, easing);
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideDown, duration, easing);

              break;
            case "above":
              animate(data.node.el, slideUp, duration, easing);

              break;
            case "left":
              animate(data.node.el, slideLeft, duration, easing);

              break;
            case "right":
              animate(data.node.el, slideRight, duration, easing);

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
  duration: number,
  easing: string
) {
  if (!state) return;

  state.preventEnter = true;

  const runningAnimation = node.animate(animation, {
    duration: duration,
    easing,
  });
  const animations = slideAnimations.get(node) ?? new Set<Animation>();
  animations.add(runningAnimation);
  slideAnimations.set(node, animations);
  runningAnimation.addEventListener("finish", () => animations.delete(runningAnimation));
  runningAnimation.addEventListener("cancel", () => animations.delete(runningAnimation));

  setTimeout(() => {
    if (!state) return;

    state.preventEnter = false;
  }, duration);
}
