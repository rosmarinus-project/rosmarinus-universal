import { type PresetsConfig } from 'tailwindcss/types/config';
import plugin from 'tailwindcss/plugin';
import { arrToPercentObj, arrToPxObj, arrToScreenWidthObj, range, arrToScreenHeightObj } from './utils';
import { layout, text } from './components';

export const presets: PresetsConfig = {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      fontSize: {
        ...arrToPxObj([10, 12, 14, 16, 20]),
      },
      spacing: {
        ...arrToPxObj(range(0, 100)),
        ...arrToPercentObj(range(0, 100)),
      },
      width: {
        ...arrToScreenWidthObj(range(0, 100)),
      },
      height: {
        ...arrToScreenHeightObj(range(0, 100)),
      },
      zIndex: { 1: '1', 0: '0', dialog: '1000' },
      flex: { 1: '1' },
      borderWidth: {
        ...arrToPxObj([1]),
      },
      borderRadius: {
        ...arrToPxObj([2, 4, 12]),
        half: '50%',
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        // center in flex
        '.p-flex-center': layout.flexCenter,
        // center in absolute
        '.p-pos-center': layout.posCenter,
        '.p-no-select': text.noSelect,
        '.p-bold': text.bold,
        '.p-ellipsis': text.ellipsis,
        '.p-ellipsis-2': text.multilineEllipsis(2),
        '.p-ellipsis-3': text.multilineEllipsis(3),
      });
    }),
  ],
};

export * as utils from './utils';

export * as components from './components';
