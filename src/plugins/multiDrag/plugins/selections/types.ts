import type { NodeEventData } from "../../../../types";

export interface SelectionsConfig {
  handleClick?: (data: NodeEventData) => void;
  handleKeydown?: (data: NodeEventData) => void;
  selectedClass?: string;
  clickawayDeselect?: boolean;
}
