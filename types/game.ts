interface Game {
	id: string,
	state: GameState,
	moves: Array<[number, "X" | "O"]>,
	startTime: string,
	winIdx: number | null,
}

type GameState = "movingX" | "movingO" | "winX" | "winO" | "draw"
