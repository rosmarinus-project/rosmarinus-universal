import * as htmlparser2 from 'htmlparser2';
import { ChildNode, Element } from 'domhandler';
import domSerializer, { DomSerializerOptions } from 'dom-serializer';

export const FAKE_ROOT = '__fake-root';

/** 会生成一个假的根节点 */
export function parse(doc: string) {
  const handler = new htmlparser2.DomHandler();
  const parser = new htmlparser2.Parser(handler, {
    xmlMode: false,
    lowerCaseAttributeNames: false,
    recognizeSelfClosing: true,
    lowerCaseTags: false,
  });

  parser.end(doc);

  return new Element(
    FAKE_ROOT,
    {},
    Array.isArray(handler.dom) ? handler.dom : [handler.dom],
    htmlparser2.ElementType.Tag,
  );
}

export interface WalkOptions {
  enter?: (node: HtmlNode, index: number) => void;
  leave?: (node: HtmlNode, index: number) => void;
}

export type HtmlNode = ChildNode;

function visit(node: HtmlNode, index: number, options: WalkOptions) {
  if (typeof options.enter === 'function') {
    options?.enter(node, index);
  }

  if ((node.type === 'tag' || node.type === 'root') && Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      visit(node.children[i], i, options);
    }
  }

  if (typeof options.leave === 'function') {
    options?.leave(node, index);
  }
}

export function walker(ast: HtmlNode, options: WalkOptions) {
  if (Array.isArray(ast)) {
    for (let i = 0; i < ast.length; i++) {
      visit(ast[i], i, options);
    }
  } else if ((ast as any)?.children) {
    visit(ast, 0, options);
  }
}

export function builder(ast: HtmlNode, options?: DomSerializerOptions) {
  const finalOptions = options ?? { encodeEntities: 'utf8' };

  if (ast.type === htmlparser2.ElementType.Tag && ast.name === FAKE_ROOT) {
    // 忽略假根节点
    return domSerializer(ast.children, finalOptions);
  }

  return domSerializer(ast, finalOptions);
}

export * as t from 'domhandler';
