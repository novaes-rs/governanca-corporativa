import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { SLIDES, type Slide } from "../../../shared/slides-content";
import { CheckCircle, Clock, Send, Shield, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";

interface StudentActivityProps {
  teamName: string;
  onLeave: () => void;
}

export default function StudentActivity({ teamName, onLeave }: StudentActivityProps) {
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openText, setOpenText] = useState("");

  const { data: session, refetch: refetchSession } = trpc.session.get.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const submitMutation = trpc.responses.submit.useMutation({
    onSuccess: () => {
      if (session) {
        setSubmitted(prev => ({ ...prev, [session.currentSlide]: true }));
        setSelectedOption(null);
        setOpenText("");
        toast.success("Resposta enviada com sucesso!");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const currentSlideIndex = session?.currentSlide ?? 1;
  const currentSlide: Slide | undefined = SLIDES.find(s => s.index === currentSlideIndex);
  const hasSubmitted = submitted[currentSlideIndex] ?? false;

  // Reset submission state when slide changes
  useEffect(() => {
    setSelectedOption(null);
    setOpenText("");
  }, [currentSlideIndex]);

  const handleSubmit = () => {
    if (!session || !currentSlide?.activity) return;
    const activity = currentSlide.activity;
    let response = "";
    let isCorrect = false;
    let pointsEarned = 0;

    if (activity.type === "quiz" || activity.type === "vote") {
      if (!selectedOption) { toast.error("Selecione uma opção antes de enviar."); return; }
      response = selectedOption;
      if (activity.type === "quiz" && activity.correctAnswer) {
        isCorrect = selectedOption === activity.correctAnswer;
        pointsEarned = isCorrect ? (activity.points ?? 10) : 0;
      } else if (activity.type === "vote") {
        pointsEarned = activity.points ?? 10;
      }
    } else {
      if (!openText.trim()) { toast.error("Escreva sua resposta antes de enviar."); return; }
      response = openText.trim();
      pointsEarned = activity.points ?? 20;
    }

    submitMutation.mutate({
      sessionId: session.id,
      slideIndex: currentSlideIndex,
      teamName,
      activityType: activity.type!,
      response,
      isCorrect,
      pointsEarned,
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#001F3F] font-medium">Conectando à aula...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="bg-[#001F3F] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-bold text-sm">{teamName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-200">Slide {currentSlideIndex}/{SLIDES.length}</span>
          <button onClick={onLeave} className="text-xs text-blue-300 hover:text-white underline">Sair</button>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Slide type badge */}
        <div className="mb-4">
          {currentSlide?.type === "activity" ? (
            <span className="inline-flex items-center gap-1.5 bg-[#001F3F] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5" /> ATIVIDADE EM EQUIPE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-[#E8F0FE] text-[#001F3F] text-xs font-bold px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" /> CONTEÚDO
            </span>
          )}
        </div>

        {/* Slide title */}
        <h2 className="text-xl font-bold text-[#001F3F] mb-4 leading-tight">
          {currentSlide?.title ?? "Aguardando próxima atividade..."}
        </h2>

        {/* Content slide */}
        {currentSlide?.type !== "activity" && (
          <div className="space-y-3">
            {currentSlide?.highlight && (
              <div className="bg-[#001F3F] text-white rounded-xl p-4 text-sm font-medium leading-relaxed">
                {currentSlide.highlight}
              </div>
            )}
            {currentSlide?.content.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E8F0FE] last:border-0">
                <div className="w-2 h-2 rounded-full bg-[#001F3F] mt-2 flex-shrink-0" />
                <p className="text-[#001F3F] text-sm leading-relaxed">{item}</p>
              </div>
            ))}
            <div className="mt-6 bg-[#E8F0FE] rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-[#001F3F] mx-auto mb-2" />
              <p className="text-[#001F3F] text-sm font-medium">Acompanhe o professor</p>
              <p className="text-[#003D7A] text-xs mt-1">A próxima atividade será liberada em breve</p>
            </div>
          </div>
        )}

        {/* Activity slide */}
        {currentSlide?.type === "activity" && currentSlide.activity && (
          <div>
            {hasSubmitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#001F3F] mb-2">Resposta Enviada!</h3>
                <p className="text-gray-500 text-sm">Aguarde o professor liberar os resultados no projetor.</p>
                {currentSlide.activity.points && (
                  <div className="mt-4 inline-block bg-[#E8F0FE] rounded-xl px-6 py-3">
                    <p className="text-[#001F3F] font-bold">Até {currentSlide.activity.points} pontos em jogo</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Question */}
                <div className="bg-[#E8F0FE] rounded-xl p-4">
                  <p className="text-[#001F3F] font-semibold text-sm leading-relaxed whitespace-pre-line">
                    {currentSlide.activity.question}
                  </p>
                </div>

                {/* Hint */}
                {currentSlide.activity.hint && (
                  <div className="border border-[#003D7A] rounded-xl p-3">
                    <p className="text-[#003D7A] text-xs"><span className="font-bold">Dica:</span> {currentSlide.activity.hint}</p>
                  </div>
                )}

                {/* Quiz / Vote options */}
                {(currentSlide.activity.type === "quiz" || currentSlide.activity.type === "vote") && (
                  <div className="space-y-2">
                    {currentSlide.activity.options?.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium leading-relaxed ${
                          selectedOption === opt.id
                            ? "border-[#001F3F] bg-[#001F3F] text-white"
                            : "border-[#E8F0FE] bg-white text-[#001F3F] hover:border-[#003D7A]"
                        }`}
                      >
                        <span className="font-bold mr-2">{opt.id.toUpperCase()})</span>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Open / Case text */}
                {(currentSlide.activity.type === "open" || currentSlide.activity.type === "case") && (
                  <textarea
                    value={openText}
                    onChange={e => setOpenText(e.target.value)}
                    placeholder="Digite a resposta da sua equipe aqui..."
                    rows={6}
                    className="w-full border-2 border-[#E8F0FE] rounded-xl p-4 text-[#001F3F] text-sm focus:outline-none focus:border-[#001F3F] resize-none"
                  />
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="w-full py-4 bg-[#001F3F] text-white font-bold rounded-xl hover:bg-[#003D7A] transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                >
                  {submitMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Resposta da {teamName}
                    </>
                  )}
                </button>

                {currentSlide.activity.points && (
                  <p className="text-center text-xs text-gray-400">
                    Esta atividade vale até <strong>{currentSlide.activity.points} pontos</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
