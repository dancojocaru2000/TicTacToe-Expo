import { Action } from "redux";
import { all, call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import api, { ApiResult, GetNickRegexApiSuccess, GetUserCodeApiSuccess, GetUsersApiSuccess, GetUserSecretApiSuccess } from "./api";
import { actions as metaActions } from './reducers/meta';
import { actions as meActions, userDetailsSelector, userIdSelector } from './reducers/me';
import { actions as usersActions } from './reducers/users';
import { slowModeSelector } from "./reducers/debug";
import { promiseTimeout, Unpromisify } from "./utils";

function* fetchNickRegex(action: Action<"FETCH_NICK_REGEX">) {
	try {
		const result = (yield call(api.meta.getNickRegex)) as Unpromisify<ReturnType<typeof api.meta.getNickRegex>>;
		yield put(metaActions.setNickRegex(new RegExp(result.regex)));
	}
	catch (e) { console.error(e) }
}

function* signUp(action: Action<"SIGN_UP"> & { nickname: string }) {
	const headers = {} as { [s: string]: string };
	const slowMode = (yield select(slowModeSelector)) as boolean;
	if (slowMode) {
		headers['X-Slow-Mode'] = 'yes';
	}

	yield put(meActions.loadingLogIn());
	try {
		const result = (yield call(api.newUser, action.nickname, { headers })) as Unpromisify<ReturnType<typeof api.newUser>>;
		if (result.status === "ok") {
			yield put(meActions.logIn({ userId: result.user.id, secret: result.user.secret }));
		}
		else {
			yield put(meActions.logOut());
			throw new Error(result.message);
		}
	}
	catch (e) { console.error(e) }
}

function* codeLogIn(action: Action<"CODE_LOG_IN"> & { code: string }) {
	const headers = {} as { [s: string]: string };
	const slowMode = (yield select(slowModeSelector)) as boolean;
	if (slowMode) {
		headers['X-Slow-Mode'] = 'yes';
	}

	yield put(meActions.loadingLogIn());
	try {
		const result = (yield call(api.postUserLoginCode, action.code, { headers })) as Unpromisify<ReturnType<typeof api.postUserLoginCode>>;
		if (result.status === "ok") {
			yield put(meActions.logIn({ userId: result.user.id, secret: result.user.secret }));
		}
		else {
			yield put(meActions.logOut());
			throw new Error(result.message);
		}
	}
	catch (e) { console.error(e) }
}

function* fetchUsers(action: Action<"FETCH_USERS">) {
	yield put(usersActions.setUsersState("fetching"));

	const headers = {} as { [s: string]: string };
	const slowMode = (yield select(slowModeSelector)) as boolean;
	if (slowMode) {
		headers['X-Slow-Mode'] = 'yes';
	}

	try {
		const result = (yield call(api.getUsers, { headers })) as Unpromisify<ReturnType<typeof api.getUsers>>;
		if (result.status === "ok") {
			yield put(usersActions.replaceUsers(result.users));
		}
		// else {
		// 	throw new Error(result.message);
		// }
	}
	catch (e) { console.error(e) }
}

function* getLoginCode() {
	yield put(meActions.loadingLogInCode());

	const headers = {} as { [s: string]: string };
	const slowMode = (yield select(slowModeSelector)) as boolean;
	if (slowMode) {
		headers['X-Slow-Mode'] = 'yes';
	}

	const { userId, secret } = (yield select(userDetailsSelector)) as {userId: string, secret: string};
	try {
		const result = (yield call(api.getUserCode, userId, secret, { headers })) as Unpromisify<ReturnType<typeof api.getUserCode>>;
		if (result.status === "ok") {
			const payload = {
				code: result.code,
				expiryDate: new Date(result.expirationDate),
				issueDate: new Date(result.issueDate),
			};
			yield put(meActions.setLoginCode(payload));
			yield call(promiseTimeout, payload.expiryDate.getTime() - Date.now() + 500);
			yield put(meActions.resetLoginCode(payload));
		}
		else {
			throw new Error(result.message);
		}
	}
	catch (e) { console.error(e) }
}

function* watchFetchNickRegex() {
	yield takeLeading('FETCH_NICK_REGEX', fetchNickRegex);
}

function* watchSignUp() {
	yield takeEvery('SIGN_UP', signUp);
}

function* watchCodeLogIn() {
	yield takeEvery('CODE_LOG_IN', codeLogIn);
}

function* watchFetchUsers() {
	yield takeLeading('FETCH_USERS', fetchUsers);
}

function* watchGetLoginCode() {
	yield takeLeading('GET_LOGIN_CODE', getLoginCode);
}

export default function* rootSaga() {
	yield all([
		watchFetchNickRegex(),
		watchSignUp(),
		watchCodeLogIn(),
		watchFetchUsers(),
		watchGetLoginCode(),
	]);
}

export const sagaActions = {
	fetchNickRegex: () => ({ type: "FETCH_NICK_REGEX" }),
	signUp: (nickname: string) => ({ type: "SIGN_UP", nickname }),
	codeLogIn: (code: string) => ({ type: "CODE_LOG_IN", code }),
	fetchUsers: () => ({ type: "FETCH_USERS" }),
	getLoginCode: () => ({ type: "GET_LOGIN_CODE" }),
};
