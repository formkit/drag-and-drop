import type { Page } from "@playwright/test";

interface El {
  id: string;
  position: string;
}

interface DragDropData {
  originEl: El;
  destinationEl: El;
  dragStart?: boolean;
  drop?: boolean;
}

/**
 * Utility function used to simulate drag and drop events.
 *
 * @param page
 * @param param1
 */
export async function drag(page: Page, data: DragDropData): Promise<void> {
  // Shouldn't need to do this, but leaving it for now 🤷‍♂️
  await new Promise((resolve) => setTimeout(resolve, 25));
  return page.evaluate(async (data) => {
    const originElement = document.getElementById(data.originEl.id);

    const destinationElement = document.getElementById(data.destinationEl.id);

    if (!originElement || !destinationElement) return;

    const dataTransfer = new DataTransfer();

    const getEventProps = (element: Element) => {
      const rect = element.getBoundingClientRect();

      const [x, y] = [rect.x + rect.width / 2, rect.y + rect.height / 2];

      return {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        dataTransfer,
        screenX: x,
        screenY: y,
      };
    };

    if (data.dragStart) {
      originElement.dispatchEvent(
        new DragEvent("dragstart", getEventProps(originElement))
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Dragover the origin element
    originElement.dispatchEvent(
      new DragEvent("dragover", getEventProps(originElement))
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    const destinationEventProps = getEventProps(destinationElement);

    // Dragover the destination target
    destinationElement.dispatchEvent(
      new DragEvent("dragover", destinationEventProps)
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Emulate a real drag over event where dragover will fire on the same
    // destination coordinates when the drag and drop operation is completed
    // (sort or transfer).
    destinationElement.dispatchEvent(
      new DragEvent("dragover", destinationEventProps)
    );

    if (data.drop) {
      destinationElement.dispatchEvent(
        new DragEvent("drop", getEventProps(destinationElement))
      );

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }, data);
}

/**
 * Utility function used to simulate touch events.
 *
 * @param page
 * @param param1
 */
export async function syntheticDrag(
  page: Page,
  data: DragDropData
): Promise<void> {
  // Shouldn't need to do this, but leaving it for now 🤷‍♂️
  await new Promise((resolve) => setTimeout(resolve, 25));
  return page.evaluate(async (data) => {
    const originElement = document.getElementById(data.originEl.id);
    const destinationElement = document.getElementById(data.destinationEl.id);

    if (!originElement || !destinationElement) return;

    const getEventProps = (element: Element, position: string) => {
      const rect = element.getBoundingClientRect();
      let x = rect.x;
      let y = rect.y;

      // Calculate position based on requested position
      switch (position) {
        case "center":
          x += rect.width / 2;
          y += rect.height / 2;
          break;
        case "top":
          x += rect.width / 2;
          y += 5;
          break;
        case "bottom":
          x += rect.width / 2;
          y += rect.height - 5;
          break;
        case "left":
          x += 5;
          y += rect.height / 2;
          break;
        case "right":
          x += rect.width - 5;
          y += rect.height / 2;
          break;
      }

      return {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
      };
    };

    // Initial touch position
    const startProps = getEventProps(originElement, data.originEl.position);

    if (data.dragStart) {
      // Start the touch
      originElement.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          ...startProps,
        })
      );
    }

    // Small movement to trigger drag
    originElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        ...startProps,
        clientX: startProps.clientX + 5,
        clientY: startProps.clientY + 5,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Move to destination
    const destProps = getEventProps(
      destinationElement,
      data.destinationEl.position
    );

    destinationElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        ...destProps,
      })
    );

    destinationElement.dispatchEvent(
      new PointerEvent("pointerover", {
        pointerId: 1,
        ...destProps,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Additional move at destination to ensure hover state
    destinationElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        ...destProps,
      })
    );

    if (data.drop) {
      // End the touch
      destinationElement.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          ...destProps,
        })
      );
    }
  }, data);
}
