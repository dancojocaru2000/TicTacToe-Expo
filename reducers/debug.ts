import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface DebugReducer {
	slowMode: boolean,
}

const initialState: DebugReducer = {
	slowMode: true,
};

export const debugSlice = createSlice({
	name: 'debug',
	initialState,
	reducers: {
		setSlowMode: (state, payload: PayloadAction<boolean>) => {
			state.slowMode = payload.payload;
		}
	},
});

export default debugSlice.reducer;
export const actions = debugSlice.actions;

export const slowModeSelector = (state: RootState) => state.debug.slowMode;
