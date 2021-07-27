import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { Game } from "../types/game"

interface GamesState {
    games: Array<Game>,
    currentGameId: string | null,
}

const initialState: GamesState = {
	games: [],
    currentGameId: null,
}

export const gamesSlice = createSlice({
	name: 'games',
	initialState,
	reducers: {
		newGame: {
			reducer: (state, action) => {
				const game = action.payload.game as Game
                state.games.push(game)
                if (action.payload.moveToNewGame) {
                    state.currentGameId = game.id;
                }
			},
			prepare: (moveToNewGame: boolean = false) => {
				const id = nanoid();
				const now = new Date();
				return {
                    payload: {
                        game: {
                            id,
                            state: "movingX",
                            moves: [],
                            startTime: now.toISOString(),
                            winIdx: null,
                        } as Game,
                        moveToNewGame,
					},
					meta: null,
					error: null,
				}
			}
		},
		updateGame: (state, payload: PayloadAction<GameUpdate>) => {
			const idx = state.games.findIndex(game => game.id === payload.payload.gameId);
			if (idx === -1) return;
			if (state.games[idx].state.substr(0, 6) !== "moving") return;
			const currentPlayer = state.games[idx].state.substring(6) as "X" | "O";
			if (state.games[idx].moves.some(([position, _]) => position === payload.payload.position)) {
				// Selected already selected position
				return;
			}
			state.games[idx].moves.push([payload.payload.position, currentPlayer]);
			// Check for next game state
			const gameState = checkGame(state.games[idx]);
			if (gameState.type === "win") {
				state.games[idx].state = `win${currentPlayer}`;
				state.games[idx].winIdx = gameState.winIdx;
			}
			else if (gameState.type === "draw") {
				state.games[idx].state = "draw";
			}
			else {
				const nextPlayer = currentPlayer === "X" ? "O" : "X";
				state.games[idx].state = `moving${nextPlayer}`;
			}
        },
        chooseGame: (state, payload: PayloadAction<string | null>) => {
            state.currentGameId = payload.payload;
        }
	}
})

function checkGame(game: Game): { type: "draw" | "ongoing" } | {type: "win", winIdx: number } {
	const board: Array<"X" | "O" | null> = Array(9).fill(null);
	for (const [position, move] of game.moves) {
		board[position] = move;
	}

    const possibleWinPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [idx, possibleWinPos] of possibleWinPositions.entries()) {
        const itemsInWin = possibleWinPos.map(i => board[i]);
        const win = itemsInWin.every(item => item && item === itemsInWin[0]);
        if (win) {
            return {
                type: "win",
                winIdx: idx,
            };
        }
    }

    if (board.some(item => item === null)) {
        return {
            type: "ongoing",
        };
    }
    else {
        return {
            type: "draw",
        };
    }
}

type GameUpdate = {
	gameId: string,
	position: number,
}

export default gamesSlice.reducer
export const actions = gamesSlice.actions

export const gamesSelector = (state: RootState) => state.games.games;
export const gameIdSelector = (state: RootState) => state.games.currentGameId;
