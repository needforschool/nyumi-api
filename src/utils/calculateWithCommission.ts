export const calculateWithCommission = (
  price: number,
  commission: number
): number => {
  if (price === 0) return price;

  return (price * commission) / 100 + price;
};
