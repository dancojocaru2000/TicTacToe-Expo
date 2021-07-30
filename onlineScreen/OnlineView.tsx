import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ActivityIndicator, Button, Divider, Text, TextInput } from "react-native-paper";
import { normalizeFontSize } from "../utils";
import { useState } from "react";
import { nickRegexSelector } from "../reducers/meta";
import { LoggedInView } from './OnlineLoggedView';
import { useEffect } from "react";
import { AppManager } from "../App";
import { sagaActions } from "../sagas";

export function OnlineView(props: OnlineViewProps) {
	const { appManager } = props;
	const loginState = useAppSelector(state => state.me.state);
	const [{ width, height }, setDimensions] = useState(Dimensions.get("window"));
	const [showOnly, setShowOnly] = useState(null as null | "signUp" | "logIn");
	useEffect(() => {
		function onDimensionsChanged() {
			setDimensions(Dimensions.get("window"));
		}
		Dimensions.addEventListener("change", onDimensionsChanged);
		return function cleanup() {
			Dimensions.removeEventListener("change", onDimensionsChanged);
		}
	});
	const landscape = width > height;

	if (loginState === "loggedOut") {
		const dimensionStyle = (() => {
			if (landscape) {
				return [{
					flexDirection: "row" as "row",
				}];
			}
			else {
				return [{
					flexDirection: "column" as "column",
				}];
			}
		})();
		const verticalDivider = landscape ? undefined : <Divider />;
		const signUpView = <SignUpView onInputFocus={() => setShowOnly("signUp")} onInputBlur={() => setShowOnly(null)} />;
		const logInView = <LogInView onInputFocus={() => setShowOnly("logIn")} onInputBlur={() => setShowOnly(null)} />;

		const showSignUpView = landscape || showOnly !== "logIn" ? signUpView : undefined;
		const showLogInView = landscape || showOnly !== "signUp" ? logInView : undefined;
		const showVerticalDivider = showOnly === null ? verticalDivider : undefined;

		return (
			<View style={[styles.mainView, ...dimensionStyle]}>
				{showSignUpView}
				{showVerticalDivider}
				{showLogInView}
			</View>
		);
	}
	else if (loginState === "loading") {
		return (
			<View style={styles.mainView}>
				<View style={styles.loadingInnerView}>
					<ActivityIndicator style={{margin: 8}} animating={true} size="large" />
					<Text style={styles.loadingText}>Logging in...</Text>
				</View>
			</View>
		);
	}
	else {
		return <LoggedInView style={styles.mainView} appManager={appManager} />;
		// return <LoggedInView style={styles.mainView} />;
	}
}

interface OnlineViewProps {
	appManager?: AppManager,
}

interface InputViewProps {
	onInputFocus?: () => void,
	onInputBlur?: () => void,
}

function SignUpView(props: InputViewProps) {
	const { onInputFocus, onInputBlur } = props;
	const [nickname, setNickname] = useState('');
	const nickRegex = useAppSelector(nickRegexSelector);
	const dispatch = useAppDispatch();

	if (!nickRegex) {
		dispatch(sagaActions.fetchNickRegex());
	}

	const validInput = (() => {
		if (!nickname) {
			return false;
		}
		if (!nickRegex) {
			return true;
		}
		return nickRegex.test(nickname);
	})();

	function onSignUpPress() {
		if (onInputBlur) onInputBlur();
		dispatch(sagaActions.signUp(nickname));
	}

	return (
		<View style={{flex: 1, flexGrow: 1,}}>
			<Text style={styles.title}>Sign up</Text>
			<TextInput
				style={styles.textInput}
				mode="outlined"
				label="Nickname"
				value={nickname}
				error={!validInput && !!nickname}
				autoCorrect={false}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				onChangeText={setNickname}/>
			<Button
				style={{alignSelf: "center"}}
				mode="contained"
				onPress={onSignUpPress}
				disabled={!validInput}>
				Sign up
			</Button>
		</View>
	);
}

function LogInView(props: InputViewProps) {
	const { onInputFocus, onInputBlur } = props;
	const [code, setCode] = useState('');
	const dispatch = useAppDispatch();

	const validCode = (() => {
		if (!code) return false;
		if (code.length !== 4) return false;
		const parsed = parseInt(code);
		if (!parsed) return false;
		return true;
	})();

	function onCodeSubmit() {
		if (onInputBlur) onInputBlur();
		dispatch(sagaActions.codeLogIn(code));
	}

	return (
		<View style={{flex: 1, flexGrow: 1,}}>
			<Text style={styles.title}>Log in</Text>
			<TextInput
				style={styles.textInput}
				mode="outlined"
				label="Code"
				placeholder="4 digits"
				value={code}
				autoCorrect={false}
				keyboardType="number-pad"
				returnKeyType="done"
				maxLength={4}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				onChangeText={setCode}/>
			<Button
				style={{alignSelf: "center"}}
				mode="contained"
				onPress={onCodeSubmit}
				disabled={!validCode}>
				Log in
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
	},
	title: {
		padding: 8,
		alignSelf: "center",
		fontSize: normalizeFontSize(28),
	},
	loadingInnerView: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	textInput: {
		// maxWidth: 400,
		// alignSelf: "center",
		margin: 8,
	},
	loadingText: {
		padding: 8,
		fontSize: normalizeFontSize(16),
	},
});
