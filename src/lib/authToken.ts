type TokenGetter = (() => Promise<string | null>) | null;

let getTokenFn: TokenGetter = null;

export function setTokenGetter(fn: TokenGetter): void {
  getTokenFn = fn;
}

export function getTokenGetter(): TokenGetter {
  return getTokenFn;
}
