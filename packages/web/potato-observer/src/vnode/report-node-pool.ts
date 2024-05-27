import EventEmitter from 'eventemitter3';
import type { ElementEx, NodeEx } from '../types/dom';
import type { Context } from '../types/context';
import { Attribute } from '../const/attribute';
import { Event } from '../const/event';
import { safeTransformNodeIntoElement, uuid } from '../utils/dom';
import { ReportNode } from './report-node';

export interface ReportNodePoolEvent {
  [Event.VNodeAdd]: (node: ReportNode, element: Element) => void;
  [Event.VNodeRemove]: (node: ReportNode, element: Element) => void;
  [Event.VNodeUpdate]: (node: ReportNode, element: Element) => void;
}

export class ReportNodePool extends EventEmitter<ReportNodePoolEvent> {
  private store = new Map<string, ReportNode>();

  public constructor(private readonly context: Context) {
    super();
  }

  public getNodeByKey(key: string) {
    return this.store.get(key);
  }

  public getNodeByDom(dom: ElementEx | NodeEx) {
    const key = dom[Attribute.ID];

    if (key) {
      return this.store.get(key);
    }

    return undefined;
  }

  public removeNodeByDom(dom: ElementEx | NodeEx) {
    const key = dom[Attribute.ID];

    if (key) {
      const node = this.getNodeByKey(key);

      this.store.delete(key);
      const element = safeTransformNodeIntoElement(dom);

      node && element && this.emit(Event.VNodeRemove, node, element);
    }
  }

  public new(dom: ElementEx | NodeEx, treeId: string) {
    const key = uuid();

    // eslint-disable-next-line no-param-reassign
    dom[Attribute.ID] = key;
    const node = this.buildReportNode(key, dom, treeId);

    this.store.set(key, node);
    const element = safeTransformNodeIntoElement(dom);

    element && this.emit(Event.VNodeAdd, node, element);

    return node;
  }

  // 节点上报数据更新
  public update(node: ReportNode, el: ElementEx) {
    this.emit(Event.VNodeUpdate, node, el);
  }

  private buildReportNode(id: string, dom: ElementEx | NodeEx, treeId: string) {
    const element = safeTransformNodeIntoElement(dom);
    const businessAttr: Record<string, string> = {};

    if (element) {
      const attrNames = this.context.getBusinessAttrs();

      attrNames.forEach((name) => {
        const value = element.getAttribute(name);

        value && (businessAttr[name] = value);
      });
    }

    return new ReportNode({ id, businessAttr, treeId });
  }
}
