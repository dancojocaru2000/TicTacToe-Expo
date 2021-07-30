export interface User {
	id: string,
	nickname: string,
	stats: {
		local: UserStats,
		online: UserStats,
	},
}

export interface UserStats {
	total: number,
	won: number,
}
