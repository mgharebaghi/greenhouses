import type DateObject from "react-date-object";
export type FormValues<T> = {
  [K in keyof T]: Extract<T[K], Date> extends never ? T[K] : T[K] | DateObject;
};
