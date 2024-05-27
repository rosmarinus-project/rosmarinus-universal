import EventEmitter from 'eventemitter3';
import type { ReportNode } from '../vnode/report-node';
import { Event, LongExposeRangeType } from '../const/event';
import { Context } from '../types/context';

interface LongExposeItem {
  node: ReportNode;
  el?: Element;
}

interface LongExposeRecorderEvent {
  [Event.ElementLongExpose]: (nodeList: LongExposeItem[]) => void;
}

export class LongExposeRecorder extends EventEmitter<LongExposeRecorderEvent> {
  /**
   * 记录最近一次进入曝光区域的时间节点，做长曝光计算
   *
   * key 为 vnode 的 id
   * value 为曝光的时间戳
   *
   *  */
  private timeRecordMap = new Map<string, number>();

  /**
   *
   * 记录每个时间节点开始曝光的 vnode
   * 计时器用
   *  */
  private timeNodeMap = new Map<number, ReportNode[]>();

  /** 记录 element，来让后面长曝光结束后可以释放监听 */
  private domMap = new WeakMap<ReportNode, Element>();

  /** 记录最近一个长曝光开始的时间，用于决定要不要继续计时 */
  private longExposeStartTimeList: number[] = [];

  /** 长曝光计时器 */
  private longExposeTimer: ReturnType<typeof setTimeout> | null = null;

  public constructor(private readonly context: Context) {
    super();
  }

  /** 长曝光开始 */
  public longExposeStart(node: ReportNode, dom: Element, now: number) {
    // 如果之前进入过曝光区域，但是没有完成曝光，那这里需要先记录下隐藏的持续时间
    const lastShowTime = node.getLastShowTime();

    if (lastShowTime !== 0) {
      node.addLongExposeTimeRange(this.context, LongExposeRangeType.Hide, now - lastShowTime, now);
    }

    // 记录节点
    this.timeRecordMap.set(node.id, now);
    this.domMap.set(node, dom);

    // 记录下开始曝光的时间点，数组内为去重递增的各节点进入曝光区域的时间点
    if (
      (this.longExposeStartTimeList.length > 0 &&
        this.longExposeStartTimeList[this.longExposeStartTimeList.length - 1] !== now) ||
      this.longExposeStartTimeList.length === 0
    ) {
      this.longExposeStartTimeList.push(now);
    }

    // 记录时间点，用于计时器结束后的长曝光
    if (!this.timeNodeMap.has(now)) {
      this.timeNodeMap.set(now, []);
    }

    if (this.timeNodeMap.get(now)?.indexOf(node) === -1) {
      // 去重后加入
      this.timeNodeMap.get(now)?.push(node);
    }

    if (!this.longExposeTimer) {
      this.startTimer(now);
    }
  }

  /**
   * 检查是否长曝光结束
   *
   * 曝光区域内 -> 曝光区域外
   *  */
  public checkLongExposeEnd(node: ReportNode, now: number) {
    // 结束计算长曝光
    const lastTime = this.timeRecordMap.get(node.id);

    // 这里需要干掉开始计时时间，避免后面计时器又用来重复计算长曝光时间
    this.timeRecordMap.delete(node.id);
    const timeDiff = lastTime ? now - lastTime : 0;

    node.addLongExposeTimeRange(this.context, LongExposeRangeType.Show, timeDiff, now);

    if (timeDiff >= this.context.longExposeTime) {
      // 这里按理来说是不触发的，应该由计时器的计算先触发，但这里先保留来兜底，避免没触发到长曝光
      node.setLongExpose(true);
      this.removeNode(node);
    }
  }

  /** 节点从 dom 树中移除，删掉所有曝光记录 */
  public stopRecord(node: ReportNode) {
    this.removeNode(node);
  }

  private startTimer(now = Date.now()) {
    // 取出下一个时间点
    const nextTickStart = this.longExposeStartTimeList.splice(0, 1)[0];

    if (!nextTickStart) {
      this.longExposeTimer = null;

      return;
    }

    const nextTickEnd = nextTickStart + this.context.longExposeTime;
    const timeDiff = nextTickEnd - now;

    this.longExposeTimer = setTimeout(() => {
      // 长曝光结束
      const result = this.timeNodeMap
        .get(nextTickStart)
        ?.map((node) => {
          // 过滤曝光时间不达标的节点
          const nodeStartTime = this.timeRecordMap.get(node.id);
          const nodeDuration = nodeStartTime ? nextTickEnd - nodeStartTime : 0;

          if (nodeDuration + node.getLongExposeTotalShowTime() >= this.context.longExposeTime) {
            node.addLongExposeTimeRange(this.context, LongExposeRangeType.Show, nodeDuration, nextTickEnd);

            return this.longTimeExposeEnd(node, nextTickStart);
          }

          return null;
        })
        .filter((r) => !!r) as LongExposeItem[] | undefined;

      this.timeNodeMap.delete(nextTickStart);
      result && this.emit(Event.ElementLongExpose, result);

      this.startTimer();
    }, timeDiff);
  }

  private longTimeExposeEnd(node: ReportNode, time: number): LongExposeItem | null {
    if (this.timeRecordMap.get(node.id) !== time) {
      // 要按这个过滤下，因为里面有一些是需要干掉的
      return null;
    }

    const dom = this.domMap.get(node);

    this.removeNode(node);
    node.setLongExpose(true);

    return { node, el: dom };
  }

  private removeNode(node: ReportNode) {
    this.domMap.delete(node);
    this.timeRecordMap.delete(node.id);
  }
}
