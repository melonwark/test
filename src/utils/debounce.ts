export default function debounce<T extends (...args: never[]) => void>(
  fn: T,
  time: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, time);
  };
}
