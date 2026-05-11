import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { SessionState, SessionAction } from '../types/session'

const initialState: SessionState = {
  selectedTestId: null,
  config: null,
  result: null,
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SELECT_TEST':
      return { selectedTestId: action.testId, config: null, result: null }
    case 'SET_CONFIG':
      return { ...state, config: action.config }
    case 'RECORD_RESULT':
      return { ...state, result: action.result }
    case 'RESET':
      return initialState
  }
}

interface SessionContextValue {
  state: SessionState
  dispatch: React.Dispatch<SessionAction>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (ctx === null) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return ctx
}
