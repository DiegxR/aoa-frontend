"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClientClient } from "@/lib/graphql/client";
import { REGISTER_MUTATION } from "@/lib/graphql/queries";
import { type UserItem, type UserRole } from "@/lib/reducers/usersReducer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createUser as createUserAction,
  deleteUser as deleteUserAction,
  hydrateUsersFromStorage,
  updateUser as updateUserAction,
} from "@/lib/features/usersSlice";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface UsersContextValue {
  users: UserItem[];
  editingUser: UserItem | null;
  isSaving: boolean;
  createUser: (values: UserFormValues) => Promise<void>;
  updateUser: (id: string, values: UserFormValues) => void;
  deleteUser: (id: string) => void;
  startEditingUser: (user: UserItem) => void;
  cancelEditingUser: () => void;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const loggedUser = useAppSelector((state) => state.auth.user);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedUsers = useRef(false);

  useEffect(() => {
    dispatch(hydrateUsersFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedUsers.current) {
      hasLoadedUsers.current = true;
      return;
    }
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const contextValue = useMemo<UsersContextValue>(
    () => ({
      users,
      editingUser,
      isSaving,
      createUser: async (values) => {
        setIsSaving(true);
        try {
          const client = createClientClient();
          const data = await client.request(REGISTER_MUTATION, {
            name: values.name,
            email: values.email,
            password: values.password,
            role: "user",
            createdBy: loggedUser?.id,
          });

          const createdUser = data?.register?.user;
          if (!createdUser) {
            throw new Error("No se pudo crear el usuario en la base de datos");
          }

          dispatch(
            createUserAction({
              id: createdUser.id,
              name: createdUser.name,
              email: createdUser.email,
              password: values.password,
              role: "user",
              createdBy: createdUser.createdBy ?? loggedUser?.id ?? null,
            }),
          );
        } finally {
          setIsSaving(false);
        }
      },
      updateUser: (id, values) => {
        const current = users.find((user) => user.id === id);
        if (!current) return;
        dispatch(
          updateUserAction({
            ...current,
            ...values,
            id,
            role: current.role,
            createdBy: current.createdBy ?? null,
          }),
        );
      },
      deleteUser: (id) => {
        if (editingUser?.id === id) {
          setEditingUser(null);
        }
        dispatch(deleteUserAction(id));
      },
      startEditingUser: (user) => setEditingUser(user),
      cancelEditingUser: () => setEditingUser(null),
    }),
    [dispatch, editingUser, isSaving, loggedUser?.id, users],
  );

  return (
    <UsersContext.Provider value={contextValue}>{children}</UsersContext.Provider>
  );
}

export function useUsersContext() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within UsersProvider");
  }
  return context;
}
