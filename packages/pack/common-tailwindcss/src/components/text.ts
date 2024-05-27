import { newComponent } from '../utils';

export const noSelect = newComponent({
  '-webkit-touch-callout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
});

export const bold = newComponent({
  'font-weight': '500',
});

export const ellipsis = newComponent({
  overflow: 'hidden',
  'text-overflow': 'ellipsis',
  'white-space': 'nowrap',
  'word-wrap': 'normal',
});

export const multilineEllipsis = (line: number) => {
  return newComponent({
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    /* autoprefixer: off */
    '-webkit-box-orient': 'vertical',
    /* autoprefixer: on */
    '-webkit-line-clamp': String(line),
  });
};
