import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Appbar } from 'react-native-paper';

export default function TopBar(props: TopBarProps) {
	const { style, title, showBack, onBackTap } = props;

	const backButton = !showBack ? undefined : (
		<Appbar.BackAction onPress={onBackTap} />
	);

	return (
		<Appbar.Header style={style}>
			{backButton}
			<Appbar.Content title={title}/>
		</Appbar.Header>
	);
}

type TopBarProps = {
	style: any,
	title: string,
	showBack: boolean,
	onBackTap: () => void,
}