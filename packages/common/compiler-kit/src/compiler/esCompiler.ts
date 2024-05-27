import traverse from '@babel/traverse';
import { parse as babelParse, ParserOptions } from '@babel/parser';
import generator from '@babel/generator';

export function parse(code: string, options?: ParserOptions) {
  return babelParse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'classProperties', 'classPrivateProperties', 'decorators-legacy'],
    ...options,
  });
}

export function builder(
  ast: Parameters<typeof generator>[0] | ReturnType<typeof parse>,
  opts?: Parameters<typeof generator>[1],
  code?: Parameters<typeof generator>[2],
) {
  return generator(ast, opts, code);
}

export const walker = traverse;

export * as t from '@babel/types';
