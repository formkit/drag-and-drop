import { ParentConfig } from "../../types";
export interface AnimationsConfig {
  duration?: number;
  remapFinished?: () => void;
  yScale?: number;
  xScale?: number;
}

export interface AnimationsParentConfig<T> extends ParentConfig<T> {
  animationsConfig: AnimationsConfig;
}
