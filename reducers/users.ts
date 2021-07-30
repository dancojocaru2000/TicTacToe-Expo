import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../types/user";

interface UsersState {
	users: Array<User>,
	usersState: "idle" | "fetching",
}

const initialState: UsersState = {
	users: [],
	usersState: "idle",
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		replaceUsers: (state, payload: PayloadAction<Array<User>>) => {
			state.users = payload.payload;
			state.usersState = "idle";
		},
		setUsersState: (state, payload: PayloadAction<"idle" | "fetching">) => {
			if (state.usersState === payload.payload) {
				return;
			}
			state.usersState = payload.payload;
		},
	},
});

export default usersSlice.reducer;
export const actions = usersSlice.actions;

export const usersSelector = (state: RootState) => state.users.users;
export const userSelector = (userId: string) => (state: RootState) => state.users.users.find(u => u.id === userId);
export const usersStateSelector = (state: RootState) => state.users.usersState;
