import { updateHeight } from './avlUtils';

export function rotateRight(y) {
  const x  = y.left;
  const T2 = x.right;
  x.right  = y;
  y.left   = T2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

export function rotateLeft(x) {
  const y  = x.right;
  const T2 = y.left;
  y.left   = x;
  x.right  = T2;
  updateHeight(x);
  updateHeight(y);
  return y;
}
