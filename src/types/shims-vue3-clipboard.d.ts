declare module 'vue3-clipboard' {
  interface ClipboardSuccessEvent {
    text: string;
    success: boolean;
  }

  interface ClipboardOptions {
    copy: (value: string) => void;
    success: (event: ClipboardSuccessEvent) => void;
  }

  const VueClipboard: {
    install: (app: any, options: ClipboardOptions) => void;
  };

  export default VueClipboard;
}
