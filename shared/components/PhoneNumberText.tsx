import { toPersianDigits } from "@/shared/utils/digits";

export default function PhoneNumberText({
  value,
}: {
  value: string | null | undefined;
}) {
  return value ? (
    <bdi dir="ltr" className="tabular-nums">
      {toPersianDigits(value)}
    </bdi>
  ) : (
    "—"
  );
}
