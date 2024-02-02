import type { SetupNodeData } from "../../types";

/**
 * Initializes a drop zone based on the parent.
 *
 * @returns void
 */
export function animate(config: any) {
  return (parent: HTMLElement) => {
    return {
      setupParent() {
        console.log("setup parent");
      },

      tearDownParent() {},

      setupNode(data: SetupNodeData) {
        //console.log("re setup node", data.node.id);
        //data.node.classList.add("animate");
      },
    };
  };
}
