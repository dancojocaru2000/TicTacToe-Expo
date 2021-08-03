import { Dimensions, PixelRatio } from 'react-native';

export const array2Dfy = function <T>(
  normalArray: Array<T>,
  itemsPerRow: number,
): Array<Array<T>> {
  const result = [];

  // eslint-disable-next-line no-restricted-syntax, no-labels
  first: for (let i = 0; ; i += 1) {
    const currentArray = [];
    for (let j = 0; j < itemsPerRow; j += 1) {
      const normalIndex = i * itemsPerRow + j;
      if (normalIndex >= normalArray.length) {
        result.push(currentArray);
        // eslint-disable-next-line no-labels
        break first;
      }
      currentArray.push(normalArray[normalIndex]);
    }
    result.push(currentArray);
  }

  return result;
};

export const clamp = function (
  value: number,
  { min, max }: { min?: number; max?: number } = {},
): number {
  if (min && value < min) {
    return min;
  }
  if (max && value > max) {
    return max;
  }

  return value;
};

export const normalizeFontSize = function (
  fontSize: number,
  {
    maxWidth,
    maxFontSize,
    replacementWidth,
  }: {
    maxWidth?: number;
    maxFontSize?: number;
    replacementWidth?: number;
  } = {},
): number {
  const screenWidth = clamp(
    replacementWidth ?? Dimensions.get('window').width,
    { max: maxWidth },
  );
  // const screenWidth = Dimensions.get('window').width;
  const scale = screenWidth / 320; // magic number time!; obtained from: https://stackoverflow.com/questions/33628677/react-native-responsive-font-size
  const newSize = fontSize * scale;
  return clamp(Math.round(PixelRatio.roundToNearestPixel(newSize)), {
    max: maxFontSize,
  });
};

export const arrayReplace = function <T>(
  array: Array<T>,
  replaceWith: Array<[number, T]> | [number, T],
): Array<T> {
  const isNested = function (
    arr: Array<[number, T]> | [number, T],
  ): arr is Array<[number, T]> {
    return Array.isArray(arr[0]);
  };

  if (isNested(replaceWith)) {
    replaceWith.forEach(([idx, newValue]) => {
      // eslint-disable-next-line no-param-reassign
      array[idx] = newValue;
    });
  } else {
    const [idx, newValue] = replaceWith;
    // eslint-disable-next-line no-param-reassign
    array[idx] = newValue;
  }
  return array;
};

export const assertNotUndefined = function <T>(
  value: T | undefined,
): asserts value {
  if (value === undefined) {
    throw new Error('Value must be defined!');
  }
};

export const assertNotNull = function <T>(value: T | null): asserts value is T {
  if (value === null) {
    throw new Error('Value is null!');
  }
};

export const promiseTimeout = function (millis: number): Promise<void> {
  return new Promise((accept) => setTimeout(accept, millis));
};

export const debounceLast = function <
  P extends unknown[],
  Fn extends (...any: P) => unknown,
>(fn: Fn, millis: number): (...args: P) => void {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  return (...args: P) => {
    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle);
    }
    timeoutHandle = setTimeout(() => {
      fn(...args);
    }, millis);
  };
};

export const debounceFirst = function <
  P extends unknown[],
  Fn extends (...any: P) => unknown,
>(fn: Fn, millis: number): (...args: P) => void {
  let lastRunDate: number | null = null;

  return (...args: P) => {
    if (lastRunDate === null || Date.now() - lastRunDate >= millis) {
      fn(...args);
      lastRunDate = Date.now();
    }
  };
};

export type Unpromisify<T> = T extends Promise<infer R> ? R : never;
