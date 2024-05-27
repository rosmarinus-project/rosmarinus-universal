import type { ReportNode } from '../vnode/report-node';

export const enum ObserveEventType {
  EXPOSE,
  LONG_EXPOSE,
}

export class ObserveEvent {
  public constructor(
    public readonly target: ReportNode,
    public readonly el?: Element,
  ) {}
}
