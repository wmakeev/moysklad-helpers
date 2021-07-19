export const noop = (...args: any[]) => {
  args.length
}

export type IsExtends<A, B> = A extends B ? true : false

export function testTypeEqual<T>(t: T) {
  t
}
