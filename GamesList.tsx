import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacityBase, TouchableOpacity } from "react-native";
import { Card, Text } from 'react-native-paper';
import Board from "./Board";
import { useAppDispatch, useAppSelector } from "./hooks";
import { actions as gamesActions, gameIdSelector, gamesSelector } from "./reducers/games";
import { boardFromGame, Game } from "./types/game";
import { normalizeFontSize } from "./utils";

const GAME_INDEX_SYMBOL = Symbol("GameIndex");

export function GamesList(props: GamesListProps) {
	const { moveToGame } = props;

	const dispatch = useAppDispatch();
	const games = useAppSelector(gamesSelector);
	const currentGameId = useAppSelector(gameIdSelector);
	const sortedGames = games
		.slice()
		.sort((g1, g2) => g1.startTime.localeCompare(g2.startTime))
		.map((game, idx) => {
			return {
				[GAME_INDEX_SYMBOL]: idx,
				...game
			}
		})
		.reverse();
	
	function onGameSelected(gameId: string) {
		dispatch(gamesActions.chooseGame(gameId));
		moveToGame();
	}

	type RenderItemType = Game & { [GAME_INDEX_SYMBOL]: number };
	const renderItem = ({ item }: {item:RenderItemType}) => {
		console.log(item)
		const title = `Game ${item[GAME_INDEX_SYMBOL] + 1}`;
		const subtitle = (() => {
			switch (item.state) {
				case "movingX":
					return "X is moving";
				case "movingO":
					return "O is moving";
				case "winX":
					return "X won";
				case "winO":
					return "O won";
				case "draw":
					return "Draw";
			}
		})();
		const date = `Started at ${new Date(Date.parse(item.startTime)).toLocaleString()}`;
		const selected = item.id === currentGameId;
		const selectedStyle = (() => {
			if (!selected) return [];
			return [styles.selected];
		})();

		const content = (
			<Card style={[styles.item, ...selectedStyle]}>
				<Text style={styles.cardTitle}>{title}</Text>
				<Text style={styles.cardSubtitle}>{subtitle}</Text>
				<Text style={styles.cardDetailText}>{date}</Text>
				<Board style={{ position: "absolute", right: 0, top: 0, }} small={true} rows={3} columns={3} interactive={false} items={boardFromGame(item)} winIdx={item.winIdx}/>
			</Card>
		);

		if (selected) {
			return content;
		}
		else {
			return (
				<TouchableOpacity onPress={() => onGameSelected(item.id)}>
					{content} 
				</TouchableOpacity>
			)
		}
	};

	return (
		<View style={styles.listView}>
			<FlatList
				data={sortedGames}
				renderItem={renderItem}
				keyExtractor={item => item.id}/>
		</View>
	);
}

const styles = StyleSheet.create({
	listView: {
		flex: 1,
	},
	item: {
		padding: 8,
		margin: 16,
		minHeight: 174
	},
	cardTitle: {
		fontSize: normalizeFontSize(16),
		margin: 8,
	},
	cardSubtitle: {
		fontSize: normalizeFontSize(12),
		marginHorizontal: 8,
		marginBottom: 4,
	},
	cardDetailText: {
		fontSize: normalizeFontSize(8),
		marginHorizontal: 8,
		marginBottom: 4,
	},
	selected: {
		backgroundColor: "#B3E5FC",
	}
});

interface GamesListProps {
	moveToGame: () => void,
}
