import { ParentConfig } from "../../types";
export interface AnimationsConfig {
  duration?: number;
  /**
   * CSS easing for the sort/transfer animations (any value accepted by the
   * Web Animations API, e.g. "ease-in" or "cubic-bezier(0.22, 1, 0.36, 1)").
   * Defaults to "ease-in-out".
   */
  easing?: string;
  remapFinished?: () => void;
  yScale?: number;
  xScale?: number;
}

export interface AnimationsParentConfig<T> extends ParentConfig<T> {
  animationsConfig: AnimationsConfig;
}
