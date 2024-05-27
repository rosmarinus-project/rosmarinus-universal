import * as t from '@babel/types';
import type { BabelAPI } from '@babel/helper-plugin-utils';
import type { PluginObj } from '@babel/core';

interface Options {
  npmName?: string;
  exportMapPath?: string;
}

interface ImportMap {
  [key: string]: { from: string; fromImportPath: string };
}

const getAlias = (name: string, options: Options, importedMap: ImportMap) => {
  const targetKey = importedMap[name]?.fromImportPath;

  if (targetKey) {
    return `${options.npmName}/${targetKey}`;
  }

  throw new Error(`找不到 ${name} 对应的 alias，请检查 ${options.npmName} 中是否有正确导出`);
};

// eslint-disable-next-line max-params
function splitImportedModule({
  imported,
  program,
  filename,
  options,
  importMap = {},
}: {
  imported: t.ImportDeclaration;
  program: t.Program;
  filename: string;
  options: Options;
  importMap: ImportMap;
}) {
  // 全量引入检查
  if (imported.specifiers.length === 0 && !imported.importKind) {
    throw new Error(`${filename} 有全量引入 ${options?.npmName}，请检查`);
  }

  if (
    imported.specifiers.length === 1 &&
    (imported.specifiers[0].type === 'ImportNamespaceSpecifier' ||
      imported.specifiers[0].type === 'ImportDefaultSpecifier')
  ) {
    throw new Error(`${filename} 有全量引入 ${options?.npmName}，请检查是否引用有误`);
  }

  let hasNotFoundImport = false;
  const specifiersNeedToRemove: t.ImportSpecifier[] = [];

  imported.specifiers.forEach((specifier) => {
    if (specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier') {
      const importedName = specifier.imported.name;
      const alias = getAlias(importedName, options, importMap);

      if (alias === options.npmName) {
        // 为保证不出错，如果有找不到 alias 的，就不做处理
        hasNotFoundImport = true;
        throw new Error(
          `${filename} 有引入 ${options?.npmName} 中的 ${importedName}，但是找不到对应 alias，请检查 ${options?.npmName} 中是否有正确导出`,
        );
      }

      specifiersNeedToRemove.push(specifier);

      // importKind 要一致
      const aliasModule = program.body.find(
        (node) =>
          node.type === 'ImportDeclaration' && node.source.value === alias && node.importKind === imported.importKind,
      ) as t.ImportDeclaration | undefined;

      if (aliasModule) {
        aliasModule.specifiers.push(specifier);
      } else {
        const importStatement = t.importDeclaration([specifier], t.stringLiteral(alias));

        importStatement.importKind = imported.importKind;
        program.body.splice(0, 0, importStatement);
      }
    }
  });

  // 剩下没有识别到别名的，继续保留
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  imported.specifiers = imported.specifiers.filter((specifier) => !specifiersNeedToRemove.includes(specifier));

  const importedIndex = program.body.findIndex((node) => node === imported);

  !hasNotFoundImport && importedIndex > -1 && program.body.splice(importedIndex, 1);
}

export default (api: BabelAPI, options: Options): PluginObj => {
  const { npmName, exportMapPath } = options || {};

  if (!npmName) {
    throw new Error('[babel-plugin-tree-cutting] 请传入 npmName');
  }

  if (!exportMapPath) {
    throw new Error('[babel-plugin-tree-cutting] 请传入 exportMapPath');
  }

  const importMap = (() => {
    try {
      return require(exportMapPath);
    } catch (e) {
      return {};
    }
  })();

  return {
    visitor: {
      Program({ node }, state) {
        const { filename } = state;

        if (!filename) {
          return;
        }

        // 有可能会有多个的情况，比方说 importKind 不同
        const importList = node.body.filter(
          (n) => n.type === 'ImportDeclaration' && n.source.value === npmName,
        ) as t.ImportDeclaration[];

        importList.forEach((imported) => {
          splitImportedModule({ imported, program: node, filename, options, importMap });
        });
      },
    },
  };
};
