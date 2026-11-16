import { toLatinDigits } from "./digits";

// Iranian mobile numbers and geographic area codes without the domestic 0.
const iranianNationalNumber =
  /^(?:9\d|11|13|17|21|23|24|25|26|28|31|34|35|38|41|44|45|51|54|56|58|61|66|71|74|76|77|81|83|84|86|87)\d{8}$/;

export function normalizeIranianPhone(value: string) {
  const phone = toLatinDigits(value).trim();
  const digits = phone.replace(/[\s().-]/g, "");
  return iranianNationalNumber.test(digits) ? `0${digits}` : phone;
}
