export type UserRole = "admin" | "user";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdBy?: string | null;
}

interface UsersState {
  users: UserItem[];
}

type UsersAction =
  | { type: "users/load"; payload: UserItem[] }
  | { type: "users/create"; payload: UserItem }
  | { type: "users/update"; payload: UserItem }
  | { type: "users/delete"; payload: string };

export const initialUsersState: UsersState = {
  users: [],
};

export function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case "users/load":
      return { ...state, users: action.payload };
    case "users/create":
      return { ...state, users: [...state.users, action.payload] };
    case "users/update":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user,
        ),
      };
    case "users/delete":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    default:
      return state;
  }
}

export type { UsersState, UsersAction };
