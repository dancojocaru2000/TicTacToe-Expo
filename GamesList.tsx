import React from "react";
import { View } from "react-native";

export function GamesList(props: GamesListProps) {
	const { moveToGame } = props;

	return <View/>
}

interface GamesListProps {
	moveToGame: () => void,
}
