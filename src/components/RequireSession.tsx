import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSession } from "../context/SessionContext";

export function RequireSession({ children }: { children: ReactNode }) {
  const { memberId } = useSession();
  if (!memberId) return <Navigate to="/" replace />;
  return children;
}
