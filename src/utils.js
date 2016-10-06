/**
 * Returns a new set representing the union of a and b.
 */
export function union(a, b) {
  let s = new Set(a);
  addAll(s, b);
  return s;
}

/**
 * Adds all items from the set b to a.
 */
export function addAll(a, b) {
  for (let x of b) {
    a.add(x);
  }
}

/**
 * Returns whether two sets are equal
 */
export function equal(a, b) {
  if (a === b)
    return true;

  if (a.size !== b.size)
    return false;

  for (let x of a) {
    if (!b.has(x)) {
      return false;
    }
  }

  return true;
}
