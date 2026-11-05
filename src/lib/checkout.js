// Store pricing rules used by the cart and checkout UI.
// NOTE: your backend decides what Stripe actually charges. Shipping and
// discounts shown here are display-side until the backend applies the same rules.

export const FREE_SHIPPING_THRESHOLD = 50; // order value (after discounts) that unlocks free shipping
export const SHIPPING_FEE = 5; // flat fee below the threshold. Set to 0 to hide shipping + the progress bar

const round2 = (n) => Math.round(n * 100) / 100;

export const money = (n) => `$${Number(n).toFixed(2)}`;

// Price a customer pays per unit (after the product's discount)
export function unitPrice(product) {
  const d = product.discountPercentage || 0;
  return d > 0 ? Math.round(product.price * (100 - d)) / 100 : product.price;
}

export function calcTotals(items) {
  let listSubtotal = 0;
  let merchandise = 0;
  let qty = 0;

  for (const item of items) {
    listSubtotal += item.product.price * item.quantity;
    merchandise += unitPrice(item.product) * item.quantity;
    qty += item.quantity;
  }

  listSubtotal = round2(listSubtotal);
  merchandise = round2(merchandise);
  const discount = round2(listSubtotal - merchandise);
  const shipping =
    merchandise === 0 || SHIPPING_FEE === 0 || merchandise >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  return {
    qty,
    listSubtotal,
    discount,
    merchandise,
    shipping,
    total: round2(merchandise + shipping),
  };
}