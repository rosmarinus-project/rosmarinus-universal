export function safeTransformNodeIntoElement(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    // 非元素节点不处理
    // 非元素节点即文本节点、注释节点、文档节点等
    // 因为只有 element 有 attr，才可能会有曝光行为
    return null;
  }

  return node instanceof Element ? node : null;
}

export function filterElements(nodeList: Node[]): Element[] {
  return nodeList.map((node) => safeTransformNodeIntoElement(node) as Element).filter((el) => !!el);
}

export function uuid() {
  return Math.random().toString(36).slice(2);
}
