import React, { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, ProgressBar, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { LoadingView } from "../utilViews/LoadingView";
import { actions as meActions, loginCodeSelector } from "../reducers/me";
import { sagaActions } from "../sagas";
import { normalizeFontSize } from "../utils";

export function LoginCodeView(props: LoginCodeViewProps) {
	const { goBack } = props;

	const dispatch = useAppDispatch();
	const loginCode = useAppSelector(loginCodeSelector);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!loginCode) {
			dispatch(sagaActions.getLoginCode());
		}
		else if (loginCode !== "loading" && loginCode.expiryDate.getTime() < Date.now()) {
			dispatch(meActions.resetLoginCode(loginCode));
			dispatch(sagaActions.getLoginCode());
		}
	}, [loginCode]);

	useEffect(() => {
		const intervalHandle = setInterval(() => {
			if (loginCode && loginCode !== "loading") {
				const total = loginCode.expiryDate.getTime() - loginCode.issueDate.getTime();
				const partial = Date.now() - loginCode.issueDate.getTime();
				const progress = total === 0 ? 0 : partial / total;
				setProgress(progress);
			}
		}, 30);
		return function cleanup() {
			clearInterval(intervalHandle);
		};
	})

	if (!loginCode) {
		return (
			<View />
		);
	}
	else if (loginCode === "loading") {
		return (
			<LoadingView loadingText="Getting login code..." />
		);
	}
	else {
		return (
			<View style={styles.container}>
				<Text style={styles.helperText}>Your login code is</Text>
				<Text style={styles.loginCodeText}>{loginCode.code}</Text>
				<View style={styles.progressBarContainer}>
					<ProgressBar progress={progress} color={Colors.indigo800}/>
				</View>
			</View>
		);
	}
}

interface LoginCodeViewProps {
	goBack: () => void,
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	helperText: {
		fontSize: normalizeFontSize(32),
	},
	loginCodeText: {
		fontSize: normalizeFontSize(72),
		fontWeight: "bold",
		padding: 8,
		alignSelf: "center",
	},
	progressBarContainer: {
		margin: 8,
		width: "90%",
	},
});
