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
export async function dragDrop(page: Page, data: DragDropData): Promise<void> {
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

    // Dragover the origin element
    originElement.dispatchEvent(
      new DragEvent("dragover", getEventProps(originElement))
    );

    const destinationEventProps = getEventProps(destinationElement);

    // Dragover the destination target
    destinationElement.dispatchEvent(
      new DragEvent("dragover", destinationEventProps)
    );

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
    }
  }, data);
}

/**
 * Utility function used to simulate touch events.
 *
 * @param page
 * @param param1
 */
export async function touchDrop(page: Page, data: DragDropData): Promise<void> {
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

    let touchStartObj;

    if (originElement) {
      touchStartObj = new Touch({
        identifier: 0,
        target: originElement,
        ...getEventProps(originElement),
      });
    }

    if (!destinationElement) return;

    const touchMoveObj = new Touch({
      identifier: 0,
      target: destinationElement,
      ...getEventProps(destinationElement),
    });

    if (data.dragStart) {
      originElement.dispatchEvent(
        new TouchEvent("touchstart", {
          touches: [touchStartObj],
          changedTouches: [touchStartObj],
          cancelable: true,
          bubbles: true,
        })
      );
    }

    originElement.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [touchStartObj],
        changedTouches: [touchStartObj],
        cancelable: true,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    destinationElement.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [touchMoveObj],
        changedTouches: [touchMoveObj],
        cancelable: true,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    destinationElement.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [touchMoveObj],
        changedTouches: [touchMoveObj],
        cancelable: true,
        bubbles: true,
      })
    );

    if (data.drop) {
      destinationElement.dispatchEvent(
        new TouchEvent("touchend", {
          touches: [touchMoveObj],
          changedTouches: [touchMoveObj],
          cancelable: true,
          bubbles: true,
        })
      );
    }
  }, data);
}

export async function touchDropOld(
  page: Page,
  {
    origin,
    destination,
    touchStart,
    drop,
  }: {
    origin?: string;
    destination?: string;
    touchStart?: boolean;
    drop?: boolean;
  }
): Promise<void> {
  let originElement = origin && (await page.waitForSelector(origin));

  if (!originElement) originElement = undefined;

  let destinationElement =
    destination && (await page.waitForSelector(destination));

  if (!destinationElement) destinationElement = undefined;

  return page.evaluate(
    async ({
      originElement,
      destinationElement,
      touchStart,
      drop,
    }: {
      originElement?: Element | undefined;
      destinationElement?: Element | undefined;
      touchStart?: boolean;
      drop?: boolean;
      dragleave?: boolean;
    }) => {
      const getPayload = (element: Element) => {
        const rect = element.getBoundingClientRect();

        const [x, y] = [rect.x + rect.width / 2, rect.y + rect.height / 2];

        return {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
        };
      };

      let touchStartObj;

      if (originElement) {
        touchStartObj = new Touch({
          identifier: 0,
          target: originElement,
          ...getPayload(originElement),
        });
      }

      if (!destinationElement) return;

      const touchMoveObj = new Touch({
        identifier: 0,
        target: destinationElement,
        ...getPayload(destinationElement),
      });

      if (touchStart && originElement) {
        originElement.dispatchEvent(
          new TouchEvent("touchstart", {
            touches: [touchStartObj],
            changedTouches: [touchStartObj],
            cancelable: true,
            bubbles: true,
          })
        );
      }

      if (originElement) {
        originElement.dispatchEvent(
          new TouchEvent("touchmove", {
            touches: [touchStartObj],
            changedTouches: [touchStartObj],
            cancelable: true,
            bubbles: true,
          })
        );
      }

      if (destinationElement) {
        destinationElement.dispatchEvent(
          new TouchEvent("touchmove", {
            touches: [touchMoveObj],
            changedTouches: [touchMoveObj],
            cancelable: true,
            bubbles: true,
          })
        );
      }

      if (drop) {
        if (destinationElement) {
          destinationElement.dispatchEvent(
            new TouchEvent("touchend", {
              touches: [touchMoveObj],
              changedTouches: [touchMoveObj],
              cancelable: true,
              bubbles: true,
            })
          );
        }
      }
    },

    { originElement, destinationElement, touchStart, drop }
  );
}
