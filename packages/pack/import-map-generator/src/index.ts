import { resolve, relative } from 'path';
import { esCompiler, pathUtils } from '@rosmarinus/compiler-kit';
import { readFile, existsSync, writeJSON, ensureFile } from 'fs-extra';
import type { Context, ExportItem } from './types';

export async function genExportMap(ctx: Context) {
  const entryFileList = ctx.input;

  const promiseList = await Promise.all(entryFileList.map((file) => getOneFileExportItemList(file, ctx.cwd)));
  const items: ExportItem[] = [];

  promiseList.forEach((list) => items.push(...list));

  const obj: Record<string, { from: string; fromImportPath: string }> = {};

  items.forEach((item) => {
    const file = relative(ctx.cwd, item.file);

    if (obj[item.id]) {
      throw new Error(`duplicate export id: ${item.id}, from ${obj[item.id].from} and ${file}`);
    } else if (ctx.transform) {
      obj[item.id] = { from: file, fromImportPath: ctx.transform(file) };
    } else {
      const pathWithoutExt = file.replace(/\..*$/g, '');

      const fromImportPath = ctx.srcDir
        ? relative(resolve(ctx.cwd, ctx.srcDir), resolve(ctx.cwd, pathWithoutExt))
        : pathWithoutExt;

      obj[item.id] = { from: file, fromImportPath };
    }
  });

  const outputFilePath = resolve(ctx.cwd, ctx.outputFileName);

  await ensureFile(outputFilePath);
  await writeJSON(outputFilePath, obj, { spaces: 2 });
}

async function getOneFileExportItemList(file: string, cwd?: string): Promise<ExportItem[]> {
  const filePath = resolve(cwd || process.cwd(), file);

  if (!existsSync(filePath)) {
    return [];
  }

  const itemList: ExportItem[] = [];

  const fileToParse = [{ from: filePath, now: filePath }];

  while (fileToParse.length) {
    const file = fileToParse.shift();

    if (!file || !existsSync(file.now)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const fileContent = await readFile(file.now, 'utf-8');

    const ast = esCompiler.parse(fileContent);

    esCompiler.walker(ast, {
      CallExpression({ node }) {
        const id = getExportItemFromCallExpression(node);

        id && itemList.push({ id, file: file.from });
      },
      ExportNamedDeclaration({ node }) {
        const { idList, newCheckPath } = getExportItemFromExportNamedDeclaration(node, file.now);

        newCheckPath && fileToParse.push({ now: newCheckPath, from: file.from });
        idList?.length && itemList.push(...idList.map((id) => ({ id, file: file.from })));
      },
      ExportAllDeclaration({ node }) {
        const target = resolvePath(file.now, node.source.value);

        if (target.isNpm) {
          return;
        }

        fileToParse.push({ now: target.path, from: file.from });
      },
    });
  }

  return itemList;
}

function getExportItemFromCallExpression(node: esCompiler.t.CallExpression): string | undefined {
  const { callee } = node;

  if (callee.type !== 'MemberExpression') {
    return;
  }

  if (callee.object.type !== 'Identifier' || callee.object.name !== 'app') {
    return;
  }

  if (callee.property.type !== 'Identifier' || callee.property.name !== 'component') {
    return;
  }

  const [localNameNode, importedNameNode] = node.arguments;

  if (localNameNode.type !== 'StringLiteral' || importedNameNode.type !== 'Identifier') {
    return;
  }

  // const localName = localNameNode.value;
  const importedName = importedNameNode.name;

  return importedName;
}

function getExportItemFromExportNamedDeclaration(
  node: esCompiler.t.ExportNamedDeclaration,
  file: string,
): { newCheckPath?: string; idList?: string[] } {
  if (node.specifiers.length === 1 && node.specifiers[0].type === 'ExportNamespaceSpecifier' && node.source) {
    const target = resolvePath(file, node.source.value);

    if (target.isNpm) {
      return {};
    }

    return { newCheckPath: target.path };
  }

  const idList: string[] = [];

  if (node.declaration?.type === 'VariableDeclaration') {
    const { declarations } = node.declaration;

    declarations.forEach((declaration) => {
      if (declaration.id.type === 'Identifier') {
        idList.push(declaration.id.name);
      } else if (declaration.id.type === 'ObjectPattern') {
        declaration.id.properties.forEach((property) => {
          if (property.type === 'ObjectProperty' && property.value.type === 'Identifier') {
            idList.push(property.value.name);
          }
        });
      }
    });
  } else if (node.declaration?.type === 'ClassDeclaration') {
    const { id } = node.declaration;

    id?.name && idList.push(id.name);
  } else if (node.declaration?.type === 'TSInterfaceDeclaration') {
    const { id } = node.declaration;

    idList.push(id.name);
  } else if (node.declaration?.type === 'TSTypeAliasDeclaration') {
    const { id } = node.declaration;

    idList.push(id.name);
  } else if (node.declaration?.type === 'TSEnumDeclaration') {
    const { id } = node.declaration;

    idList.push(id.name);
  } else if (node.declaration?.type === 'FunctionDeclaration') {
    const { id } = node.declaration;

    id?.name && idList.push(id?.name);
  }

  node.specifiers.forEach((specifier) => {
    if (specifier.type === 'ExportSpecifier' && specifier.exported.type === 'Identifier') {
      idList.push(specifier.exported.name);
    }
  });

  return { idList };
}

function resolvePath(entry: string, target: string) {
  const nowPath = new pathUtils.AbsolutePath(entry, process.cwd());
  const targetPathStr = target;
  const resPath = pathUtils.resolveImportPath(nowPath, targetPathStr, {
    aliasPathMap: pathUtils.getAliasPath({ tsConfig: 'tsconfig.json' }),
  });

  return resPath;
}
