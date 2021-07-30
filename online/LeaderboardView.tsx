import React, { useEffect } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { LoadingView } from "../LoadingView";
import { userIdSelector } from "../reducers/me";
import { usersSelector, usersStateSelector } from "../reducers/users";
import { sagaActions } from "../sagas";
import { User } from "../types/user";
import { normalizeFontSize } from "../utils";

export function LeaderboardView(props: LeaderboardViewProps) {
	const dispatch = useAppDispatch();
	const myId = useAppSelector(userIdSelector)!;
	const usersState = useAppSelector(usersStateSelector);
	const users = useAppSelector(usersSelector);
	const sortedUsers = users.slice().sort((u1, u2) => u2.stats.online.total - u1.stats.online.total).map((u, idx) => [u, idx] as [User, number]);
	
	useEffect(() => {
		if (usersState === "idle") {
			dispatch(sagaActions.fetchUsers());
		}
	}, []);

	function renderSortedUser({ item: [user, idx] }: ListRenderItemInfo<[User, number]>) {
		const currentUserStyle = user.id === myId ? [styles.currentUserView] : [];
		const winRatio = user.stats.online.total === 0 ? 0 : (user.stats.online.total / user.stats.online.won);

		return (
			<Card style={[styles.userView, ...currentUserStyle]}>
				<Text style={styles.indexText}>{idx + 1}</Text>
				<Text style={styles.nicknameText}>{user.nickname}</Text>
				<Text style={styles.statsText}>Online games played: {user.stats.online.total}</Text>
				<Text style={styles.statsText}>Online games won: {user.stats.online.won}</Text>
				<Text style={styles.statsText}>Online win ratio: 1:{winRatio}</Text>
			</Card>
		)
	}

	if (usersState === "fetching" && users.length === 0) {
		return (
			<LoadingView loadingText="Loading users..." />
		);
	}
	else {
		return (
			<View style={styles.mainView}>
				<FlatList data={sortedUsers} renderItem={renderSortedUser} keyExtractor={([user, _]) => user.id} />
			</View>
		);
	}
}

interface LeaderboardViewProps {

}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
	},
	userView: {
		marginHorizontal: 8,
		marginVertical: 2,
		minHeight: 80,
	},
	currentUserView: {
		backgroundColor: "#B3E5FC",
	},
	indexText: {
		opacity: 0.3,
		fontSize: (42),
		position: "absolute",
		right: 8,
		top: 8,
	},
	nicknameText: {
		fontSize: (20),
		fontWeight: "bold",
		padding: 8,
	},
	statsText: {
		fontSize: (14),
		paddingVertical: 1,
		paddingHorizontal: 8,
	}
});
