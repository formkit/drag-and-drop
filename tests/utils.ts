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
