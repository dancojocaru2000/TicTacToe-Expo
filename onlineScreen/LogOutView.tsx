import React from "react";
import { actions as meActions } from '../reducers/me';
import { useAppDispatch } from "../hooks";
import { StyleSheet, View } from "react-native";
import { Button, Colors, Text } from "react-native-paper";
import { normalizeFontSize } from "../utils";

export function LogOutView(props: LogOutViewProps) {
	const { goBack } = props;

	const dispatch = useAppDispatch();

	function onLogOut() {
		goBack();
		dispatch(meActions.logOut());
	}

	return (
		<View style={styles.mainView}>
			<Text style={styles.titleText}>
				Are you sure
				you want to&nbsp;log&nbsp;out?
			</Text>
			<Text style={styles.detailText}>If you aren't logged in from another device, you may not be able to log back into your account.</Text>
			<Button mode="contained" color={ Colors.red600 } onPress={onLogOut}>Log Out</Button>
		</View>
	);
}

interface LogOutViewProps {
	goBack: () => void,
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	titleText: {
		fontSize: normalizeFontSize(24),
		textAlign: "center",
	},
	detailText: {
		fontSize: normalizeFontSize(12),
		padding: 8,
	}
});
