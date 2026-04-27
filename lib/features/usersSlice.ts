import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserItem } from "@/lib/reducers/usersReducer";

interface UsersState {
  users: UserItem[];
}

const initialState: UsersState = {
  users: [],
};

const USERS_STORAGE_KEY = "users";

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    hydrateUsersFromStorage: (state) => {
      if (typeof window === "undefined") return;
      const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersStr) return;
      try {
        state.users = JSON.parse(usersStr) as UserItem[];
      } catch {
        state.users = [];
      }
    },
    setUsers: (state, action: PayloadAction<UserItem[]>) => {
      state.users = action.payload;
    },
    createUser: (state, action: PayloadAction<UserItem>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserItem>) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user,
      );
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const {
  hydrateUsersFromStorage,
  setUsers,
  createUser,
  updateUser,
  deleteUser,
} = usersSlice.actions;
export default usersSlice.reducer;
