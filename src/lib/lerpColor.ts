import { MathUtils, Color } from 'three';

export default (one: THREE.Color, two: THREE.Color, t: number): THREE.Color => {
  const r = MathUtils.lerp(one.r, two.r, t);
  const b = MathUtils.lerp(one.b, two.b, t);
  const g = MathUtils.lerp(one.g, two.g, t);
  return new Color(r, g, b);
};
