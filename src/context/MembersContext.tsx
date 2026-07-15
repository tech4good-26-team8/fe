import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { listMembers } from "../api/endpoints";
import type { MemberCardResponse } from "../api/types";
import { useSession } from "./SessionContext";

const MIN_INTERVAL_MS = 2500;
const MAX_INTERVAL_MS = 10000;

interface MembersValue {
  members: MemberCardResponse[];
  getMember: (memberId: number) => MemberCardResponse | undefined;
  refetch: () => void;
}

const MembersContext = createContext<MembersValue | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
  const { groupId, memberId } = useSession();
  const [members, setMembers] = useState<MemberCardResponse[]>([]);
  const lastSnapshotRef = useRef<string>("");
  const intervalRef = useRef(MIN_INTERVAL_MS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    if (!groupId) return;
    try {
      const next = await listMembers(groupId, memberId ?? undefined);
      const snapshot = JSON.stringify(next);
      if (snapshot === lastSnapshotRef.current) {
        intervalRef.current = Math.min(intervalRef.current * 1.5, MAX_INTERVAL_MS);
      } else {
        lastSnapshotRef.current = snapshot;
        intervalRef.current = MIN_INTERVAL_MS;
        setMembers(next);
      }
    } catch {
      intervalRef.current = MAX_INTERVAL_MS;
    }
  }, [groupId, memberId]);

  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;

    async function loop() {
      if (cancelled) return;
      await poll();
      if (cancelled) return;
      timerRef.current = setTimeout(loop, intervalRef.current);
    }

    loop();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [groupId, poll]);

  const refetch = useCallback(() => {
    intervalRef.current = MIN_INTERVAL_MS;
    poll();
  }, [poll]);

  const getMember = useCallback(
    (id: number) => members.find((m) => m.memberId === id),
    [members],
  );

  return (
    <MembersContext.Provider value={{ members, getMember, refetch }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error("useMembers must be used within MembersProvider");
  return ctx;
}
