/**
 * sdk 内部使用的事件
 */
export const enum Event {
  // 元素可见
  ElementExpose = 'ElementExpose',

  // 元素长曝光
  ElementLongExpose = 'ElementLongExpose',

  // 增加节点
  VNodeAdd = 'VNodeAdd',

  // 删除节点
  VNodeRemove = 'VNodeRemove',

  // 节点上报数据更新
  VNodeUpdate = 'VNodeUpdate',
}

export enum LongExposeRangeType {
  Show,
  Hide,
}
