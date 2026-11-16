import { formatPersianDate } from "@/shared/dates/calendar";
import { RecoveryRoomListItem } from "../types";

export const headers = [
  { key: "ID", displayLabel: "شماره رکورد" },
  { key: "OrderCode", displayLabel: "کد سفارش" },
  { key: "CustomerName", displayLabel: "نام مشتری" },
  { key: "EntryDate", displayLabel: "تاریخ ورود" },
  { key: "ExitDate", displayLabel: "تاریخ خروج" },
  { key: "GraftedLossCount", displayLabel: "تلفات کل" },
];

export const recoveryRoomCSVData = (data: RecoveryRoomListItem[]) => {
  return data.map((item) => {
    const op = item.Tbl_GraftingOperation;
    const customer =
      op?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;

    return {
      ID: item.ID,
      OrderCode: op?.Tbl_Orders?.OrderCode || "—",
      CustomerName: customer
        ? `${customer.FirstName} ${customer.LastName}`
        : "—",
      EntryDate: formatPersianDate(item.RecoveryEntryDate),
      ExitDate: formatPersianDate(item.RecoveryExitDate),
      GraftedLossCount: item.GraftedLossCount || 0,
    };
  });
};
