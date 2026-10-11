// Read-only introspection confirmed that the current database has neither the
// recovery table nor the worker loss column. Keep the feature explicit instead
// of pretending that missing storage is an empty list or a successful write.
export const RECOVERY_UNAVAILABLE_MESSAGE =
  "ثبت ریکاوری در دیتابیس فعلی در دسترس نیست؛ جدول ریکاوری و ستون تلفات کارگر وجود ندارند. هیچ داده‌ای تغییر نکرده است.";
