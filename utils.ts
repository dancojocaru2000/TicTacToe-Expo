import { Dimensions, PixelRatio } from "react-native";

export function array2Dfy<T>(normalArray: Array<T>, itemsPerRow: number) : Array<Array<T>> {
	const result = [];

	first: for (let i = 0; ; i++) {
		const currentArray = [];
		for (let j = 0; j < itemsPerRow; j++) {
			const normalIndex = i * itemsPerRow + j;
			if (normalIndex >= normalArray.length) {
				result.push(currentArray);
				break first;
			}
			currentArray.push(normalArray[normalIndex]);
		}
		result.push(currentArray);
	}

	return result;
}

export function normalizeFontSize(fontSize: number, { maxWidth, maxFontSize, replacementWidth }: { maxWidth?: number, maxFontSize?: number, replacementWidth?: number } = {}): number {
	const screenWidth = clamp(replacementWidth ?? Dimensions.get('window').width, {max: maxWidth});
	// const screenWidth = Dimensions.get('window').width;
	const scale = screenWidth / 320; // magic number time!; obtained from: https://stackoverflow.com/questions/33628677/react-native-responsive-font-size
	const newSize = fontSize * scale;
	return clamp(Math.round(PixelRatio.roundToNearestPixel(newSize)), {max: maxFontSize});
}

export function clamp(value: number, { min, max }: { min?: number, max?: number } = {}): number {
	if (min && value < min) {
		return min;
	}
	else if (max && value > max) {
		return max;
	}
	else {
		return value;
	}
}

export function arrayReplace<T>(array: Array<T>, replaceWith: Array<[number, T]> | [number, T]) : Array<T> {
	function isNested(array: Array<[number, T]> | [number, T]): array is Array<[number, T]> {
		return Array.isArray(array[0]);
	}

	if (isNested(replaceWith)) {
		for (const [idx, newValue] of replaceWith) {
			array[idx] = newValue;
		}
	}
	else {
		array[replaceWith[0]] = replaceWith[1];
	}
	return array;
}

export function assertNotUndefined<T>(value: T | undefined): asserts value {
	if (value === undefined) {
		throw new Error("Value must be defined!");
	}
}

export function assertNotNull<T>(value: T | null): asserts value is T {
	if (value === null) {
		throw new Error("Value is null!");
	}
}

export function promiseTimeout(millis: number) {
	return new Promise((accept) => setTimeout(accept, millis));
}

export function debounceLast<P extends unknown[], Fn extends (...any: P) => any>(fn: Fn, millis: number): (...args: P) => void {
	let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

	return (...args: P) => {
		if (timeoutHandle !== null) {
			clearTimeout(timeoutHandle);
		}
		timeoutHandle = setTimeout(() => {
			fn.apply(null, args);
		}, millis);
	};
}

export function debounceFirst<P extends unknown[], Fn extends (...any: P) => any>(fn: Fn, millis: number): (...args: P) => void {
	let lastRunDate: number | null = null;

	return (...args: P) => {
		if (lastRunDate === null || Date.now() - lastRunDate >= millis) {
			fn.apply(null, args);
			lastRunDate = Date.now();
		}
	};
}
