import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Dimensions, FlatList, ListRenderItemInfo, StyleSheet, View, ViewPagerAndroidBase } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { AppManager } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loggedInViewPageSelector } from "../reducers/app";
import { userIdSelector } from "../reducers/me";
import { userSelector, usersStateSelector } from "../reducers/users";
import { actions as appActions } from '../reducers/app';
import { normalizeFontSize } from "../utils";
import { LeaderboardView } from "./LeaderboardView";
import { sagaActions } from "../sagas";
import { LoadingView } from "../utilViews/LoadingView";
import { LoginCodeView } from "./LoginCodeView";
import { LogOutView } from "./LogOutView";

export function LoggedInView(props: LoggedInViewProps) {
	const { style, appManager } = props;
	const [dimensions, setDimensions] = useState(Dimensions.get('screen'));
	const selectedPage = useAppSelector(loggedInViewPageSelector);
	const userId = useAppSelector(userIdSelector);
	const user = useAppSelector(userSelector(userId!));
	const usersState = useAppSelector(usersStateSelector);
	const dispatch = useAppDispatch();
	const landscape = dimensions.width > dimensions.height;

	function setSelectedPage(page: null | string) {
		dispatch(appActions.setLoggedInViewPage(page));
	}

	const pages = [
		// {
		// 	key: 'onlineGames',
		// 	title: 'Online Games',
		// 	content: <View />,
		// },
		{
			key: 'leaderboard',
			title: 'Leaderboard',
			content: <LeaderboardView />,
		},
		{
			key: 'codeLogin',
			title: 'Login Code',
			content: <LoginCodeView goBack={() => setSelectedPage(null)} />,
		},
		{
			key: 'logOut',
			title: 'Log Out',
			content: <LogOutView goBack={() => setSelectedPage(null)} />,
		},
	];

	function renderMenuListItem({ item }: ListRenderItemInfo<{ key: string, title: string, description?: string, content: React.ReactElement }>) {
		const selectedStyle = selectedPage === item.key ? styles.menuListSelectedStyle : undefined;
		return (
			<List.Item
				style={selectedStyle}
				title={item.title}
				description={item.description}
				onPress={() => setSelectedPage(item.key)} />
		);
	}

	useEffect(() => {
		function onDimensionsChanged() {
			setDimensions(Dimensions.get('screen'));
		}
		Dimensions.addEventListener("change", onDimensionsChanged);
		return function cleanup() {
			Dimensions.removeEventListener("change", onDimensionsChanged);
		}
	}, []);

	const onBack = useCallback(() => setSelectedPage(null), []);

	useEffect(() => {
		appManager?.addEventListener("back", onBack);
		appManager?.addEventListener("tabTap", onBack);
		return function cleanup() {
			appManager?.removeEventListener("back", onBack);
			appManager?.removeEventListener("tabTap", onBack);
		}
	}, [appManager]);

	useEffect(() => {
		if (landscape || selectedPage === null) {
			appManager?.hideBack();
			appManager?.setTitle();
		}
		else {
			appManager?.showBack();
			appManager?.setTitle(pages.find(p => p.key === selectedPage)?.title);
		}
	}, [dimensions, selectedPage]);

	if (!user) {
		if (usersState === "idle") {
			dispatch(sagaActions.fetchUsers());
		}
		return (
			<LoadingView loadingText="Loading users..." />
		);
	}
	
	const titleText = <Text style={styles.title}>Hello, {user?.nickname}!</Text>;

	const menuList = (
		<FlatList data={pages} renderItem={renderMenuListItem} keyExtractor={(i) => i.key} />
	);

	if (landscape) {
		return (
			<View style={[style]}>
				{titleText}
				<View style={styles.landscapeViewStyle}>
					<View style={styles.landscapeMenuList}>
						{menuList}
					</View>
					<View style={styles.landscapeContentPane}>
						{pages.find(p => p.key === selectedPage)?.content}
					</View>
				</View>
			</View>
		);
	}
	else {
		return (
			<View style={[style]} >
				{!selectedPage ? titleText : undefined}
				{!selectedPage ? <View style={{flex: 1, flexGrow: 1}}>{menuList}</View> : undefined}
				{selectedPage ? <View style={{flex:1, flexGrow:1}}>{pages.find(p => p.key === selectedPage)?.content}</View> : undefined}
			</View>
		);
	}
}

interface LoggedInViewProps {
	style?: any,
	appManager?: AppManager,
}

const styles = StyleSheet.create({
	landscapeViewStyle: {
		flex: 1,
		flexGrow: 1,
		flexDirection: "row",
		alignContent: "stretch",
		alignItems: "stretch",
	},
	landscapeMenuList: {
		width: 175,
	},
	landscapeContentPane: {
		flex: 1,
		flexGrow: 1,
	},
	menuListSelectedStyle: {
		backgroundColor: "#CFD8DC",
	},
	loadingText: {
		padding: 8,
		fontSize: normalizeFontSize(16),
	},
	title: {
		padding: 8,
		alignSelf: "center",
		fontSize: normalizeFontSize(20),
	},
});
