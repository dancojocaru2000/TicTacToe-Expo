import { Game } from "./types/game";
import { User } from "./types/user";

const API_ROOT = 'https://ttt.extras.dcdevelop.xyz/api';

export interface ApiResult {
	status: "ok" | "error",
	message?: string,
	[key: string]: any,
}

export interface GetNickRegexApiResult extends ApiResult {
	regex: string,
}

export interface GetGamesApiResult extends ApiResult {
	games?: Array<Game>,
}

export interface GetGameApiResult extends ApiResult {
	game?: Game,
}

export interface GetUsersApiResult extends ApiResult {
	users: Array<User>,
}

export interface GetUserSecretApiResult extends ApiResult {
	user?: User & {secret: string},
}

export interface GetUserApiResult extends ApiResult {
	user?: User,
}

export interface GetUserCodeResult extends ApiResult {
	code?: string,
	expirationDate?: string,
}

const api = {
	meta: {
		getNickRegex: (init?: RequestInit) => fetch(`${API_ROOT}/meta/nickRegex`, init)
			.then(r => r.json() as Promise<GetNickRegexApiResult>),
	},
	getGames: (init?: RequestInit) => fetch(`${API_ROOT}/games`, init)
		.then(r => r.json() as Promise<GetGamesApiResult>),
	postGame: (game: Game, init?: RequestInit) => fetch(`${API_ROOT}/game`, { ...init, method: "POST", body: JSON.stringify(game), headers: {...init?.headers, 'Content-Type': 'application/json'} })
		.then(r => r.json() as Promise<ApiResult>),
	getGame: (gameId: string, init?: RequestInit) => fetch(`${API_ROOT}/game/${gameId}`, init)
		.then(r => r.json() as Promise<GetGameApiResult>),
	patchGame: (gameId: string, game: Game, init?: RequestInit) => fetch(`${API_ROOT}/game/${gameId}`, { ...init, method: "PATCH", body: JSON.stringify(game) })
		.then(r => r.json() as Promise<ApiResult>),
	getUsers: (init?: RequestInit) => fetch(`${API_ROOT}/users`, init)
		.then(r => r.json() as Promise<GetUsersApiResult>),
	newUser: (nickname: string, init?: RequestInit) => fetch(`${API_ROOT}/user/new`, { ...init, method: "POST", body: JSON.stringify({ nickname }), headers: { ...init?.headers, 'Content-Type': 'application/json' } })
		.then(r => r.json() as Promise<GetUserSecretApiResult>),
	getUser: (userId: string, init?: RequestInit) => fetch(`${API_ROOT}/user/${userId}`, init)
		.then(r => r.json() as Promise<GetUserApiResult>),
	postUserLoginCode: (code: string, init?: RequestInit) => fetch(`${API_ROOT}/user/login/code`, { ...init, method: "POST", body: JSON.stringify({ code }), headers: { ...init?.headers, 'Content-Type': 'application/json' } })
		.then(r => r.json() as Promise<GetUserSecretApiResult>),
	getUserCode: (userId: string, secret: string, init?: RequestInit) => fetch(`${API_ROOT}/user/${userId}/code`, {...init, headers: {...init?.headers, 'X-Secret-String': secret,}})
		.then(r => r.json() as Promise<GetUserCodeResult>),
	
};
export default api;
