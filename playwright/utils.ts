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
        new DragEvent("dragend", getEventProps(destinationElement))
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

    let pointerStartObj;

    if (originElement) {
      pointerStartObj = new PointerEvent("pointerdown", {
        pointerId: 1,
        ...getEventProps(originElement),
      });
    }

    if (!destinationElement) return;

    const pointerMoveObj = new PointerEvent("pointermove", {
      pointerId: 1,
      ...getEventProps(destinationElement),
    });

    if (data.dragStart) {
      originElement.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: pointerStartObj.clientX,
          clientY: pointerStartObj.clientY,
          cancelable: true,
          bubbles: true,
        })
      );
    }

    originElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        cancelable: true,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    destinationElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: pointerMoveObj.clientX,
        clientY: pointerMoveObj.clientY,
        cancelable: true,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    destinationElement.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: pointerMoveObj.clientX,
        clientY: pointerMoveObj.clientY,
        cancelable: true,
        bubbles: true,
      })
    );

    if (data.drop) {
      destinationElement.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          clientX: pointerMoveObj.clientX,
          clientY: pointerMoveObj.clientY,
          cancelable: true,
          bubbles: true,
        })
      );
    }
  }, data);
}
