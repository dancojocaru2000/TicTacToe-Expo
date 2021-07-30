import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { normalizeFontSize } from "./utils";

export function LoadingView(props: LoadingViewProps) {
	const loadingText = props.loadingText ?? 'Loading...';

	return (
		<View style={styles.loadingView}>
			<ActivityIndicator style={{margin: 8,}} animating={true} size="large" />
			<Text style={styles.loadingText}>{loadingText}</Text>
		</View>
	);
}

interface LoadingViewProps {
	loadingText?: string,
}

const styles = StyleSheet.create({
	loadingView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		padding: 8,
		fontSize: normalizeFontSize(16),
	}
});
