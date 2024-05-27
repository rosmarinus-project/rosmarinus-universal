import type { PropertiesHyphen } from 'csstype';

export function arrToPxObj(arr: number[]) {
  return arr.reduce<Record<number, string>>((acc, cur) => {
    acc[cur] = `${cur}px`;

    return acc;
  }, {});
}

export function arrToPercentObj(arr: number[]) {
  return arr.reduce<Record<string, string>>((acc, cur) => {
    acc[`${cur}%`] = `${cur}%`;

    return acc;
  }, {});
}

export function arrToCssVarObj(arr: string[]) {
  return arr.reduce<Record<string, string>>((acc, cur) => {
    const key = cur.toLowerCase().replace(/[/_]/g, '-').replace(/^[-]+/, '');

    acc[key] = `var(--${key})`;

    return acc;
  }, {});
}

export function arrToScreenWidthObj(arr: number[]) {
  return arr.reduce<Record<string, string>>((acc, cur) => {
    acc[`screen-${cur}`] = `${cur}vw`;

    return acc;
  }, {});
}

export function arrToScreenHeightObj(arr: number[]) {
  return arr.reduce<Record<string, string>>((acc, cur) => {
    acc[`screen-${cur}`] = `${cur}vh`;

    return acc;
  }, {});
}

export function range(start: number, end: number) {
  const arr: number[] = [];

  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
}

export interface Component {
  [key: string]: string | Component;
}

export function newComponent(style: PropertiesHyphen): Component {
  return style as any;
}
