import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ProfessorLoginProps {
  onLogin: () => void;
}

export default function ProfessorLogin({ onLogin }: ProfessorLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.professor.login.useMutation({
    onSuccess: () => {
      toast.success("Acesso autorizado!");
      onLogin();
    },
    onError: () => toast.error("Senha incorreta. Tente novamente."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    loginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#001F3F] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#001F3F]">Painel do Professor</h1>
          <p className="text-[#003D7A] text-sm mt-1">Compliance — Governança Corporativa</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#001F3F] mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a senha do professor"
                className="w-full border-2 border-[#E8F0FE] rounded-xl px-4 py-3 text-[#001F3F] focus:outline-none focus:border-[#001F3F] pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003D7A]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending || !password.trim()}
            className="w-full py-4 bg-[#001F3F] text-white font-bold rounded-xl hover:bg-[#003D7A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Acessar Painel"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acesso restrito ao professor responsável pela aula
        </p>
      </div>
    </div>
  );
}
