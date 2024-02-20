import type { NodeEventData } from "../../../../types";

export interface SelectionsConfig<T> {
  handleClick?: (data: NodeEventData<T>) => void;
  handleKeydown?: (data: NodeEventData<T>) => void;
  selectedClass?: string;
  clickawayDeselect?: boolean;
}
