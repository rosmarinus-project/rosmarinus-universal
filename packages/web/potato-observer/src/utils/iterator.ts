export interface RelationNode {
  parentRelation?: RelationNode;
  target: Node;
}

export function domIterator(dom: Node, callback: (relation: RelationNode) => boolean | void) {
  const stack: RelationNode[] = [{ target: dom }];

  while (stack.length) {
    const relation = stack.pop();

    if (!relation) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const ret = callback(relation);

    if (ret) {
      return;
    }

    const children = relation.target.childNodes;

    children.forEach((child) => {
      stack.push({ target: child, parentRelation: relation });
    });
  }
}

export function parentIterator(
  relation: RelationNode,
  callback: (root: Node, target: Node, parent: Node) => boolean | void,
) {
  let { target } = relation;
  let { parentRelation } = relation;

  while (parentRelation) {
    const ret = callback(relation.target, target, parentRelation.target);

    if (ret) {
      return;
    }

    target = parentRelation.target;
    parentRelation = parentRelation.parentRelation;
  }
}
