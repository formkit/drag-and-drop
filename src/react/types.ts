import type { ParentConfig } from "../types";

export type ReactElement =
  | HTMLElement
  | React.MutableRefObject<HTMLElement | null>;

export interface ReactDragAndDropData extends ReactParentConfig {
  parent: ReactElement;
  values: [Array<any>, React.Dispatch<React.SetStateAction<Array<any>>>];
}

export type ReactParentConfig = Partial<ParentConfig>;
