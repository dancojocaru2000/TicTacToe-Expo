import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import TopBar from './TopBar';
import { GameView } from './GameView';
import { BottomNavigation } from 'react-native-paper';
import { useState } from 'react';
import { GamesList } from './GamesList';

export default function App() {
  const [idx, setIdx] = useState(0);
  const [routes] = useState([
    { key: 'game', title: 'Game', icon: 'controller-classic' },
    { key: 'gamesList', title: 'Games List', icon: 'clipboard-list' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    game: () => <GameView style={styles.content} />,
    gamesList: () => <GamesList moveToGame={ () => setIdx(0) }/>,
  })

  return (
    <ReduxProvider store={store}>
      <View style={styles.container}>
        <TopBar style={styles.topbar} title="Tic Tac Toe"/>
        <BottomNavigation navigationState={{ index: idx, routes }} onIndexChange={setIdx} renderScene={renderScene}/>
        <StatusBar style="light" />
      </View>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topbar: {
    flex: 0,
  },
  content: {
    flex: 1,
    alignItems: "stretch",
    alignContent: "stretch",
  },
});
