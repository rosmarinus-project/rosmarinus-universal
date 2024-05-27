import type { ObserveEvent, ObserveEventType } from '../observer/event';
import type { IReportTree } from './interfaces';

export interface ReportEventCallbackData {
  type: ObserveEventType;
  events: ObserveEvent[];
  tree: IReportTree;
}

export type ReportEventCallback = (data: ReportEventCallbackData) => void | boolean;
