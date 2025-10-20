import React, { createContext, useContext, useState, ReactNode } from 'react'

type User = { id: string; name: string } | null
type Ctx = { user: User; signIn: (u: NonNullable<User>) => void; signOut: () => void }

const AuthCtx = createContext<Ctx>({ user: null, signIn: () => {}, signOut: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null) // <-- null by default = should show Login first
  const signIn = (u: NonNullable<User>) => setUser(u)
  const signOut = () => setUser(null)
  return <AuthCtx.Provider value={{ user, signIn, signOut }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
