import { trpc } from "@/lib/trpc";
import { SLIDES, TEAMS, type Slide } from "../../../shared/slides-content";
import { Trophy, Shield, CheckCircle, Clock, BookOpen, Star } from "lucide-react";

const TEAM_COLORS = [
  { bg: "bg-[#001F3F]", text: "text-white", border: "border-[#001F3F]", light: "bg-[#E8F0FE]" },
  { bg: "bg-[#003D7A]", text: "text-white", border: "border-[#003D7A]", light: "bg-[#dce8f8]" },
  { bg: "bg-[#0055A5]", text: "text-white", border: "border-[#0055A5]", light: "bg-[#d0e2f7]" },
  { bg: "bg-[#0066CC]", text: "text-white", border: "border-[#0066CC]", light: "bg-[#c5dcf5]" },
  { bg: "bg-[#1a3a6b]", text: "text-white", border: "border-[#1a3a6b]", light: "bg-[#d8e5f5]" },
];

export default function ProjectorView() {
  const { data: session } = trpc.session.get.useQuery(undefined, {
    refetchInterval: 2000,
  });

  const currentSlideIndex = session?.currentSlide ?? 1;
  const currentSlide: Slide | undefined = SLIDES.find(s => s.index === currentSlideIndex);

  const { data: responses } = trpc.responses.getForSlide.useQuery(
    { sessionId: session?.id ?? 0, slideIndex: currentSlideIndex },
    { enabled: !!session, refetchInterval: 2000 }
  );

  const { data: scores } = trpc.scores.get.useQuery(
    { sessionId: session?.id ?? 0 },
    { enabled: !!session, refetchInterval: 2000 }
  );

  const getTeamResponse = (teamName: string) =>
    responses?.find(r => r.teamName === teamName);

  const teamHasResponded = (teamName: string) =>
    responses?.some(r => r.teamName === teamName) ?? false;

  const respondedCount = TEAMS.filter(teamHasResponded).length;

  // --- SCORE VIEW ---
  if (session?.scoresVisible) {
    const sortedScores = scores ?? TEAMS.map(t => ({ teamName: t, totalPoints: 0 }));
    const maxPoints = Math.max(...sortedScores.map(s => s.totalPoints), 1);

    return (
      <div className="min-h-screen bg-white flex flex-col p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#001F3F] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#001F3F]">Placar da Turma</h1>
              <p className="text-[#003D7A] text-sm font-medium">Compliance — Governança Corporativa</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Slide {currentSlideIndex}/{SLIDES.length}</p>
            <p className="text-xs text-gray-400">{currentSlide?.title}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4 max-w-4xl mx-auto w-full">
          {sortedScores.map((score, i) => {
            const pct = maxPoints > 0 ? (score.totalPoints / maxPoints) * 100 : 0;
            const colors = TEAM_COLORS[TEAMS.indexOf(score.teamName)] ?? TEAM_COLORS[0];
            return (
              <div key={score.teamName} className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {i === 0 && score.totalPoints > 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : i === 1 && score.totalPoints > 0 ? (
                    <span className="text-2xl">🥈</span>
                  ) : i === 2 && score.totalPoints > 0 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="text-xl font-bold text-gray-400">{i + 1}</span>
                  )}
                </div>
                <div className="w-28 font-bold text-[#001F3F] text-lg">{score.teamName}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} rounded-full flex items-center justify-end pr-4 transition-all duration-700`}
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  >
                    <span className="text-white font-black text-lg">{score.totalPoints}</span>
                  </div>
                </div>
                <div className="w-16 text-right font-black text-2xl text-[#001F3F]">
                  {score.totalPoints}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Placar atualizado em tempo real</p>
        </div>
      </div>
    );
  }

  // --- RESPONSES VIEW (activity slide with responses visible) ---
  if (session?.responsesVisible && currentSlide?.type === "activity" && currentSlide.activity) {
    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#001F3F] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#003D7A] font-bold uppercase tracking-wide">
                Slide {currentSlideIndex} · {currentSlide.activity.type === "quiz" ? "Quiz" : currentSlide.activity.type === "vote" ? "Votação" : currentSlide.activity.type === "case" ? "Análise de Caso" : "Resposta Aberta"}
              </p>
              <h1 className="text-xl font-black text-[#001F3F]">{currentSlide.title}</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#001F3F]">{respondedCount}/{TEAMS.length}</div>
            <p className="text-xs text-gray-500">equipes responderam</p>
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#E8F0FE] rounded-2xl p-4 mb-5">
          <p className="text-[#001F3F] font-semibold text-base leading-relaxed whitespace-pre-line">
            {currentSlide.activity.question}
          </p>
        </div>

        {/* Team responses grid */}
        <div className="grid grid-cols-5 gap-3 flex-1">
          {TEAMS.map((team, i) => {
            const resp = getTeamResponse(team);
            const colors = TEAM_COLORS[i];
            const isQuizOrVote = currentSlide.activity?.type === "quiz" || currentSlide.activity?.type === "vote";

            // For quiz: check correctness
            const isCorrect = resp?.isCorrect ?? false;
            const correctAnswer = currentSlide.activity?.correctAnswer;
            const selectedOpt = currentSlide.activity?.options?.find(o => o.id === resp?.response);

            return (
              <div key={team} className={`flex flex-col rounded-2xl overflow-hidden border-2 ${resp ? colors.border : "border-gray-200"}`}>
                {/* Team header */}
                <div className={`${resp ? colors.bg : "bg-gray-100"} px-3 py-2 flex items-center justify-between`}>
                  <span className={`font-black text-sm ${resp ? colors.text : "text-gray-400"}`}>{team}</span>
                  {resp ? (
                    <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Response content */}
                <div className="flex-1 p-3 bg-white">
                  {!resp ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-300 text-xs text-center">Aguardando resposta...</p>
                    </div>
                  ) : isQuizOrVote ? (
                    <div className="flex flex-col gap-2 h-full">
                      <div className={`rounded-xl p-3 text-center ${isCorrect ? "bg-green-100 border border-green-300" : currentSlide.activity?.type === "vote" ? colors.light : "bg-red-50 border border-red-200"}`}>
                        <span className={`text-2xl font-black ${isCorrect ? "text-green-700" : currentSlide.activity?.type === "vote" ? "text-[#001F3F]" : "text-red-600"}`}>
                          {resp.response.toUpperCase()}
                        </span>
                      </div>
                      {selectedOpt && (
                        <p className="text-xs text-gray-600 leading-relaxed">{selectedOpt.text}</p>
                      )}
                      {currentSlide.activity?.type === "quiz" && (
                        <div className={`text-xs font-bold text-center ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                          {isCorrect ? `✓ Correto (+${resp.pointsEarned} pts)` : "✗ Incorreto"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#001F3F] leading-relaxed overflow-y-auto max-h-36">
                      {resp.response}
                    </p>
                  )}
                </div>

                {/* Points */}
                {resp && resp.pointsEarned > 0 && (
                  <div className={`${colors.bg} px-3 py-1.5 text-center`}>
                    <span className={`text-xs font-bold ${colors.text}`}>+{resp.pointsEarned} pts</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Correct answer for quiz */}
        {currentSlide.activity.type === "quiz" && currentSlide.activity.correctAnswer && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <span className="text-green-700 font-bold text-sm">Resposta correta: </span>
              <span className="text-green-700 text-sm font-bold">{currentSlide.activity.correctAnswer.toUpperCase()}) </span>
              <span className="text-green-700 text-sm">
                {currentSlide.activity.options?.find(o => o.id === currentSlide.activity?.correctAnswer)?.text}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DEFAULT CONTENT VIEW ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header bar */}
      <div className="bg-[#001F3F] text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" />
          <div>
            <p className="font-black text-lg">Compliance no Setor Público vs. Privado</p>
            <p className="text-blue-200 text-xs">Governança Corporativa</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-blue-200 text-xs">Slide</p>
            <p className="font-black text-xl">{currentSlideIndex}/{SLIDES.length}</p>
          </div>
          {currentSlide?.type === "activity" && (
            <div className="bg-yellow-400 text-[#001F3F] px-3 py-1.5 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span className="font-black text-sm">ATIVIDADE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-12 py-8">
        {currentSlide?.type === "cover" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#001F3F] flex items-center justify-center mb-8">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black text-[#001F3F] mb-4 leading-tight max-w-3xl">
              {currentSlide.title}
            </h1>
            <p className="text-2xl text-[#003D7A] font-semibold mb-6">{currentSlide.highlight}</p>
            {currentSlide.content.map((c, i) => (
              <p key={i} className="text-lg text-gray-600">{c}</p>
            ))}
          </div>
        )}

        {currentSlide?.type === "content" && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-black text-[#001F3F] mb-6">{currentSlide.title}</h1>
            {currentSlide.highlight && (
              <div className="bg-[#001F3F] text-white rounded-2xl p-5 mb-6">
                <p className="text-xl font-semibold leading-relaxed">{currentSlide.highlight}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 flex-1">
              {currentSlide.content.map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-[#E8F0FE] last:border-0">
                  <div className="w-3 h-3 rounded-full bg-[#001F3F] mt-2 flex-shrink-0" />
                  <p className="text-[#001F3F] text-xl leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSlide?.type === "activity" && !session?.responsesVisible && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#001F3F] flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-[#001F3F] mb-4">{currentSlide.title}</h1>
            <div className="bg-[#E8F0FE] rounded-2xl p-6 max-w-3xl mb-6">
              <p className="text-[#001F3F] text-xl font-semibold leading-relaxed whitespace-pre-line">
                {currentSlide.activity?.question}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#001F3F] text-white rounded-full px-6 py-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">{respondedCount}/{TEAMS.length} equipes responderam</span>
              </div>
              {currentSlide.activity?.points && (
                <div className="border-2 border-[#001F3F] text-[#001F3F] rounded-full px-6 py-3">
                  <span className="font-bold text-lg">{currentSlide.activity.points} pontos</span>
                </div>
              )}
            </div>
            {/* Team status dots */}
            <div className="flex gap-3 mt-6">
              {TEAMS.map((team, i) => (
                <div key={team} className="flex flex-col items-center gap-1">
                  <div className={`w-4 h-4 rounded-full ${teamHasResponded(team) ? "bg-green-500" : "bg-gray-200"}`} />
                  <span className="text-xs text-gray-500">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSlide?.type === "closing" && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-black text-[#001F3F] mb-4">{currentSlide.title}</h1>
            {currentSlide.highlight && (
              <div className="bg-[#001F3F] text-white rounded-2xl p-5 mb-6">
                <p className="text-2xl font-bold text-center">{currentSlide.highlight}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              {currentSlide.content.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E8F0FE] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#001F3F] mt-2 flex-shrink-0" />
                  <p className="text-[#001F3F] text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-[#E8F0FE] px-8 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          {TEAMS.map((team, i) => (
            <div key={team} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${teamHasResponded(team) ? "bg-[#001F3F] text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
              <div className={`w-2 h-2 rounded-full ${teamHasResponded(team) ? "bg-green-400" : "bg-gray-300"}`} />
              {team}
            </div>
          ))}
        </div>
        <p className="text-xs text-[#003D7A] font-medium">Aguardando liberação do professor</p>
      </div>
    </div>
  );
}
