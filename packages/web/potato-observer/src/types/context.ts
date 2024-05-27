export interface BusinessConfig {
  /** dom 节点上需要观测的 attr */
  attrs: string[];

  /**
   * 长曝光时间，默认 3000 毫秒
   *
   * 设为 0 则不触发长曝光
   *  */
  longExposeTime?: number;

  /**
   * 长曝光的曝光比例，默认大于 0 就算曝光
   */
  exposeRatio?: number;
}

export interface DebugConfig {
  /** 是否输出调试日志 */
  debugOutput?: boolean;
  /** 是否输出调试日志到指定的 pipe */
  debugOutputPipe?: (...args: Parameters<typeof console.log>) => void;
}

export interface Context {
  longExposeTime: number;
  shouldBeNode(dom: Element): boolean;
  getAttributeFilter(): string[];
  getBusinessAttrs(): string[];
  enableLongExpose(): boolean;
  isExpose(entry: IntersectionObserverEntry): boolean;
  getThreshold(): number[] | undefined;
  log(...args: Parameters<typeof console.log>): void;
  warn(...args: Parameters<typeof console.log>): void;
  error(...args: Parameters<typeof console.log>): void;
}
