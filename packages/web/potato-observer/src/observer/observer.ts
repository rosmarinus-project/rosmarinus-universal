import EventEmitter from 'eventemitter3';
import type { ReportNode } from '../vnode/report-node';
import type { ReportNodePool } from '../vnode/report-node-pool';
import type { Context } from '../types/context';
import { Event } from '../const/event';
import { LongExposeRecorder } from './long-expose';
import { ObserveEvent } from './event';

interface ObserverEvent {
  [Event.ElementExpose]: (events: ObserveEvent[]) => void;
  [Event.ElementLongExpose]: (events: ObserveEvent[]) => void;
}

export class Observer extends EventEmitter<ObserverEvent> {
  private iObserver: IntersectionObserver;

  private longExposeRecorder: LongExposeRecorder;

  // eslint-disable-next-line max-lines-per-function
  public constructor(
    private readonly reportNodePool: ReportNodePool,
    private readonly context: Context,
  ) {
    super();
    this.longExposeRecorder = new LongExposeRecorder(this.context);
    this.iObserver = new IntersectionObserver(
      (entries) => {
        const shortExposeNodes: { node: ReportNode; dom: Element }[] = [];
        // lazy init
        let now: number | null = null;
        const enableLongExpose = this.context.enableLongExpose();

        entries.forEach((entry) => {
          const dom = entry.target;
          const node = this.reportNodePool.getNodeByDom(dom);

          if (node) {
            // 判断是否曝光
            const isIntersecting = this.context.isExpose(entry);

            if (!node.hasShortExpose && isIntersecting) {
              // 短曝光
              node.hasShortExpose = isIntersecting;
              shortExposeNodes.push({ node, dom });
            }

            if (!node.hasLongExpose && enableLongExpose) {
              // 长曝光
              now = now ?? Date.now();

              if (isIntersecting) {
                // 开始计算长曝光
                this.longExposeRecorder.longExposeStart(node, dom, now);
              } else {
                // 检查长曝光是否结束
                this.longExposeRecorder.checkLongExposeEnd(node, now);
              }
            }

            if (this.canStopObserve(node)) {
              this.iObserver.unobserve(dom);
              node.setIsObserved(false);
            }
          }
        });
        shortExposeNodes.length &&
          this.emit(
            Event.ElementExpose,
            shortExposeNodes.map((item) => new ObserveEvent(item.node, item.dom)),
          );
      },
      {
        threshold: this.context.getThreshold(),
      },
    );

    this.longExposeRecorder.addListener(Event.ElementLongExpose, (entries) => {
      entries.length &&
        this.emit(
          Event.ElementLongExpose,
          entries.map((entry) => {
            const { el } = entry;

            el && this.iObserver.unobserve(el);
            entry.node.setIsObserved(false);

            return new ObserveEvent(entry.node, el);
          }),
        );
    });

    this.reportNodePool.addListener(Event.VNodeRemove, (node, element) => {
      this.iObserver.unobserve(element);
      node.setIsObserved(false);
      this.longExposeRecorder.stopRecord(node);
    });

    this.reportNodePool.addListener(Event.VNodeAdd, (node, element) => {
      this.iObserver.observe(element);
      node.setIsObserved(true);
    });

    this.reportNodePool.addListener(Event.VNodeUpdate, (node, element) => {
      if (node.isObserved()) {
        this.context.log('VNodeUpdate node already isObserved, unobserve first', node);
        this.iObserver.unobserve(element);
        this.longExposeRecorder.stopRecord(node);
      }

      node.resetExposeStatus();
      this.context.log('VNodeUpdate re observe node', node);
      this.iObserver.observe(element);
      node.setIsObserved(true);
    });
  }

  public disconnect(): void {
    this.iObserver.disconnect();
  }

  private canStopObserve(node: ReportNode) {
    if (this.context.enableLongExpose() && !node.hasLongExpose) {
      return false;
    }

    return node.hasShortExpose;
  }
}
