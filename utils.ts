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

export function normalizeFontSize(fontSize: number, { maxWidth, maxFontSize }: { maxWidth?: number, maxFontSize?: number } = {}): number {
	const screenWidth = clamp(Dimensions.get('window').width, {max: maxWidth});
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
