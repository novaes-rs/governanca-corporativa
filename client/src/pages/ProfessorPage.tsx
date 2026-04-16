import { useState } from "react";
import { trpc } from "@/lib/trpc";
import ProfessorLogin from "./ProfessorLogin";
import ProfessorDashboard from "./ProfessorDashboard";

export default function ProfessorPage() {
  const { data: authData, refetch } = trpc.professor.checkAuth.useQuery();
  const [forceAuth, setForceAuth] = useState(false);

  const isAuthenticated = authData?.authenticated || forceAuth;

  const handleLogin = () => {
    setForceAuth(true);
    refetch();
  };

  const handleLogout = () => {
    setForceAuth(false);
    refetch();
  };

  if (!isAuthenticated) {
    return <ProfessorLogin onLogin={handleLogin} />;
  }

  return <ProfessorDashboard onLogout={handleLogout} />;
}
