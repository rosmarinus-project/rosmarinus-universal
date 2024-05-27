import type { ReportNodePool } from './report-node-pool';
import type { Context } from '../types/context';
import type { IReportTree } from '../types/interfaces';
import { filterElements, safeTransformNodeIntoElement, uuid } from '../utils/dom';
import { domIterator, parentIterator } from '../utils/iterator';

export interface ReportTreeOptions {
  root: Element;
  reportNodePool: ReportNodePool;
  context: Context;
}

export class ReportTree implements IReportTree {
  public readonly id = uuid();

  private mutationObserver: MutationObserver;

  private reportNodePool: ReportNodePool;

  private context: Context;

  private $root?: Element;

  public constructor({ root, reportNodePool, context }: ReportTreeOptions) {
    this.context = context;
    this.reportNodePool = reportNodePool;
    this.$root = root;

    // 构建第一版虚拟 dom 树
    this.add([root]);

    // 观测 dom 变化
    this.mutationObserver = new MutationObserver((mutationsList) => {
      this.handleMutations(mutationsList);
    });

    this.mutationObserver.observe(root, {
      characterData: true,
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: this.context.getAttributeFilter(),
    });
  }

  /**
   * 销毁虚拟 dom 树
   *
   * 一定要在 dom 销毁前调用此方法, 否则会造成内存泄漏
   */
  public detach() {
    this.mutationObserver.disconnect();

    if (this.$root) {
      this.context.log('report tree detached', this.id);
      this.remove([this.$root]);
      this.$root = undefined;
    }
  }

  private handleMutations(mutationsList: MutationRecord[]) {
    mutationsList.forEach((mutation) => {
      const changedDom = safeTransformNodeIntoElement(mutation.target);

      if (mutation.type === 'childList') {
        this.handleChildListMutation(mutation);
      } else if (mutation.type === 'attributes') {
        if (!changedDom) {
          return;
        }

        // 为command变更时最后处理
        this.handleAttributesMutation(mutation);
      } else {
        // 其他的暂不处理
      }
    });
  }

  // 节点的增删
  private handleChildListMutation(mutation: MutationRecord) {
    const addedElements = filterElements(Array.from(mutation.addedNodes));
    const removedElements = filterElements(Array.from(mutation.removedNodes));

    if (addedElements.length) {
      this.add(addedElements);
    }

    if (removedElements.length) {
      this.remove(removedElements);
    }
  }

  // 节点 attrs 的变更
  private handleAttributesMutation(mutation: MutationRecord) {
    const changedEl = safeTransformNodeIntoElement(mutation.target);

    if (!changedEl) {
      return;
    }

    let node = this.reportNodePool.getNodeByDom(changedEl);
    const shouldBeNode = this.shouldBeNode(changedEl);
    let isNewNode = false;

    if (node && !shouldBeNode) {
      // 从目标节点变成了不是目标节点, 干掉该节点
      this.reportNodePool.removeNodeByDom(changedEl);
      node = undefined;
    } else if (!node && shouldBeNode) {
      // attribute 变更时, 从不是目标节点变成了目标节点, 重新生成节点
      this.add([changedEl]);
      node = this.reportNodePool.getNodeByDom(changedEl);
      isNewNode = true;
    }

    if (!node) {
      return;
    }

    const { attributeName } = mutation;

    if (!attributeName) {
      // 没有 attributeName 的变更不处理
      return this.context.warn('attributeName is undefined', mutation);
    }

    const attrValue = changedEl.getAttribute(attributeName);

    if (!this.isShow(changedEl, attributeName)) {
      // 非展示中的 dom 节点，当不存在
      this.remove([changedEl]);
    } else if (this.context.getBusinessAttrs().includes(attributeName) && attrValue) {
      // 更新 attribute
      node.updateAttr(attributeName, attrValue);

      // 只有非新节点才更新
      if (!isNewNode) {
        this.context.log('update attribute', attributeName, attrValue, node);
        this.reportNodePool.update(node, changedEl);
      }
    }
  }

  private remove(domList: Element[]) {
    domList.forEach((el) => {
      domIterator(el, (dom) => {
        this.reportNodePool.removeNodeByDom(dom.target);
      });
    });
  }

  private add(domList: Element[]) {
    domList.forEach((dom) => {
      this.createTree(dom);
    });
  }

  /**
   * @description 生成虚拟子 dom 树
   */
  private createTree(domRoot: Node) {
    domIterator(domRoot, (relation) => {
      // 命中生成节点的条件则加入节点
      const el = safeTransformNodeIntoElement(relation.target);

      if (!el || !this.shouldBeNode(el)) {
        return;
      }

      let node = this.reportNodePool.getNodeByDom(el);

      if (node) {
        this.context.warn('node already exist', node);
        node.reset();
      } else if (this.isShow(el)) {
        node = this.reportNodePool.new(el, this.id);
      }

      // 寻找最近的父节点
      parentIterator(relation, (root, target, parent) => {
        const parentNode = this.reportNodePool.getNodeByDom(parent);
        const child = this.reportNodePool.getNodeByDom(root);

        if (parentNode && child) {
          parentNode.addChild(child) && child.addParent(parentNode);
        }
      });
    });
  }

  private shouldBeNode(dom: Element): boolean {
    return this.context.shouldBeNode(dom);
  }

  private isShow(el: Element, mutationAttributionName?: string): boolean {
    if (
      mutationAttributionName === 'class' ||
      mutationAttributionName === 'style' ||
      mutationAttributionName === undefined
    ) {
      const style = window.getComputedStyle(el);

      if (style.display === 'none') {
        // display: none 当作移除处理
        return false;
      }
    }

    return true;
  }
}
