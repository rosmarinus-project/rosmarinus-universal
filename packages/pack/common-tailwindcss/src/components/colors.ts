import { type Component, newComponent } from '../utils';

export function colorPaletteToCssVarMap(p: Record<string, string>) {
  return newComponent({
    ...Object.entries(p).reduce<Record<string, string>>((acc, [k, v]) => {
      const key = k.toLowerCase().replace(/[/_]/g, '-');

      acc[`--${key}`] = v;

      return acc;
    }, {}),
  });
}

export function colorPaletteToCssVarMapList(p: Record<string, string[]>) {
  const resultList: Component[] = [];

  Object.keys(p).forEach((k) => {
    const key = k.toLowerCase().replace(/[/_]/g, '-');

    p[k].forEach((v, i) => {
      if (!resultList[i]) {
        resultList[i] = newComponent({});
      }

      resultList[i][`--${key}`] = v;
    });
  });

  return resultList;
}
