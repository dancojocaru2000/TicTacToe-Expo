import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AppReducer {
	loggedInViewPage: null | string,
}

const initialState: AppReducer = {
	loggedInViewPage: null,
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLoggedInViewPage: (state, payload: PayloadAction<null | string>) => {
			if (state.loggedInViewPage === payload.payload) {
				return;
			}
			state.loggedInViewPage = payload.payload;
		}
	},
});

export default appSlice.reducer;
export const actions = appSlice.actions;

export const loggedInViewPageSelector = (state: RootState) => state.app.loggedInViewPage;

