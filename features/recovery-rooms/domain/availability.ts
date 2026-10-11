// Read-only introspection confirmed that the current database has neither the
// recovery table nor the worker loss column. Keep the feature explicit instead
// of pretending that missing storage is an empty list or a successful write.
export const RECOVERY_UNAVAILABLE_MESSAGE =
  "بخش ریکاوری در حال حاضر در دسترس نیست.";
