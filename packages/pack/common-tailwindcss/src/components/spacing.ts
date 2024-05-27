import { newComponent } from '../utils';

export function spacingPaletteToCssVarMap(obj: Record<string, number>) {
  return newComponent({
    ...Object.entries(obj).reduce<Record<string, string>>((acc, [k, v]) => {
      const key = k.toLowerCase().replace(/[/_]/g, '-');

      acc[`--${key}`] = `${v}px`;

      return acc;
    }, {}),
  });
}
