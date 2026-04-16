import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { SLIDES, TEAMS, type Slide } from "../../../shared/slides-content";
import {
  ChevronLeft, ChevronRight, Eye, EyeOff, Monitor, MonitorOff,
  Trophy, RotateCcw, LogOut, Shield, Users, CheckCircle, Clock,
  ExternalLink, Trash2, Star
} from "lucide-react";
import { toast } from "sonner";

interface ProfessorDashboardProps {
  onLogout: () => void;
}

const TEAM_COLORS: Record<string, string> = {
  "Equipe 1": "bg-[#001F3F]",
  "Equipe 2": "bg-[#003D7A]",
  "Equipe 3": "bg-[#0055A5]",
  "Equipe 4": "bg-[#0066CC]",
  "Equipe 5": "bg-[#1a3a6b]",
};

export default function ProfessorDashboard({ onLogout }: ProfessorDashboardProps) {
  const utils = trpc.useUtils();

  const { data: session, refetch: refetchSession } = trpc.session.get.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const currentSlideIndex = session?.currentSlide ?? 1;
  const currentSlide: Slide | undefined = SLIDES.find(s => s.index === currentSlideIndex);

  const { data: responses } = trpc.responses.getForSlide.useQuery(
    { sessionId: session?.id ?? 0, slideIndex: currentSlideIndex },
    { enabled: !!session, refetchInterval: 2000 }
  );

  const { data: scores } = trpc.scores.get.useQuery(
    { sessionId: session?.id ?? 0 },
    { enabled: !!session, refetchInterval: 3000 }
  );

  const setSlideMutation = trpc.session.setSlide.useMutation({
    onSuccess: () => utils.session.get.invalidate(),
  });
  const toggleResponsesMutation = trpc.session.toggleResponses.useMutation({
    onSuccess: () => utils.session.get.invalidate(),
  });
  const toggleScoresMutation = trpc.session.toggleScores.useMutation({
    onSuccess: () => utils.session.get.invalidate(),
  });
  const toggleProjectorMutation = trpc.session.toggleProjector.useMutation({
    onSuccess: () => utils.session.get.invalidate(),
  });
  const clearResponsesMutation = trpc.responses.clearSlide.useMutation({
    onSuccess: () => {
      utils.responses.getForSlide.invalidate();
      toast.success("Respostas limpas!");
    },
  });
  const resetScoresMutation = trpc.scores.reset.useMutation({
    onSuccess: () => {
      utils.scores.get.invalidate();
      toast.success("Placar zerado!");
    },
  });
  const newSessionMutation = trpc.session.create.useMutation({
    onSuccess: () => {
      utils.session.get.invalidate();
      toast.success("Nova sessão iniciada!");
    },
  });
  const logoutMutation = trpc.professor.logout.useMutation({
    onSuccess: onLogout,
  });

  const goToSlide = (index: number) => {
    if (!session || index < 1 || index > SLIDES.length) return;
    setSlideMutation.mutate({ sessionId: session.id, slideIndex: index });
  };

  const teamHasResponded = (teamName: string) =>
    responses?.some(r => r.teamName === teamName) ?? false;

  const getTeamResponse = (teamName: string) =>
    responses?.find(r => r.teamName === teamName);

  const respondedCount = TEAMS.filter(teamHasResponded).length;

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#001F3F] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-bold text-sm hidden sm:block">Painel do Professor</span>
          <span className="font-bold text-sm sm:hidden">Professor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-200 hidden sm:block">Compliance — Governança Corporativa</span>
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-1 text-xs text-blue-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* LEFT: Slide control */}
          <div className="lg:col-span-2 space-y-4">

            {/* Current slide preview */}
            <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-[#003D7A] uppercase tracking-wide">
                    Slide {currentSlideIndex} de {SLIDES.length}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {currentSlide?.type === "activity" ? (
                      <span className="bg-[#001F3F] text-white text-xs px-2 py-0.5 rounded-full font-bold">ATIVIDADE</span>
                    ) : (
                      <span className="bg-[#E8F0FE] text-[#001F3F] text-xs px-2 py-0.5 rounded-full font-bold">CONTEÚDO</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/projector"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#E8F0FE] text-[#001F3F] text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#001F3F] hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Projetor
                  </a>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#001F3F] mb-3">{currentSlide?.title}</h2>

              {currentSlide?.highlight && (
                <div className="bg-[#E8F0FE] rounded-xl p-3 mb-3">
                  <p className="text-[#001F3F] text-sm font-medium">{currentSlide.highlight}</p>
                </div>
              )}

              {currentSlide?.type === "activity" && currentSlide.activity && (
                <div className="border border-[#E8F0FE] rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-[#003D7A] mb-1">
                    {currentSlide.activity.type === "quiz" && "QUIZ"}
                    {currentSlide.activity.type === "vote" && "VOTAÇÃO"}
                    {currentSlide.activity.type === "case" && "ANÁLISE DE CASO"}
                    {currentSlide.activity.type === "open" && "RESPOSTA ABERTA"}
                    {" · "}{currentSlide.activity.points} pontos
                  </p>
                  <p className="text-[#001F3F] text-sm leading-relaxed line-clamp-3">
                    {currentSlide.activity.question}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => goToSlide(currentSlideIndex - 1)}
                  disabled={currentSlideIndex <= 1 || setSlideMutation.isPending}
                  className="flex items-center gap-1 px-4 py-2.5 border-2 border-[#001F3F] text-[#001F3F] rounded-xl font-semibold text-sm hover:bg-[#001F3F] hover:text-white transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <div className="flex-1 text-center">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {SLIDES.map(s => (
                      <button
                        key={s.index}
                        onClick={() => goToSlide(s.index)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                          s.index === currentSlideIndex
                            ? "bg-[#001F3F] text-white"
                            : s.type === "activity"
                            ? "bg-[#E8F0FE] text-[#001F3F] hover:bg-[#003D7A] hover:text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {s.index}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => goToSlide(currentSlideIndex + 1)}
                  disabled={currentSlideIndex >= SLIDES.length || setSlideMutation.isPending}
                  className="flex items-center gap-1 px-4 py-2.5 bg-[#001F3F] text-white rounded-xl font-semibold text-sm hover:bg-[#003D7A] transition-colors disabled:opacity-40"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#001F3F] uppercase tracking-wide mb-4">Controles da Aula</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => session && toggleResponsesMutation.mutate({ sessionId: session.id, visible: !session.responsesVisible })}
                  disabled={!session || toggleResponsesMutation.isPending}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                    session?.responsesVisible
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-[#001F3F] text-white hover:bg-[#003D7A]"
                  }`}
                >
                  {session?.responsesVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {session?.responsesVisible ? "Ocultar Respostas" : "Liberar Respostas"}
                </button>

                <button
                  onClick={() => session && toggleScoresMutation.mutate({ sessionId: session.id, visible: !session.scoresVisible })}
                  disabled={!session || toggleScoresMutation.isPending}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                    session?.scoresVisible
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-[#001F3F] text-white hover:bg-[#003D7A]"
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  {session?.scoresVisible ? "Ocultar Placar" : "Mostrar Placar"}
                </button>

                <button
                  onClick={() => session && clearResponsesMutation.mutate({ sessionId: session.id, slideIndex: currentSlideIndex })}
                  disabled={!session || clearResponsesMutation.isPending}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm border-2 border-[#001F3F] text-[#001F3F] hover:bg-[#E8F0FE] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Respostas
                </button>

                <button
                  onClick={() => { if (session && confirm("Zerar placar de todas as equipes?")) resetScoresMutation.mutate({ sessionId: session.id }); }}
                  disabled={!session || resetScoresMutation.isPending}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Zerar Placar
                </button>
              </div>

              <button
                onClick={() => { if (confirm("Iniciar nova sessão? Isso apagará os dados da sessão atual.")) newSessionMutation.mutate(); }}
                className="w-full mt-3 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Nova Sessão de Aula
              </button>
            </div>

            {/* Responses panel */}
            {currentSlide?.type === "activity" && (
              <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#001F3F] uppercase tracking-wide">
                    Respostas Recebidas
                  </h3>
                  <span className="bg-[#E8F0FE] text-[#001F3F] text-xs font-bold px-3 py-1 rounded-full">
                    {respondedCount}/{TEAMS.length} equipes
                  </span>
                </div>
                <div className="space-y-2">
                  {TEAMS.map(team => {
                    const resp = getTeamResponse(team);
                    return (
                      <div key={team} className={`rounded-xl p-3 border-2 ${resp ? "border-green-200 bg-green-50" : "border-[#E8F0FE] bg-gray-50"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-[#001F3F]">{team}</span>
                          {resp ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        {resp && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {currentSlide.activity?.type === "quiz" || currentSlide.activity?.type === "vote"
                              ? `Opção: ${resp.response.toUpperCase()}`
                              : resp.response}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Scoreboard */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#001F3F]" />
                <h3 className="text-sm font-bold text-[#001F3F] uppercase tracking-wide">Placar</h3>
              </div>
              <div className="space-y-2">
                {(scores ?? TEAMS.map(t => ({ teamName: t, totalPoints: 0 }))).map((score, i) => (
                  <div key={score.teamName} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 && score.totalPoints > 0 ? "bg-[#001F3F] text-white" : "bg-[#E8F0FE]"}`}>
                    <span className={`text-lg font-black w-6 text-center ${i === 0 && score.totalPoints > 0 ? "text-yellow-300" : "text-[#001F3F]"}`}>
                      {i === 0 && score.totalPoints > 0 ? "🥇" : i + 1}
                    </span>
                    <span className={`flex-1 font-semibold text-sm ${i === 0 && score.totalPoints > 0 ? "text-white" : "text-[#001F3F]"}`}>
                      {score.teamName}
                    </span>
                    <span className={`font-black text-lg ${i === 0 && score.totalPoints > 0 ? "text-yellow-300" : "text-[#001F3F]"}`}>
                      {score.totalPoints}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status indicators */}
            <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#001F3F] uppercase tracking-wide mb-4">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Respostas no Projetor</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${session?.responsesVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {session?.responsesVisible ? "VISÍVEL" : "OCULTO"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Placar no Projetor</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${session?.scoresVisible ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                    {session?.scoresVisible ? "VISÍVEL" : "OCULTO"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Equipes responderam</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#E8F0FE] text-[#001F3F]">
                    {respondedCount}/{TEAMS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide list */}
            <div className="bg-white border-2 border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#001F3F] uppercase tracking-wide mb-3">Roteiro da Aula</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {SLIDES.map(s => (
                  <button
                    key={s.index}
                    onClick={() => goToSlide(s.index)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      s.index === currentSlideIndex
                        ? "bg-[#001F3F] text-white font-bold"
                        : "hover:bg-[#E8F0FE] text-[#001F3F]"
                    }`}
                  >
                    <span className="w-5 text-center font-bold">{s.index}</span>
                    <span className="flex-1 truncate">{s.title}</span>
                    {s.type === "activity" && (
                      <Star className="w-3 h-3 flex-shrink-0 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
