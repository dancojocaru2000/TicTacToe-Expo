import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Appbar } from 'react-native-paper';

export default function TopBar(props: TopBarProps) {
	const { style, title } = props;

	return (
		<Appbar.Header style={style}>
			<Appbar.Content title={title}/>
		</Appbar.Header>
	);
}

type TopBarProps = {
	style: any,
	title: string,
}