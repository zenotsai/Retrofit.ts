export default function compose(middle) {
  let index = 0;
  function handler(ctx) {
    if (index < middle.length) {
      const fn = middle[index];
      if (!fn.handler) {
        return handler(ctx);
      }
      const newCtx = fn.handler(ctx);
      if (!newCtx) {
        return Promise.resolve(ctx);
      }
      index += 1;
      return handler(newCtx);
    }
    return Promise.resolve(ctx);
  }
  return handler;
}
