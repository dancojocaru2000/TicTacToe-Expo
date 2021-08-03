/* global fetch, RequestInit */
import { Game } from './types/game';
import { User } from './types/user';

const API_ROOT = 'https://ttt.extras.dcdevelop.xyz/api';

export interface ApiFailure {
  status: 'error';
  message: string;
}

export interface ApiSuccess {
  status: 'ok';
}

export interface GetNickRegexApiSuccess extends ApiSuccess {
  regex: string;
}

export interface GetGamesApiSuccess extends ApiSuccess {
  games: Array<Game>;
}

export interface GetGameApiSuccess extends ApiSuccess {
  game: Game;
}

export interface GetUsersApiSuccess extends ApiSuccess {
  users: Array<User>;
}

export interface GetUserSecretApiSuccess extends ApiSuccess {
  user: User & { secret: string };
}

export interface GetUserApiSuccess extends ApiSuccess {
  user: User;
}

export interface GetUserCodeApiSuccess extends ApiSuccess {
  code: string;
  expirationDate: string;
  issueDate: string;
  expiresInSeconds: number;
}

export type ApiResult<T extends ApiSuccess = ApiSuccess> = T | ApiFailure;

const api = {
  getGame: (
    gameId: string,
    init?: RequestInit,
  ): Promise<ApiResult<GetGameApiSuccess>> =>
    fetch(`${API_ROOT}/game/${gameId}`, init).then(
      (r) => r.json() as Promise<ApiResult<GetGameApiSuccess>>,
    ),
  getGames: (init?: RequestInit): Promise<GetGamesApiSuccess> =>
    fetch(`${API_ROOT}/games`, init).then(
      (r) => r.json() as Promise<GetGamesApiSuccess>,
    ),
  getGamesWithUser: (
    userId: string,
    init?: RequestInit,
  ): Promise<GetGameApiSuccess> =>
    fetch(`${API_ROOT}/games/with/${userId}`, init).then(
      (r) => r.json() as Promise<GetGameApiSuccess>,
    ),
  getUser: (
    userId: string,
    init?: RequestInit,
  ): Promise<ApiResult<GetUserApiSuccess>> =>
    fetch(`${API_ROOT}/user/${userId}`, init).then(
      (r) => r.json() as Promise<ApiResult<GetUserApiSuccess>>,
    ),
  getUserCode: (
    userId: string,
    secret: string,
    init?: RequestInit,
  ): Promise<ApiResult<GetUserCodeApiSuccess>> =>
    fetch(`${API_ROOT}/user/${userId}/code`, {
      ...init,
      headers: { ...init?.headers, 'X-Secret-String': secret },
    }).then((r) => r.json() as Promise<ApiResult<GetUserCodeApiSuccess>>),
  getUsers: (init?: RequestInit): Promise<GetUsersApiSuccess> =>
    fetch(`${API_ROOT}/users`, init).then(
      (r) => r.json() as Promise<GetUsersApiSuccess>,
    ),
  meta: {
    getNickRegex: (init?: RequestInit): Promise<GetNickRegexApiSuccess> =>
      fetch(`${API_ROOT}/meta/nickRegex`, init).then(
        (r) => r.json() as Promise<GetNickRegexApiSuccess>,
      ),
  },
  newUser: (
    nickname: string,
    init?: RequestInit,
  ): Promise<ApiResult<GetUserSecretApiSuccess>> =>
    fetch(`${API_ROOT}/user/new`, {
      ...init,
      body: JSON.stringify({ nickname }),
      headers: { ...init?.headers, 'Content-Type': 'application/json' },
      method: 'POST',
    }).then((r) => r.json() as Promise<ApiResult<GetUserSecretApiSuccess>>),
  patchGame: (
    gameId: string,
    game: Game,
    init?: RequestInit,
  ): Promise<ApiResult> =>
    fetch(`${API_ROOT}/game/${gameId}`, {
      ...init,
      body: JSON.stringify(game),
      method: 'PATCH',
    }).then((r) => r.json() as Promise<ApiResult>),
  postGame: (game: Game, init?: RequestInit): Promise<ApiResult> =>
    fetch(`${API_ROOT}/game`, {
      ...init,
      body: JSON.stringify(game),
      headers: { ...init?.headers, 'Content-Type': 'application/json' },
      method: 'POST',
    }).then((r) => r.json() as Promise<ApiResult>),
  postUserLoginCode: (
    code: string,
    init?: RequestInit,
  ): Promise<ApiResult<GetUserSecretApiSuccess>> =>
    fetch(`${API_ROOT}/user/login/code`, {
      ...init,
      body: JSON.stringify({ code }),
      headers: { ...init?.headers, 'Content-Type': 'application/json' },
      method: 'POST',
    }).then((r) => r.json() as Promise<ApiResult<GetUserSecretApiSuccess>>),
};
export default api;
