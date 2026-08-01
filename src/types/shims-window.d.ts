interface Window {
  confirmation: (
    callback: () => void,
    cancelCallback: (() => void) | null,
    message: string
  ) => void;
}
