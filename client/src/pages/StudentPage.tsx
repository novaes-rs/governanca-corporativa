import { useState, useEffect } from "react";
import StudentEntry from "./StudentEntry";
import StudentActivity from "./StudentActivity";

const STORAGE_KEY = "compliance_team";

export default function StudentPage() {
  const [team, setTeam] = useState<string | null>(() => {
    return sessionStorage.getItem(STORAGE_KEY);
  });

  const handleSelectTeam = (selectedTeam: string) => {
    sessionStorage.setItem(STORAGE_KEY, selectedTeam);
    setTeam(selectedTeam);
  };

  const handleLeave = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setTeam(null);
  };

  if (!team) {
    return <StudentEntry onSelectTeam={handleSelectTeam} />;
  }

  return <StudentActivity teamName={team} onLeave={handleLeave} />;
}
