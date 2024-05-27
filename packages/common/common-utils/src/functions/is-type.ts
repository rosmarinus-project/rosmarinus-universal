export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (isObject(val) || isFunction(val)) && isFunction((val as any).then) && isFunction((val as any).catch);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]';

export const toTypeString = (value: unknown): string => objectToString.call(value);

export const objectToString = Object.prototype.toString;

export const { isArray } = Array;

export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]';

export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]';

export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';
