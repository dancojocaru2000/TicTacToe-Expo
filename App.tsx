import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Board from './Board';
import TopBar from './TopBar';
import { arrayReplace, normalizeFontSize } from './utils';

export default function App() {
  return (
    <View style={styles.container}>
      <TopBar style={styles.topbar} title="Tic Tac Toe"/>
      <Content style={styles.content}/>
      <StatusBar style="light" />
    </View>
  );
}

function Content(props: any) {
  function getDefaultItems() {
    // return ["1", "2", null, null, "3", null, "4", Dimensions.get('window').width.toString(), "5"];
    return Array(9).fill(null);
  }

  const { style } = props;
  const [items, setItems] = useState(getDefaultItems() as Array<string | null>);
  const [moving, setMoving] = useState("movingX" as GameState);
  const [winIdx, setWinIdx] = useState(undefined as number | undefined);
  const getGameStateString = (state: GameState) => {
    switch (moving) {
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
  };

  function checkWin(): boolean | "draw" {
    const possibleWinPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [idx, possibleWinPos] of possibleWinPositions.entries()) {
      const itemsInWin = possibleWinPos.map(i => items[i]);
      const win = itemsInWin.every(item => item && item === itemsInWin[0]);
      if (win) {
        console.log(`Win: ${possibleWinPos} - ${items}`);
        setWinIdx(idx);
        return true;
      }
    }

    if (items.some(item => item === null)) {
      return false;
    }
    else {
      console.log(`Draw: ${items}`);
      return "draw";
    }
  }

  function updateGameState() {
    const win = checkWin();
    if (win == true) {
      switch (moving) {
        case "movingX":
          setMoving("winX");
          break;
        case "movingO":
          setMoving("winO");
          break;
        default:
          throw Error(`Invalid state: cannot win from ${moving} state`);
      }
    }
    else if (win == "draw") {
      setMoving("draw");
    }
    else {
      switch (moving) {
        case "movingX":
          setMoving("movingO");
          break;
        case "movingO":
          setMoving("movingX");
          break;
        default:
          throw Error(`Invalid state: cannot continue game from ${moving} state`);
      }
    }
  }

  function onItemPress(idx: number) {
    switch (moving) {
      case "movingX":
        setItems(arrayReplace(items, [idx, 'X']));
        updateGameState();
        break;
      case "movingO":
        setItems(arrayReplace(items, [idx, 'O']));
        updateGameState();
        break;
      default:
        break;
    }
  }

  function onResetPress() {
    setItems(getDefaultItems());
    setMoving("movingX");
    setWinIdx(undefined);
  }

  return (
    <View style={[style, ]}>
      <View style={styles.boardView}>
        <Text style={styles.gameState}>{getGameStateString(moving)}</Text>
        <Board columns={3} rows={3} items={items} onItemPress={onItemPress} winIdx={winIdx}/>
        <Button onPress={onResetPress}>Reset</Button>
      </View>
    </View>
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
