import type { Page } from "@playwright/test";
export async function dragDrop(
  page: Page,
  {
    origin,
    destination,
    dragStart,
    drop,
    dragleave,
  }: {
    origin?: string;
    destination?: string;
    dragStart?: boolean;
    drop?: boolean;
    dragleave?: boolean;
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
      dragStart,
      drop,
    }: {
      originElement?: Element | undefined;
      destinationElement?: Element | undefined;
      dragStart?: boolean;
      drop?: boolean;
      dragleave?: boolean;
    }) => {
      const dataTransfer = new DataTransfer();

      const getPayload = (element: Element) => {
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

      let originPayload;

      let destinationPayload;

      if (originElement) originPayload = getPayload(originElement);

      if (destinationElement)
        destinationPayload = getPayload(destinationElement);

      if (dragStart && originElement) {
        originElement.dispatchEvent(
          new DragEvent("pointerdown", originPayload)
        );

        originElement.dispatchEvent(new DragEvent("dragstart", originPayload));
      }

      if (originElement) {
        originElement.dispatchEvent(new DragEvent("dragover", originPayload));
      }

      if (destinationElement) {
        destinationElement.dispatchEvent(
          new DragEvent("dragover", destinationPayload)
        );
      }

      if (drop) {
        if (destinationElement) {
          destinationElement.dispatchEvent(
            new DragEvent("dragover", destinationPayload)
          );
          destinationElement.dispatchEvent(
            new DragEvent("drop", destinationPayload)
          );
        }
      }
    },

    { originElement, destinationElement, dragStart, drop, dragleave }
  );
}

export async function touchDrop(
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

      if (touchStart && originElement) {
        touchStartObj = new Touch({
          identifier: 0,
          target: originElement,
          ...getPayload(originElement),
        });
      }

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
