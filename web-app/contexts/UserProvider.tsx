'use client';

import { UserContext } from './UserContext';

export default function UserProvider({ user, profile, children }: {
    user: any;
    profile: any;
    children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
}
