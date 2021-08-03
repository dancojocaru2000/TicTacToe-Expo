import React, { useMemo, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { BottomNavigation } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';

import { GameView } from './gameScreen/GameView';

import { GamesList } from './historyScreen/GamesList';
import { OnlineView } from './onlineScreen/OnlineView';
import { storePromise, StoreType } from './store';
import TopBar from './TopBar';
import { debounceFirst } from './utils';

export type AppEvents = 'back' | 'tabTap';

export interface AppManager {
  addEventListener: (eventType: AppEvents, handler: () => void) => void;
  removeEventListener: (eventType: AppEvents, handler: () => void) => void;
  setTitle: (newTitle?: string) => void;
  showBack: () => void;
  hideBack: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignContent: 'stretch',
    alignItems: 'stretch',
    flex: 1,
  },
  topbar: {
    flex: 0,
  },
});

export default function App(): React.ReactElement {
  const [idx, setIdx] = useState(0);
  const [store, setStore] = useState(null as null | StoreType);
  const [routes] = useState([
    { icon: 'controller-classic', key: 'game', title: 'Game' },
    { icon: 'clipboard-list', key: 'gamesList', title: 'History' },
    { icon: 'earth', key: 'online', title: 'Online' },
  ]);
  const getDefaultTitles = function (length: number) {
    return ['Tic Tac Toe', 'Tic Tac Toe', 'Tic Tac Toe Online'].concat(
      Array(length - 3).fill('Tic Tac Toe'),
    );
  };
  const [titles, setTitles] = useState(getDefaultTitles(routes.length));
  const [showBack, setShowBack] = useState(Array(routes.length).fill(false));
  const eventHandlersRef = useRef(
    [] as Array<{ idx: number; eventType: AppEvents; handler: () => void }>,
  );

  const appManagerCreator = (index: number) => {
    return {
      addEventListener: (eventType, handler) => {
        const eventHandlers = eventHandlersRef.current;
        if (
          eventHandlers.some(
            (e) =>
              e.eventType === eventType &&
              e.handler === handler &&
              e.idx === index,
          )
        ) {
          return;
        }
        eventHandlers.push({
          eventType,
          handler,
          idx: index,
        });
      },
      hideBack: debounceFirst(() => {
        if (showBack[index] === false) {
          return;
        }
        const newShowBack = showBack.slice();
        newShowBack.splice(index, 1, false);
        setShowBack(newShowBack);
      }, 200),
      removeEventListener: (eventType, handler) => {
        const eventHandlers = eventHandlersRef.current;
        const arrIdx = eventHandlers.findIndex(
          (e) =>
            e.eventType === eventType &&
            e.handler === handler &&
            e.idx === index,
        );
        if (arrIdx !== -1) {
          eventHandlers.splice(arrIdx, 1);
        }
      },
      setTitle: debounceFirst((newTitle) => {
        if (
          titles[index] === newTitle ||
          (!newTitle &&
            titles[index] === getDefaultTitles(routes.length)[index])
        ) {
          return;
        }
        const newTitles = titles.slice();
        newTitles.splice(
          index,
          1,
          newTitle ?? getDefaultTitles(routes.length)[index],
        );
        setTitles(newTitles);
      }, 200),
      showBack: debounceFirst(() => {
        if (showBack[index] === true) {
          return;
        }
        const newShowBack = showBack.slice();
        newShowBack.splice(index, 1, true);
        setShowBack(newShowBack);
      }, 200),
    } as AppManager;
  };
  const appManagers = useMemo(
    () =>
      Array(routes.length)
        .fill(null)
        .map((_, index) => appManagerCreator(index)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titles, showBack],
  );

  storePromise.then((pstore) => setStore(pstore));

  const renderScene = BottomNavigation.SceneMap({
    game: () => <GameView style={styles.content} />,
    gamesList: () => <GamesList moveToGame={() => setIdx(0)} />,
    online: () => <OnlineView appManager={appManagers[2]} />,
  });

  if (!store) {
    return <View />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTabPress = function (e: any) {
    const tabPressIdx = routes.findIndex((r) => r.key === e.route.key);
    if (idx === tabPressIdx) {
      eventHandlersRef.current
        .filter((h) => h.eventType === 'tabTap' && h.idx === idx)
        .forEach((h) => h.handler());
    }
  };

  const onBackTap = function () {
    eventHandlersRef.current
      .filter((h) => h.eventType === 'back' && h.idx === idx)
      .forEach((h) => h.handler());
  };

  return (
    <ReduxProvider store={store}>
      <View style={styles.container}>
        <TopBar
          style={styles.topbar}
          showBack={showBack[idx]}
          // eslint-disable-next-line react/jsx-no-bind
          onBackTap={onBackTap}
          title={titles[idx]}
        />
        <BottomNavigation
          navigationState={{ index: idx, routes }}
          onIndexChange={setIdx}
          // eslint-disable-next-line react/jsx-no-bind
          onTabPress={onTabPress}
          renderScene={renderScene}
        />
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />
      </View>
    </ReduxProvider>
  );
}
