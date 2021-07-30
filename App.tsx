import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { storePromise } from './store';
import TopBar from './TopBar';
import { GameView } from './GameView';
import { BottomNavigation } from 'react-native-paper';
import { useState } from 'react';
import { GamesList } from './GamesList';
import { OnlineView } from './OnlineView';
import { debounceFirst } from './utils';
import { useEffect } from 'react';

export default function App() {
  const [idx, setIdx] = useState(0);
  const [store, setStore] = useState(null as any);
  const [routes] = useState([
    { key: 'game', title: 'Game', icon: 'controller-classic' },
    { key: 'gamesList', title: 'History', icon: 'clipboard-list' },
    { key: 'online', title: 'Online', icon: 'earth' },
  ]);
  function getDefaultTitles(length: number) {
    return ['Tic Tac Toe', 'Tic Tac Toe', 'Tic Tac Toe Online'].concat(Array(length - 3).fill('Tic Tac Toe'));
  }
  const [titles, setTitles] = useState(getDefaultTitles(routes.length));
  const [showBack, setShowBack] = useState(Array(routes.length).fill(false));
  const eventHandlersRef = useRef([] as Array<{ idx: number, eventType: AppEvents, handler: () => void }>);

  const appManagerCreator = (idx: number) => {
    return {
      addEventListener: (eventType, handler) => {
        const eventHandlers = eventHandlersRef.current;
        if (eventHandlers.some(e => e.eventType === eventType && e.handler === handler && e.idx === idx)) {
          return;
        }
        eventHandlers.push({
          eventType,
          handler,
          idx,
        });
      },
      removeEventListener: (eventType, handler) => {
        const eventHandlers = eventHandlersRef.current;
        const arrIdx = eventHandlers.findIndex(e => e.eventType === eventType && e.handler === handler && e.idx === idx);
        if (arrIdx !== -1) {
          eventHandlers.splice(arrIdx, 1);
        }
      },
      hideBack: debounceFirst(() => {
        if (showBack[idx] === false) {
          return;
        }
        const newShowBack = showBack.slice();
        newShowBack.splice(idx, 1, false);
        setShowBack(newShowBack);
      }, 200),
      showBack: debounceFirst(() => {
        if (showBack[idx] === true) {
          return;
        }
        const newShowBack = showBack.slice();
        newShowBack.splice(idx, 1, true);
        setShowBack(newShowBack);
      }, 200),
      setTitle: debounceFirst((newTitle) => {
        if (titles[idx] === newTitle || !newTitle && titles[idx] === getDefaultTitles(routes.length)[idx]) {
          return;
        }
        const newTitles = titles.slice();
        newTitles.splice(idx, 1, newTitle ?? getDefaultTitles(routes.length)[idx]);
        setTitles(newTitles);
      }, 200),
    } as AppManager;
  };
  const appManagers = useMemo(() => Array(routes.length).fill(null).map((_, idx) => appManagerCreator(idx)), [titles, showBack]);

  storePromise.then(store => setStore(store));

  const renderScene = BottomNavigation.SceneMap({
    game: () => <GameView style={styles.content} />,
    gamesList: () => <GamesList moveToGame={() => setIdx(0)} />,
    online: () => <OnlineView appManager={appManagers[2]} />,
  });

  if (!store) {
    return <View />;
  }

  function onTabPress(e: any) {
    const tabPressIdx = routes.findIndex(r => r.key === e.route.key);
    if (idx === tabPressIdx) {
      for (const h of eventHandlersRef.current) {
        if (h.eventType === "tabTap" && h.idx === idx) {
          h.handler();
        } 
      }
    }
  }

  function onBackTap() {
    for (const h of eventHandlersRef.current) {
      if (h.eventType === "back" && h.idx === idx) {
        h.handler();
      }
    }
  }

  return (
    <ReduxProvider store={store}>
      <View style={styles.container}>
        <TopBar style={styles.topbar} showBack={showBack[idx]} onBackTap={onBackTap} title={titles[idx]}/>
        <BottomNavigation navigationState={{ index: idx, routes }} onIndexChange={setIdx} onTabPress={onTabPress} renderScene={renderScene}/>
        <StatusBar style="light" />
      </View>
    </ReduxProvider>
  );
}

export interface AppManager {
  addEventListener: (eventType: AppEvents, handler: () => void) => void,
  removeEventListener: (eventType: AppEvents, handler: () => void) => void,
  setTitle: (newTitle?: string) => void,
  showBack: () => void,
  hideBack: () => void,
}

export type AppEvents = "back" | "tabTap";

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
