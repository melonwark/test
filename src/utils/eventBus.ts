// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import emitter from 'tiny-emitter/instance';
export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
};
