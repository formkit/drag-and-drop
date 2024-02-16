import type { ParentConfig } from "../types";

export type ReactElement =
  | HTMLElement
  | React.MutableRefObject<HTMLElement | null>;

export interface ReactDragAndDropConfig<ListItems extends unknown[]>
  extends Partial<ParentConfig> {
  parent: ReactElement;
  state: [ListItems, React.Dispatch<React.SetStateAction<ListItems>>];
}
