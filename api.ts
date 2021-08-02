import { Game } from "./types/game";
import { User } from "./types/user";

const API_ROOT = 'https://ttt.extras.dcdevelop.xyz/api';

export type ApiResult<T extends ApiSuccess = ApiSuccess> = T | ApiFailure

export interface ApiFailure {
	status: "error",
	message: string,
}

export interface ApiSuccess {
	status: "ok",
}

export interface GetNickRegexApiSuccess extends ApiSuccess {
	regex: string,
}

export interface GetGamesApiSuccess extends ApiSuccess {
	games: Array<Game>,
}

export interface GetGameApiSuccess extends ApiSuccess {
	game: Game,
}

export interface GetUsersApiSuccess extends ApiSuccess {
	users: Array<User>,
}

export interface GetUserSecretApiSuccess extends ApiSuccess {
	user: User & {secret: string},
}

export interface GetUserApiSuccess extends ApiSuccess {
	user: User,
}

export interface GetUserCodeApiSuccess extends ApiSuccess {
	code: string,
	expirationDate: string,
	issueDate: string,
	expiresInSeconds: number,
}

const api = {
	meta: {
		getNickRegex: (init?: RequestInit) => fetch(`${API_ROOT}/meta/nickRegex`, init)
			.then(r => r.json() as Promise<GetNickRegexApiSuccess>),
	},
	getGames: (init?: RequestInit) => fetch(`${API_ROOT}/games`, init)
		.then(r => r.json() as Promise<GetGamesApiSuccess>),
	getGamesWithUser: (userId: string, init?: RequestInit) => fetch(`${API_ROOT}/games/with/${userId}`, init)
		.then(r => r.json() as Promise<GetGameApiSuccess>),
	postGame: (game: Game, init?: RequestInit) => fetch(`${API_ROOT}/game`, { ...init, method: "POST", body: JSON.stringify(game), headers: {...init?.headers, 'Content-Type': 'application/json'} })
		.then(r => r.json() as Promise<ApiResult>),
	getGame: (gameId: string, init?: RequestInit) => fetch(`${API_ROOT}/game/${gameId}`, init)
		.then(r => r.json() as Promise<ApiResult<GetGameApiSuccess>>),
	patchGame: (gameId: string, game: Game, init?: RequestInit) => fetch(`${API_ROOT}/game/${gameId}`, { ...init, method: "PATCH", body: JSON.stringify(game) })
		.then(r => r.json() as Promise<ApiResult>),
	getUsers: (init?: RequestInit) => fetch(`${API_ROOT}/users`, init)
		.then(r => r.json() as Promise<GetUsersApiSuccess>),
	newUser: (nickname: string, init?: RequestInit) => fetch(`${API_ROOT}/user/new`, { ...init, method: "POST", body: JSON.stringify({ nickname }), headers: { ...init?.headers, 'Content-Type': 'application/json' } })
		.then(r => r.json() as Promise<ApiResult<GetUserSecretApiSuccess>>),
	getUser: (userId: string, init?: RequestInit) => fetch(`${API_ROOT}/user/${userId}`, init)
		.then(r => r.json() as Promise<ApiResult<GetUserApiSuccess>>),
	postUserLoginCode: (code: string, init?: RequestInit) => fetch(`${API_ROOT}/user/login/code`, { ...init, method: "POST", body: JSON.stringify({ code }), headers: { ...init?.headers, 'Content-Type': 'application/json' } })
		.then(r => r.json() as Promise<ApiResult<GetUserSecretApiSuccess>>),
	getUserCode: (userId: string, secret: string, init?: RequestInit) => fetch(`${API_ROOT}/user/${userId}/code`, {...init, headers: {...init?.headers, 'X-Secret-String': secret,}})
		.then(r => r.json() as Promise<ApiResult<GetUserCodeApiSuccess>>),
	
};
export default api;
