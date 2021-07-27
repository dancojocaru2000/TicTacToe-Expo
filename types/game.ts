interface Game {
	id: string,
	state: GameState,
	moves: Array<[number, "X" | "O"]>,
}

type GameState = "movingX" | "movingO" | "winX" | "winO" | "draw"
