import { resolve as resolvePath } from 'path';
import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import strip, { RollupStripOptions } from '@rollup/plugin-strip';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin, ModuleFormat } from 'rollup';

export interface TsOptions {
  tsconfig?: string;
  outDir?: string;
}

export interface StripOptions extends RollupStripOptions {
  removeConsole?: boolean;
  removeDebugger?: boolean;
  removeAssert?: boolean;
}

export interface Options {
  ts?: RollupTypescriptOptions;
  babel?: false | RollupBabelInputPluginOptions;
  strip?: boolean | StripOptions;
  src?: FilterPattern;
  replace?: Record<string, string>;
  alias?: false | Record<string, string>;
}

function loadJs(filePath: string) {
  try {
    return require(filePath);
  } catch (e) {
    return undefined;
  }
}

function getDefaultBabelConfig() {
  const config =
    loadJs(resolvePath('./babel.config.js')) ||
    loadJs(resolvePath('./babel.config.cjs')) ||
    loadJs(resolvePath('./.babelrc.js')) ||
    loadJs(resolvePath('./.babelrc'));

  const presets = config?.presets || [];
  const plugins = config?.plugins || [];

  return { presets, plugins };
}

export function defaultConfigGenerator(format: ModuleFormat, external?: string[], banner?: string) {
  const ext = (() => {
    if (format === 'cjs' || format === 'commonjs') {
      return 'cjs';
    }

    return 'js';
  })();

  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.${ext}`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [common()],
  };
}

export function getDefaultRollupConfig() {
  return [defaultConfigGenerator('cjs'), defaultConfigGenerator('es')];
}

export function common(options?: Options): Plugin[] {
  const { src = ['src/**/*'], ts, babel: babelConfig, strip: stripConfig, replace: replaceConfig } = options || {};

  const entries = options?.alias === false ? [] : [{ find: '@src', replacement: resolvePath('src') }];

  Object.entries(options?.alias || {}).forEach(([find, replacement]) => {
    entries.push({ find, replacement });
  });
  const plugins = [
    commonjs(),
    alias({
      entries,
    }),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    typescript({
      ...ts,
      tsconfig: ts?.tsconfig || './tsconfig.json',
    }),
  ];

  if (replaceConfig) {
    plugins.unshift(
      replace({
        preventAssignment: true,
        values: replaceConfig,
      }),
    );
  }

  if (babelConfig !== false) {
    plugins.push(
      babel({
        ...getDefaultBabelConfig(),
        ...babelConfig,
        babelHelpers: babelConfig?.babelHelpers || 'bundled',
        extensions: babelConfig?.extensions ?? ['.js', '.ts', '.jsx', '.tsx'],
        include: babelConfig?.include || src,
      }),
    );
  }

  if (stripConfig) {
    if (stripConfig === true) {
      plugins.push(
        strip({
          include: src,
          debugger: true,
          functions: ['console.*', 'assert.*'],
        }),
      );
    } else {
      const { removeConsole, removeDebugger, removeAssert, ...rest } = stripConfig;

      plugins.push(
        strip({
          include: src,
          debugger: removeDebugger,
          functions: [
            ...(removeConsole ? ['console.*'] : []),
            ...(removeAssert ? ['assert.*'] : []),
            ...(rest.functions || []),
          ],
          ...rest,
        }),
      );
    }
  }

  return plugins;
}

export default common;
