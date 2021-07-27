export interface Game {
	id: string,
	state: GameState,
	moves: Array<[number, "X" | "O"]>,
	startTime: string,
	winIdx: number | null,
}

export function boardFromGame(game: Game, gameStep?: number): Array<"X" | "O" | null> {
	const result = new Array(9).fill(null);
	const moves = gameStep || gameStep === 0 ? game.moves.slice(0, gameStep) : game.moves;
	for (const [position, value] of moves) {
		result[position] = value;
	}
	return result;
}

export type GameState = "movingX" | "movingO" | "winX" | "winO" | "draw"
