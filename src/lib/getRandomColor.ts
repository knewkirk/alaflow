export default () => {
  let num = '';
  do {
    const rand = Math.round(16777216 * Math.random());
    const hex = rand.toString(16);
    num = hex;
  } while (num.length < 6);
  return num;
}
