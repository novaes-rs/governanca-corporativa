import { useState } from "react";
import { Shield } from "lucide-react";
import { TEAMS } from "../../../shared/slides-content";

interface StudentEntryProps {
  onSelectTeam: (team: string) => void;
}

const TEAM_COLORS = [
  "bg-[#001F3F] hover:bg-[#003D7A]",
  "bg-[#003D7A] hover:bg-[#0055A5]",
  "bg-[#0055A5] hover:bg-[#0066CC]",
  "bg-[#0066CC] hover:bg-[#0077EE]",
  "bg-[#1a3a6b] hover:bg-[#254e8f]",
];

const TEAM_ICONS = ["🔵", "🟦", "🛡️", "⚖️", "🏛️"];

export default function StudentEntry({ onSelectTeam }: StudentEntryProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = (team: string) => {
    setSelected(team);
    setConfirming(true);
  };

  const handleConfirm = () => {
    if (selected) onSelectTeam(selected);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#001F3F] flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#001F3F] mb-1">Sala de Aula Interativa</h1>
        <p className="text-[#003D7A] font-semibold text-lg">Compliance — Governança Corporativa</p>
        <p className="text-gray-500 text-sm mt-2">Selecione sua equipe para participar da aula</p>
      </div>

      {!confirming ? (
        <div className="w-full max-w-sm space-y-3">
          {TEAMS.map((team, i) => (
            <button
              key={team}
              onClick={() => handleSelect(team)}
              className={`w-full py-5 px-6 rounded-xl text-white font-bold text-xl flex items-center gap-4 transition-all duration-200 active:scale-95 shadow-md ${TEAM_COLORS[i]}`}
            >
              <span className="text-2xl">{TEAM_ICONS[i]}</span>
              <span>{team}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-sm text-center">
          <div className="border-2 border-[#001F3F] rounded-2xl p-8 mb-6 bg-[#f0f4ff]">
            <div className="text-5xl mb-4">
              {TEAM_ICONS[TEAMS.indexOf(selected!)]}
            </div>
            <h2 className="text-2xl font-bold text-[#001F3F] mb-2">{selected}</h2>
            <p className="text-[#003D7A] text-sm">Confirme sua seleção para entrar na aula</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setConfirming(false); setSelected(null); }}
              className="flex-1 py-4 border-2 border-[#001F3F] text-[#001F3F] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-4 bg-[#001F3F] text-white font-bold rounded-xl hover:bg-[#003D7A] transition-colors active:scale-95"
            >
              Entrar na Aula
            </button>
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center">
        Sem necessidade de cadastro · Acesse pelo celular
      </p>
    </div>
  );
}
