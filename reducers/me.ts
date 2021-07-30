import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type LoginState = "loggedOut" | "loading" | "loggedIn";

interface MeState {
	state: LoginState,
	details?: {
		userId: string,
		secret: string,
	},
	loginCode?: {
		code: string,
		expiryDate: Date,
	} | "loading",
}

const initialState: MeState = {
	state: "loggedOut",
};

export const meSlice = createSlice({
	name: 'me',
	initialState,
	reducers: {
		logOut: state => {
			state.state = "loggedOut";
			state.details = undefined;
		},
		logIn: (state, payload: PayloadAction<{ userId: string, secret: string }>) => {
			state.state = "loggedIn";
			state.details = {
				userId: payload.payload.userId,
				secret: payload.payload.secret,
			};
		},
		loadingLogIn: state => {
			state.state = "loading";
		},
		loadingLogInCode: state => {
			state.loginCode = "loading";
		},
		setLoginCode: (state, payload: PayloadAction<{ code: string, expiryDate: Date }>) => {
			state.loginCode = payload.payload;
		},
		resetLoginCode: (state, payload: PayloadAction<{ code: string, expiryDate: Date }>) => {
			if (!state.loginCode || state.loginCode === "loading") return;
			if (state.loginCode.code === payload.payload.code && state.loginCode.expiryDate === payload.payload.expiryDate) {
				state.loginCode = undefined;
			}
		},
	},
});

export default meSlice.reducer;
export const actions = meSlice.actions;

export const userDetailsSelector = (state: RootState) => state.me.details;
export const userIdSelector = (state: RootState) => state.me.details?.userId;
export const loginCodeSelector = (state: RootState) => state.me.loginCode;
