import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import appReducer from './reducers/app';
import debugReducer from './reducers/debug';
import gamesReducer from './reducers/games';
import meReducer from './reducers/me';
import metaReducer from './reducers/meta';
import usersReducer from './reducers/users';
import rootSaga from './sagas';

import { Unpromisify } from './utils';

const storeMe = AsyncStorage.getItem('/me');
// const storeDebug = AsyncStorage.getItem('/debug');

const preloadedState = (async () => {
  const preloaded = {} as { [s: string]: unknown };
  if ((await storeMe) !== null) {
    preloaded.me = JSON.parse((await storeMe) as string, (k, v) => {
      if (k === 'expiryDate') {
        return new Date(v);
      }
      return v;
    });
  }
  // if (await storeDebug !== null) {
  // 	preloaded.debug = JSON.parse(await storeDebug as string);
  // }

  return preloaded;
})();

const sagaMiddleware = createSagaMiddleware();
export const storePromise = (async () =>
  configureStore({
    middleware: [sagaMiddleware],
    preloadedState: await preloadedState,
    reducer: {
      app: appReducer,
      debug: debugReducer,
      games: gamesReducer,
      me: meReducer,
      meta: metaReducer,
      users: usersReducer,
    },
  }))();

// Run saga
storePromise.then(() => {
  sagaMiddleware.run(rootSaga);
});

// AsyncStorage
storePromise.then((store) =>
  store.subscribe(() => {
    const state = store.getState();
    AsyncStorage.multiSet([
      ['/me', JSON.stringify(state.me)],
      ['/debug', JSON.stringify(state.debug)],
    ]);
  }),
);

// type StoreType = Parameters<Exclude<Parameters<typeof storePromise.then>[0], null | undefined>>[0];
export type StoreType = Unpromisify<typeof storePromise>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];
