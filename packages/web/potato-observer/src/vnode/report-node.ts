import type { Context } from '../types/context';
import { LongExposeRangeType } from '../const/event';

export interface ReportNodeOptions {
  id: string;
  businessAttr: Record<string, string>;
  treeId: string;
}

interface LongExposeRange {
  type: LongExposeRangeType;
  duration: number;
  timestamp: number;
}

export class ReportNode {
  /** 是否短曝光 */
  public hasShortExpose = false;

  /** 是否完全长曝光 */
  public hasLongExpose = false;

  /** 节点唯一 ID */
  public id: string;

  /** 业务属性 */
  public businessAttr: Record<string, string>;

  /** 所属树的 ID，可以用于判断属于哪棵树 */
  public treeId: string;

  /** 记录所有的曝光/隐藏的时间段，直到完全长曝光 */
  private longExposeTimeRange: LongExposeRange[] = [];

  /** 子节点 */
  private children: ReportNode[] = [];

  /** 子节点 id 集合 */
  private childIdSet = new Set<string>();

  /** 父节点 */
  private parent: ReportNode | null = null;

  /** 是否被正在被观测 */
  private isBeingObserved = false;

  public constructor(options: ReportNodeOptions) {
    this.id = options.id;
    this.businessAttr = options.businessAttr;
    this.treeId = options.treeId;
  }

  /** 重置节点为初始状态 */
  public reset() {
    this.resetExposeStatus();
    this.children = [];
    this.longExposeTimeRange = [];
    this.childIdSet.clear();
  }

  /** 重置为未曝光的状态 */
  public resetExposeStatus() {
    this.hasShortExpose = false;
    this.hasLongExpose = false;
  }

  /** 从节点树中销毁节点 */
  public destroy() {
    this.remove();
  }

  /** 更新上报数据 */
  public updateAttr(attrName: string, attrValue: string) {
    this.businessAttr[attrName] = attrValue;
  }

  public addChild(child: ReportNode) {
    if (this.childIdSet.has(child.id)) {
      return false;
    }

    this.childIdSet.add(child.id);
    this.children.push(child);

    return true;
  }

  public removeChild(child: ReportNode) {
    this.childIdSet.delete(child.id);
    this.children = this.children.filter((node) => node.id !== child.id);
  }

  public addParent(parent: ReportNode) {
    this.parent = parent;
  }

  // eslint-disable-next-line max-params
  public addLongExposeTimeRange(context: Context, type: LongExposeRangeType, duration: number, timestamp: number) {
    if (!duration) {
      return;
    }

    const last = this.lastLongExposeTimeRange();

    if (!last) {
      if (type === LongExposeRangeType.Show) {
        this.longExposeTimeRange.push({ type, duration, timestamp });
      } else {
        context.error('LongExposeRangeType.Hide should not be the first range');
      }

      return;
    }

    if (last.type === type) {
      context.error(
        'LongExposeRangeType.Show should not be the same as last range',
        this,
        this.businessAttr,
        this.longExposeTimeRange,
        duration,
      );

      return;
    }

    this.longExposeTimeRange.push({ type, duration, timestamp });
  }

  public getLongExposeTotalShowTime(): number {
    return this.longExposeTimeRange.reduce(
      (total, range) => total + (LongExposeRangeType.Show === range.type ? range.duration : 0),
      0,
    );
  }

  public getLastShowTime() {
    const last = this.lastLongExposeTimeRange();

    if (!last) {
      return 0;
    }

    return last.type === LongExposeRangeType.Show ? last.timestamp : 0;
  }

  public getLongExposeTotalHideTime(): number {
    return this.longExposeTimeRange.reduce(
      (total, range) => total + (LongExposeRangeType.Hide === range.type ? range.duration : 0),
      0,
    );
  }

  public setLongExpose(isExpose: boolean) {
    this.hasLongExpose = isExpose;
  }

  public isObserved() {
    return this.isBeingObserved;
  }

  public setIsObserved(isObserved: boolean) {
    this.isBeingObserved = isObserved;
  }

  private lastLongExposeTimeRange(): LongExposeRange | undefined {
    return this.longExposeTimeRange[this.longExposeTimeRange.length - 1];
  }

  private remove(): void {
    // 自己为节点的子树脱离树
    if (this.parent) {
      this.parent.removeChild(this);
      this.parent = null;
    }
  }
}
