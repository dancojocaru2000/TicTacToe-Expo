// Meta state, that is helpful but sorta unrelated 
// to the main functionality of the app

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface MetaState {
	nickRegex?: RegExp,
}

const initialState: MetaState = {
	
};

export const metaSlice = createSlice({
	name: 'meta',
	initialState,
	reducers: {
		removeNickRegex: state => {
			state.nickRegex = undefined;
		},
		setNickRegex: (state, payload: PayloadAction<RegExp>) => {
			state.nickRegex = payload.payload;
		}
	}
});

export default metaSlice.reducer;
export const actions = metaSlice.actions;

export const nickRegexSelector = (state: RootState) => state.meta.nickRegex;
