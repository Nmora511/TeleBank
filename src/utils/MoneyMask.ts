export function moneyMask(value: number | string): string {
  value =
    typeof moneyMask === "string"
      ? removeMoneyMask(String(value))
      : (value as number);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function removeMoneyMask(value: string): number {
  let numericValue = value.replace(/[^\d,]/g, "");

  numericValue = numericValue.replace(",", ".");

  return parseFloat(numericValue);
}
