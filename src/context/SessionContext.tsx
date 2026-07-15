import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface Session {
  groupId: number | null;
  memberId: number | null;
  displayName: string | null;
  joinedAt: string | null;
}

interface SessionValue extends Session {
  setSession: (patch: Partial<Session>) => void;
  clearSession: () => void;
}

const STORAGE_KEY = "familog.session";

const EMPTY_SESSION: Session = { groupId: null, memberId: null, displayName: null, joinedAt: null };

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    return { ...EMPTY_SESSION, ...JSON.parse(raw) };
  } catch {
    return EMPTY_SESSION;
  }
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session>(loadSession);

  const setSession = useCallback((patch: Partial<Session>) => {
    setSessionState((prev) => {
      const next = { ...prev, ...patch };
      if (patch.memberId && !prev.joinedAt) next.joinedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionState(EMPTY_SESSION);
  }, []);

  const value = useMemo(
    () => ({ ...session, setSession, clearSession }),
    [session, setSession, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
