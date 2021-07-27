import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { normalizeFontSize } from "./utils";

export default function Square(props: SquareProps) {
	const { style, value, onPress } = props;

	const content = (
		<Text style={styles.text}>{value}</Text>
	);

	if (value) {
		return (
			<View style={[style, styles.square]}>
				{content}
			</View>
		);
	}
	else {
		return (
			<TouchableOpacity style={[style, styles.square]} onPress={onPress}>
				<View>
					{content}
				</View>
			</TouchableOpacity>
		)
	}
}

type SquareProps = {
	style?: any,
	value: string | null,
	onPress?: () => void,
}

const styles = StyleSheet.create({
	square: {
		padding: 8,
		borderWidth: 2,
		flex: 1,
		aspectRatio: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: normalizeFontSize(36, {maxWidth: 600,}),
	},
})
