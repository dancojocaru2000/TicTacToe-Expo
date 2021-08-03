import { Action } from 'redux';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';

import api from './api';
import { slowModeSelector } from './reducers/debug';
import { actions as meActions, userDetailsSelector } from './reducers/me';
import { actions as metaActions } from './reducers/meta';
import { actions as usersActions } from './reducers/users';
import { promiseTimeout, Unpromisify } from './utils';

type SignUpAction = Action<'SIGN_UP'> & { nickname: string };
type CodeLogInAction = Action<'CODE_LOG_IN'> & { code: string };

const fetchNickRegex = function* () {
  try {
    const result = (yield call(api.meta.getNickRegex)) as Unpromisify<
      ReturnType<typeof api.meta.getNickRegex>
    >;
    yield put(metaActions.setNickRegex(new RegExp(result.regex)));
  } catch (e) {
    console.error(e);
  }
};

const signUp = function* (action: SignUpAction) {
  const headers = {} as { [s: string]: string };
  const slowMode = (yield select(slowModeSelector)) as boolean;
  if (slowMode) {
    headers['X-Slow-Mode'] = 'yes';
  }

  yield put(meActions.loadingLogIn());
  try {
    const result = (yield call(api.newUser, action.nickname, {
      headers,
    })) as Unpromisify<ReturnType<typeof api.newUser>>;
    if (result.status === 'ok') {
      yield put(
        meActions.logIn({ secret: result.user.secret, userId: result.user.id }),
      );
    } else {
      yield put(meActions.logOut());
      throw new Error(result.message);
    }
  } catch (e) {
    console.error(e);
  }
};

const codeLogIn = function* (action: CodeLogInAction) {
  const headers = {} as { [s: string]: string };
  const slowMode = (yield select(slowModeSelector)) as boolean;
  if (slowMode) {
    headers['X-Slow-Mode'] = 'yes';
  }

  yield put(meActions.loadingLogIn());
  try {
    const result = (yield call(api.postUserLoginCode, action.code, {
      headers,
    })) as Unpromisify<ReturnType<typeof api.postUserLoginCode>>;
    if (result.status === 'ok') {
      yield put(
        meActions.logIn({ secret: result.user.secret, userId: result.user.id }),
      );
    } else {
      yield put(meActions.logOut());
      throw new Error(result.message);
    }
  } catch (e) {
    console.error(e);
  }
};

const fetchUsers = function* () {
  yield put(usersActions.setUsersState('fetching'));

  const headers = {} as { [s: string]: string };
  const slowMode = (yield select(slowModeSelector)) as boolean;
  if (slowMode) {
    headers['X-Slow-Mode'] = 'yes';
  }

  try {
    const result = (yield call(api.getUsers, { headers })) as Unpromisify<
      ReturnType<typeof api.getUsers>
    >;
    if (result.status === 'ok') {
      yield put(usersActions.replaceUsers(result.users));
    }
    // else {
    // 	throw new Error(result.message);
    // }
  } catch (e) {
    console.error(e);
  }
};

const getLoginCode = function* () {
  yield put(meActions.loadingLogInCode());

  const headers = {} as { [s: string]: string };
  const slowMode = (yield select(slowModeSelector)) as boolean;
  if (slowMode) {
    headers['X-Slow-Mode'] = 'yes';
  }

  const { userId, secret } = (yield select(userDetailsSelector)) as {
    userId: string;
    secret: string;
  };
  try {
    const result = (yield call(api.getUserCode, userId, secret, {
      headers,
    })) as Unpromisify<ReturnType<typeof api.getUserCode>>;
    if (result.status === 'ok') {
      const payload = {
        code: result.code,
        expiryDate: new Date(result.expirationDate),
        issueDate: new Date(result.issueDate),
      };
      yield put(meActions.setLoginCode(payload));
      yield call(
        promiseTimeout,
        payload.expiryDate.getTime() - Date.now() + 500,
      );
      yield put(meActions.resetLoginCode(payload));
    } else {
      throw new Error(result.message);
    }
  } catch (e) {
    console.error(e);
  }
};

const watchFetchNickRegex = function* () {
  yield takeLeading('FETCH_NICK_REGEX', fetchNickRegex);
};

const watchSignUp = function* () {
  yield takeEvery('SIGN_UP', signUp);
};

const watchCodeLogIn = function* () {
  yield takeEvery('CODE_LOG_IN', codeLogIn);
};

const watchFetchUsers = function* () {
  yield takeLeading('FETCH_USERS', fetchUsers);
};

const watchGetLoginCode = function* () {
  yield takeLeading('GET_LOGIN_CODE', getLoginCode);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const rootSaga = function* () {
  yield all([
    watchFetchNickRegex(),
    watchSignUp(),
    watchCodeLogIn(),
    watchFetchUsers(),
    watchGetLoginCode(),
  ]);
};
export default rootSaga;

export const sagaActions = {
  codeLogIn: (code: string): CodeLogInAction => ({ code, type: 'CODE_LOG_IN' }),
  fetchNickRegex: (): Action<'FETCH_NICK_REGEX'> => ({
    type: 'FETCH_NICK_REGEX',
  }),
  fetchUsers: (): Action<'FETCH_USERS'> => ({
    type: 'FETCH_USERS',
  }),
  getLoginCode: (): Action<'GET_LOGIN_CODE'> => ({
    type: 'GET_LOGIN_CODE',
  }),
  signUp: (nickname: string): SignUpAction => ({ nickname, type: 'SIGN_UP' }),
};
