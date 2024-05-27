import type { ObserveEvent } from './observer/event';
import type { BusinessConfig, Context, DebugConfig } from './types/context';
import type { ReportEventCallback } from './types/observer';
import type { IReportTree, IReportTreeFactory } from './types/interfaces';
import { ReportTree } from './vnode/report-tree';
import { Observer } from './observer/observer';
import { ReportNodePool } from './vnode/report-node-pool';
import { Event } from './const/event';
import { ObserveEventType } from './observer/event';
import { buildContextFromConfig } from './context';

export interface ReportTreeFactoryOptions {
  callback: ReportEventCallback;
  config: BusinessConfig;
  debug?: DebugConfig;
}

interface TreeWrap {
  tree: IReportTree;
  callback?: ReportEventCallback;
}

class ReportTreeFactory implements IReportTreeFactory {
  private observer: Observer;

  private reportNodePool: ReportNodePool;

  private context: Context;

  private treeMap: Map<string, TreeWrap> = new Map();

  public constructor({ callback, config, debug }: ReportTreeFactoryOptions) {
    this.context = buildContextFromConfig(config, debug);
    this.reportNodePool = new ReportNodePool(this.context);
    this.observer = new Observer(this.reportNodePool, this.context);

    const reportEvent = (event: ObserveEventType, events: ObserveEvent[]) => {
      const map = this.splitIntoTreeMap(events);

      Object.keys(map).forEach((key) => {
        const tree = this.treeMap.get(key);

        if (tree) {
          if (tree.callback?.({ type: event, events, tree: tree.tree }) === true) {
            this.context.log(`tree return tree skip factory callback: ${key}`);
          } else {
            callback({ type: event, events, tree: tree.tree });
          }
        } else {
          this.context.error(`tree not found: ${key}`);
        }
      });
    };

    this.observer.addListener(Event.ElementExpose, (events) => {
      reportEvent(ObserveEventType.EXPOSE, events);
    });
    this.observer.addListener(Event.ElementLongExpose, (events) => {
      reportEvent(ObserveEventType.LONG_EXPOSE, events);
    });
  }

  /**
   * 调用后，该 factory 就不能再继续使用
   */
  public detach(): void {
    [...this.treeMap.values()].forEach((wrap) => {
      wrap.tree.detach();
    });
    this.treeMap.clear();
    this.observer.disconnect();
  }

  /**
   * 开始观察节点曝光
   *
   * @param root 根节点
   * @param callback 事件回调，返回 true 则不会触发 factory 的 callback
   * @returns 上报树
   */
  public attach(root: Element, callback?: ReportEventCallback): IReportTree {
    const tree = new ReportTree({
      root,
      reportNodePool: this.reportNodePool,
      context: this.context,
    });

    this.treeMap.set(tree.id, { tree, callback });
    const originDetach = tree.detach;

    tree.detach = () => {
      this.treeMap.delete(tree.id);
      originDetach.call(tree);
    };

    this.context.log('report tree attached', tree.id);

    return tree;
  }

  private splitIntoTreeMap(events: ObserveEvent[]): Record<string, ObserveEvent[]> {
    const treeMap: Record<string, ObserveEvent[]> = {};

    events.forEach((event) => {
      const { treeId } = event.target;

      if (!treeMap[treeId]) {
        treeMap[treeId] = [];
      }

      treeMap[treeId].push(event);
    });

    return treeMap;
  }
}

export function createReportTreeFactory(options: ReportTreeFactoryOptions): IReportTreeFactory {
  return new ReportTreeFactory(options);
}
