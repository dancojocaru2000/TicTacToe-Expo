import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Square from "./Square";
import { array2Dfy, clamp, normalizeFontSize } from "./utils";
import Svg, { Line } from 'react-native-svg';

export default function Board(props: BoardProps) {
	const { style = {}, rows, columns, onItemPress, winIdx, interactive, small} = props;
	if (small) {
		style.width = 150;
	}

	function _onItemPress(row: number, column: number) {
		if (!onItemPress) return;
		const idx = row * columns + column;
		onItemPress(idx);
	}

	const items = array2Dfy(props.items, columns);
	const renderItems = items.map((row, rIdx) => {
		const renderRow = row.map((item, iIdx) => {
			const onPressProp = {} as { onPress?: () => void };
			if (interactive) {
				onPressProp.onPress = () => _onItemPress(rIdx, iIdx);
			}
			return (
				<Square style={styles.squares} smallFont={small} key={`${rIdx}-${iIdx}`} value={item} {...onPressProp} />
			)
		});
		return (
			<View key={`${rIdx}-row`} style={styles.row}>
				{renderRow}
			</View>
		);
	});

	function getWinLineCoords() {
		if (!winIdx && winIdx !== 0) {
			return;
		}

		if (0 <= winIdx && winIdx <= 2) {
			const ys = [17, 50, 83]
			return {
				x1: 5,
				y1: ys[winIdx],
				x2: 95,
				y2: ys[winIdx],
			};
		}
		else if (3 <= winIdx && winIdx <= 5) {
			const xs = [17, 50, 83]
			return {
				x1: xs[winIdx - 3],
				y1: 5,
				x2: xs[winIdx - 3],
				y2: 95,
			};
		}
		else if (winIdx === 6) {
			return {
				x1: 5,
				y1: 5,
				x2: 95,
				y2: 95,
			}
		}
		else {
			return {
				x1: 95,
				y1: 5,
				x2: 5,
				y2: 95,
			}
		}
	}

	function getWinLine() {
		const coords = getWinLineCoords();
		if (!coords) {
			return;
		}
		return (
			<Line stroke="black" opacity={1} {...coords}/>
		)
	}

	return (
		<View style={[styles.board, style]}>
			{renderItems}
			<View style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="box-none">
				<Svg style={{}} width="100%" height="100%" viewBox="0 0 100 100">
					{getWinLine()}
				</Svg>
			</View>
		</View>
	);
}

type BoardProps = {
	style?: any,
	rows: number,
	columns: number,
	items: Array<string | null>,
	onItemPress?: (idx: number) => void,
	winIdx?: number | null,
	interactive: boolean,
	small?: boolean,
}

const styles = StyleSheet.create({
	board: {
		padding: 8,
		maxWidth: clamp(600, {max: Dimensions.get('window').height - 200}),
		width: '100%',
	},
	row: {
		flexDirection: "row",
		alignItems: "stretch",
	},
	squares: {
		flexGrow: 1,
		alignItems: "stretch",
	},
});