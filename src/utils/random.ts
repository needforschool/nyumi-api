export const getRandomInArray = (arr: Array<any>, n: number) => {
  let len = arr.length;
  const result = new Array(n);
  const taken = new Array(len);
  if (n > len) throw new RangeError("More elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};
