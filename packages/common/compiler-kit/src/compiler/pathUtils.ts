import * as path from 'path';
import * as fse from 'fs-extra';
import JSON5 from 'json5';
import { merge } from 'lodash-es';

export interface Config {
  /**
   * tsconfig 的路径
   */
  tsConfig?: string | string[];
  cwd?: string;
}

export interface Context {
  aliasPathMap: Record<string, string[]>;
  cwd?: string;
}

/** 多个 . 的后缀 */
const MultiExtension = ['.d.ts'];

/** 内部可处理的后缀 */
const AutoExtension = ['.vue', '.js', '.ts', '.jsx', '.tsx'].concat(MultiExtension);

function formatPath(rawPath: string) {
  const path = rawPath.split('?')[0];

  if (fse.existsSync(path) && fse.statSync(path).isFile()) {
    return path;
  }

  for (const extension of AutoExtension) {
    let tempPath = `${path}${extension}`;

    if (fse.existsSync(tempPath) && fse.statSync(tempPath).isFile()) {
      return tempPath;
    }

    tempPath = `${path}/index${extension}`;

    if (fse.existsSync(tempPath) && fse.statSync(tempPath).isFile()) {
      return tempPath;
    }
  }

  return path;
}

abstract class Path {
  public readonly path: string;

  public constructor(path: string) {
    this.path = formatPath(path);
  }

  public getExtension() {
    return extname(this.path);
  }
}

export class AbsolutePath extends Path {
  public constructor(
    filePath: string,
    private readonly base: string,
    public readonly isNpm?: boolean,
  ) {
    const absolutePath = (() => {
      if (isNpm) {
        return filePath;
      }

      return path.resolve(base, filePath);
    })();

    super(absolutePath);
  }

  public relative(base: AbsolutePath): RelativePath {
    return new RelativePath(path.relative(base.path, this.path));
  }

  public replaceExtension(extension: string) {
    return new AbsolutePath(replaceExtname(this.path, extension), this.base);
  }
}

export class RelativePath extends Path {
  public absolute(base: string): AbsolutePath {
    return new AbsolutePath(this.path, base);
  }
}

/** 优先取前面的 */
function mergeTsConfig(now: any, extend: any) {
  const extendsTsPaths = extend?.compilerOptions?.paths || {};
  const tsPaths = now?.compilerOptions?.paths || {};

  Object.keys(extendsTsPaths).forEach((key) => {
    if (tsPaths[key]) {
      tsPaths[key] = [...new Set([...tsPaths[key], ...extendsTsPaths[key]])];
    } else {
      tsPaths[key] = extendsTsPaths[key];
    }
  });

  return merge(extend, now);
}

export function getTsConfig(tsConfigAbsPath: string): any {
  let tsConfig: any;

  if (extname(tsConfigAbsPath) === '.js' || extname(tsConfigAbsPath) === '.ts') {
    tsConfig = require(tsConfigAbsPath);
  } else {
    tsConfig = JSON5.parse(fse.readFileSync(tsConfigAbsPath).toString());
  }

  if (tsConfig.compilerOptions?.paths) {
    Object.keys(tsConfig.compilerOptions.paths).forEach((key) => {
      tsConfig.compilerOptions.paths[key] = tsConfig.compilerOptions.paths[key].map((item: string) =>
        // item 包含 * 的情况不会去掉 /*，如果不包含 * 则会去掉最后的 /
        path.resolve(path.dirname(tsConfigAbsPath), tsConfig.compilerOptions.baseUrl || '.', item),
      );
    });
  }

  if (tsConfig.extends) {
    const extendsTsConfig = getTsConfig(path.resolve(path.dirname(tsConfigAbsPath), tsConfig.extends));

    return mergeTsConfig(tsConfig, extendsTsConfig);
  }

  return tsConfig;
}

export function getAliasPath(config: Config) {
  if (!config.tsConfig) {
    return {};
  }

  const tsConfig = (() => {
    if (typeof config.tsConfig === 'string') {
      return getTsConfig(path.resolve(config.cwd || process.cwd(), config.tsConfig));
    }

    return config.tsConfig
      .map((tsConfig: any) => getTsConfig(path.resolve(config.cwd || process.cwd(), tsConfig)))
      .reduce((pre: any, now: any) => mergeTsConfig(pre, now));
  })();
  const pathMap: Record<string, string[]> = {};

  Object.keys(tsConfig.compilerOptions?.paths || {}).forEach((key) => {
    pathMap[key.replace('*', '')] = tsConfig.compilerOptions.paths[key].map((p: string) => p.replace('*', ''));
  });

  return pathMap;
}

export function resolveImportPath(nowPath: AbsolutePath, target: string, ctx: Context): AbsolutePath {
  const { aliasPathMap } = ctx;

  let targetPath = target;

  // 替换 alias
  Object.keys(aliasPathMap).forEach((alias) => {
    if (targetPath.startsWith(alias)) {
      for (const prefix of aliasPathMap[alias]) {
        const tryPath = targetPath.replace(alias, prefix);

        if (fse.existsSync(formatPath(tryPath))) {
          targetPath = tryPath;
          break;
        }
      }
    }
  });

  if (path.isAbsolute(targetPath)) {
    return new AbsolutePath(targetPath, ctx.cwd || process.cwd());
  }

  if (!target.startsWith('.')) {
    // 没命中 alias 也不是相对路径，则为 npm 包
    return new AbsolutePath(targetPath, ctx.cwd || process.cwd(), true);
  }

  // 相对路径
  return new AbsolutePath(path.resolve(path.dirname(nowPath.path), target), ctx.cwd || process.cwd());
}

/** 相对路径或绝对路径都可 */
export function extname(filePath: string) {
  const regexExt = /\..*$/.exec(path.basename(filePath))?.[0] || '';
  const nodeExt = path.extname(filePath);

  if (nodeExt === regexExt) {
    // 相等意味着扩展名只有一个 .
    return nodeExt;
  }

  if (MultiExtension.includes(regexExt)) {
    // 如果命中白名单里的多.扩展名
    return regexExt;
  }

  return nodeExt;
}

export function replaceExtname(filePath: string, ext: string) {
  const originExt = extname(filePath);
  const regex = new RegExp(`${originExt.replace(/\./g, '\\.')}$`);

  return filePath.replace(regex, ext);
}
