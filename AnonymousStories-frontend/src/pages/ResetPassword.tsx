import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Token de redefinição ausente ou inválido na URL.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });

      setSuccessMessage(response.data.message || "Senha alterada com sucesso!");

      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao redefinir a senha. O token pode ter expirado.");
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen py-10 flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        {/* Logotipo da Aplicação */}
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer mb-6"
        >
          <span className="font-['Caveat'] text-3xl font-bold text-[#1a1208] tracking-tight">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        {/* Card Sem Linha Vermelha */}
        <div className="relative w-full bg-[#fffdfc]/95 border-2 border-[#1a1208] rounded-lg p-8 shadow-md">
          <h2 className="font-['Caveat'] text-4xl font-bold text-[#1a1208] text-center mb-1">
            Nova Senha
          </h2>
          <p className="font-['Caveat'] text-lg text-[#7a5a2a] text-center mb-4">
            Escolha uma nova senha para a sua conta
          </p>

          <SketchDivider seed={28} />

          {/* Feedback de Sucesso */}
          {successMessage && (
            <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-900 rounded font-['Caveat'] text-xl text-center">
              {successMessage} Redirecionando para o login...
            </div>
          )}

          {/* Feedback de Erro */}
          {error && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded font-['Caveat'] text-xl text-center">
              {error}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
              <div>
                <Label>Nova Senha</Label>
                <SketchInput
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  seed={18}
                />
              </div>

              <div>
                <Label>Confirmar Nova Senha</Label>
                <SketchInput
                  type="password"
                  placeholder="Digite a nova senha novamente"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  seed={24}
                />
              </div>

              <div className="mt-2">
                <SketchButton seed={35} variant="primary" type="submit">
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
                </SketchButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}