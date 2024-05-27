import { newComponent } from '../utils';

export const flexCenter = newComponent({
  display: 'flex',
  'justify-content': 'center',
  'align-items': 'center',
});

export const posCenter = newComponent({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});
