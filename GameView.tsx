import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Board from './Board';
import { useAppDispatch, useAppSelector } from './hooks';
import { actions as gamesActions, gameIdSelector, gamesSelector } from './reducers/games';
import { boardFromGame } from './types/game';
import { assertNotNull, assertNotUndefined, normalizeFontSize } from './utils';

export function GameView(props: any) {
  const { style } = props;

  // #region Hooks

  const gameId = useAppSelector(gameIdSelector);
  const [gameStep, setGameStep] = useState("latest" as string | number);
  const dispatch = useAppDispatch();
  const games = useAppSelector(gamesSelector);
  const currentGame = useAppSelector(state => state.games.games.find(game => game.id === gameId))
  
  // #endregion

  // #region Initialization

  // If no games are started, start a new one
  if (games.length === 0) {
    dispatch(gamesActions.newGame(true));
    return (
      <View style={[style, styles.gameView]}>
        <Text>Creating new game...</Text>
        <ActivityIndicator animating={true}/>
      </View>
    );
  }
  // If no game is selected, select the latest one
  if (gameId === null) {
    const sortedGames = games.slice().sort((g1, g2) => g1.startTime.localeCompare(g2.startTime));
    dispatch(gamesActions.chooseGame(sortedGames[0].id));
    return (
      <View />
    );
  }
  assertNotNull(gameId);
  // Since a game is selected (gameId !== null), there should be a currentGame
  assertNotUndefined(currentGame);

  // #endregion

  const gameStateString = (() => {
    switch (currentGame.state) {
      case "movingX":
        return "X is moving";
      case "movingO":
        return "O is moving";
      case "winX":
        return "X wins!";
      case "winO":
        return "O wins!";
      case "draw":
        return "Draw";
    }
  })();

  function onItemPress(idx: number) {
    dispatch(gamesActions.updateGame({
      gameId: gameId!,
      position: idx,
    }))
  }

  function onNewGamePress() {
    dispatch(gamesActions.newGame(true));
  }

  const isInteractive = gameStep === "latest" && currentGame.state.startsWith("moving");

  const items = boardFromGame(currentGame, gameStep === "latest" ? undefined : gameStep as number);

  const newGameButton = (() => {
    if (currentGame.moves.length === 0) {
      return;
    }
    return (
      <Button onPress={onNewGamePress}>New Game</Button>
    );
  })();

  function onChooseGameStep(values: Array<number>) {
    setGameStep(values[0] === currentGame!.moves.length ? "latest" : values[0]);
  }

  const slider = (() => {
    if (currentGame.moves.length === 0) {
      return;
    }
    return (
      <MultiSlider
        snapped={true}
        allowOverlap={true}
        min={0}
        max={currentGame.moves.length}
        onValuesChange={onChooseGameStep}
        values={[gameStep === "latest" ? currentGame.moves.length : gameStep as number]} />
    );
  })();

  return (
    <View style={[style, styles.gameView]}>
      <View style={styles.boardView}>
        <Text style={styles.gameState}>{gameStateString}</Text>
        <Board columns={3} rows={3} items={items} onItemPress={onItemPress} interactive={isInteractive} winIdx={gameStep === "latest" ? currentGame.winIdx : null}/>
        {slider}
        {newGameButton}
        <Text>Game started on {new Date(Date.parse(currentGame.startTime)).toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameView: {

  },
  gameState: {
    fontSize: normalizeFontSize(36, {maxFontSize: 72}),
  },
  boardView: {
    // justifyContent: "center",
    alignItems: "center",
    // alignSelf: "center",
    flexGrow: 1,
    flex: 1,
  },
});