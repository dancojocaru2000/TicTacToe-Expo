import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./reducers/games";
import meReducer from "./reducers/me";
import debugReducer from "./reducers/debug";
import metaReducer from './reducers/meta';
import usersReducer from './reducers/users';
import appReducer from './reducers/app';
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "./sagas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Unpromisify } from "./utils";

const storeMe = AsyncStorage.getItem('/me');
const storeDebug = AsyncStorage.getItem('/debug');

const preloadedState = (async () => {
	const preloaded = {} as {[s:string]:any};
	if (await storeMe !== null) {
		preloaded.me = JSON.parse(await storeMe as string, (k, v) => {
			if (k === "expiryDate") {
				return new Date(v);
			}
			else {
				return v;
			}
		});
	}
	// if (await storeDebug !== null) {
	// 	preloaded.debug = JSON.parse(await storeDebug as string);
	// }

	return preloaded;
})();

const sagaMiddleware = createSagaMiddleware();
export const storePromise = (async () => configureStore({
	reducer: {
		games: gamesReducer,
		me: meReducer,
		debug: debugReducer,
		meta: metaReducer,
		users: usersReducer,
		app: appReducer,
	},
	middleware: [
		sagaMiddleware,
	],
	preloadedState: await preloadedState,
}))();

// Run saga
storePromise.then(_ => {
	sagaMiddleware.run(rootSaga);
});

// AsyncStorage
storePromise.then(store => store.subscribe(() => {
	const state = store.getState();
	AsyncStorage.multiSet([
		['/me', JSON.stringify(state.me)],
		['/debug', JSON.stringify(state.debug)]
	]);
}));

// type StoreType = Parameters<Exclude<Parameters<typeof storePromise.then>[0], null | undefined>>[0];
type StoreType = Unpromisify<typeof storePromise>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];
