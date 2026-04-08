'use client';

import { createContext, useContext } from 'react';

type UserContextType = {
  user: any;
  profile: any;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
});

export function UseAuth() {
  const {user} = useContext(UserContext);
  return user;
}

export function useUser() {
  const {user, profile} = useContext(UserContext);
  return {user, profile};
}
