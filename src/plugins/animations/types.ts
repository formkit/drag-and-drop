import { ParentConfig } from "../../types";
export interface AnimationsConfig {
  duration?: number;
  remapFinished?: () => void;
}

export interface AnimationsParentConfig<T> extends ParentConfig<T> {
  animationsConfig: AnimationsConfig;
}
