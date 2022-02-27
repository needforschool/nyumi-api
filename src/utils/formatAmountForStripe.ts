type Options = {
  currency: string;
};

const DEFAULT_OPTIONS: Options = {
  currency: "eur",
};

const _normalizeAmount = (amount: string | number): number | null => {
  if (!["number", "string"].includes(typeof amount) || amount === "") {
    return null;
  }
  const _amount = Number(amount);

  if (Number.isNaN(_amount) || (!Number.isFinite(_amount) && _amount !== 0)) {
    return null;
  }

  return _amount;
};

export const formatAmountForStripe = (
  amount: number | string,
  options: Options = DEFAULT_OPTIONS
): number | null => {
  const _amount = _normalizeAmount(amount);

  if (_amount === null) {
    throw new Error(`"${amount}" is not a valid amount.`);
  }

  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: options.currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(_amount);

  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  const result = _normalizeAmount(
    zeroDecimalCurrency ? amount : Math.round(_amount * 100)
  );

  return result;
};
