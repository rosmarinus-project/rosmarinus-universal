import type { BusinessConfig, Context, DebugConfig } from '../types/context';
import { MUTATION_ATTRS, LONG_EXPOSE_DEFAULT_TIME } from '../const/attribute';

const enum LogType {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export function buildContextFromConfig(config: BusinessConfig, debug?: DebugConfig): Context {
  const { attrs, exposeRatio } = config;
  const debugOutput = debug?.debugOutput ?? false;
  const debugOutputPipe = debugOutput ? debug?.debugOutputPipe ?? console.log : () => {};

  const longExposeTime = config.longExposeTime ?? LONG_EXPOSE_DEFAULT_TIME;

  const wrapLogContent = (args: Parameters<typeof debugOutputPipe>, type: LogType) => {
    const first = args.shift();
    const prefix =
      typeof first === 'string'
        ? [`[potato-observer inner ${type}] ${first}`]
        : [`[potato-observer inner ${type}]`, first];

    return [...prefix, ...args];
  };

  return {
    log(...args) {
      debugOutputPipe(...wrapLogContent(args, LogType.Info));
    },
    warn(...args) {
      debugOutputPipe(...wrapLogContent(args, LogType.Warn));
    },
    error(...args) {
      debugOutputPipe(...wrapLogContent(args, LogType.Error));
    },
    shouldBeNode(dom: Element): boolean {
      return attrs.some((attr) => dom.hasAttribute(attr));
    },
    getAttributeFilter() {
      return [...MUTATION_ATTRS, ...attrs];
    },
    getBusinessAttrs() {
      return attrs;
    },
    enableLongExpose() {
      return longExposeTime > 0;
    },
    isExpose(entry: IntersectionObserverEntry) {
      if (exposeRatio !== undefined && exposeRatio !== 0) {
        return entry.intersectionRatio >= exposeRatio;
      }

      return typeof entry.isIntersecting !== 'undefined' ? entry.isIntersecting : entry.intersectionRatio > 0;
    },
    getThreshold() {
      return exposeRatio !== undefined ? [exposeRatio] : undefined;
    },
    longExposeTime,
  };
}
