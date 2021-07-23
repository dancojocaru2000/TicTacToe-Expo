import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Square from "./Square";
import { array2Dfy, clamp, normalizeFontSize } from "./utils";

export default function Board(props: BoardProps) {
	const { style, rows, columns, onItemPress } = props;

	function _onItemPress(row: number, column: number) {
		const idx = row * columns + column;
		onItemPress(idx);
	}

	const items = array2Dfy(props.items, columns);
	const renderItems = items.map((row, rIdx) => {
		const renderRow = row.map((item, iIdx) => (
			<Square style={styles.squares} key={`${rIdx}-${iIdx}`} value={item} onPress={() => _onItemPress(rIdx, iIdx)} />
		));
		return (
			<View key={`${rIdx}-row`} style={styles.row}>
				{renderRow}
			</View>
		);
	});

	return (
		<View style={[style, styles.board]}>
			{renderItems}
		</View>
	);
}

type BoardProps = {
	style?: any,
	rows: number,
	columns: number,
	items: Array<string | null>,
	onItemPress: (idx: number) => void,
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