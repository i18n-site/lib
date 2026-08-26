/**
 * Compare two attributes with each other.
 *
 * @param a An attribute token.
 * @param b An attribute token.
 * @param sortAttributes How to sort attributes.
 * @param sortAttributesBeginning Attributes that should sorted to the beginning.
 * @param sortAttributesEnd Attributes that should sorted to the end.
 * @returns The compare result.
 */
export function compareAttributeToken(
  a,
  b,
  sortAttributes,
  sortAttributesBeginning,
  sortAttributesEnd,
) {
  const sortPatternsBeginning = sortAttributesBeginning
    .map((sort) => new RegExp(sort))
    .toReversed();
  const sortPatternsEnd = sortAttributesEnd.map((sort) => new RegExp(sort));
  const aName = a.name;
  const bName = b.name;
  if (sortPatternsBeginning.length > 0) {
    const aBeginningIndex = sortPatternsBeginning.findIndex((pattern) => pattern.test(aName));
    const bBeginningIndex = sortPatternsBeginning.findIndex((pattern) => pattern.test(bName));
    const beginning = aBeginningIndex - bBeginningIndex;
    if (beginning > 0) {
      return -1;
    }
    if (beginning < 0) {
      return 1;
    }
  }
  if (sortPatternsEnd.length > 0) {
    const aEndIndex = sortPatternsEnd.findIndex((pattern) => pattern.test(aName));
    const bEndIndex = sortPatternsEnd.findIndex((pattern) => pattern.test(bName));
    const end = aEndIndex - bEndIndex;
    if (end > 0) {
      return 1;
    }
    if (end < 0) {
      return -1;
    }
  }
  switch (sortAttributes) {
    case "asc": {
      if (aName > bName) {
        return 1;
      }
      if (aName < bName) {
        return -1;
      }
      break;
    }
    case "desc": {
      if (aName > bName) {
        return -1;
      }
      if (aName < bName) {
        return 1;
      }
      break;
    }
  }
  return 0;
}
/**
 * Sort an array with a given compare function.
 *
 * @param array The array to sort.
 * @param compare A function for comparing the values.
 * @returns The sorted array.
 */
export function stableSort(array, compare) {
  const entries = array.map((value, index) => [value, index]);
  entries.sort((a, b) => {
    const order = compare(a[0], b[0]);
    // When order is 0, sort by index to make the sort stable
    return order === 0 ? a[1] - b[1] : order;
  });
  return entries.map(([value]) => value);
}
/**
 * Partially sorts an array.
 *
 * @param arr The array to sort.
 * @param start The start from where to sort.
 * @param end The end to where to sort.
 * @param compareFn A function for comparing the values.
 * @returns The sorted array.
 */
export function partialSort(arr, start, end, compareFn) {
  const preSort = arr.slice(0, start);
  const postSort = arr.slice(end);
  const attributes = arr.slice(start, end);
  const sorted = stableSort(attributes, compareFn);
  return [...preSort, ...sorted, ...postSort];
}
