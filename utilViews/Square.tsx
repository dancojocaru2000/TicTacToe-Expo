import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { normalizeFontSize } from "../utils";

export default function Square(props: SquareProps) {
	const { style, value, onPress, smallFont } = props;

	const styles = StyleSheet.create({
		square: {
			padding: smallFont ? 2 : 8,
			borderWidth: 2,
			flex: 1,
			aspectRatio: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		text: {
			fontSize: normalizeFontSize(smallFont ? 10 : 36, {maxWidth: 600 }),
		},
	})

	const content = (
		<Text style={styles.text}>{value}</Text>
	);

	if (value || !onPress) {
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
	smallFont?: boolean,
}
