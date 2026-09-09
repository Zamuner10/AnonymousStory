import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ReadLetters } from "./pages/ReadLetters";
import { ProtectedRoute } from "./components/ProtectedRoute"; // <-- Importação adicionada
import { CreateStory } from "./pages/CreateStory"; // <-- Importação adicionada
import { ForgotPassword } from "./pages/ForgotPassword"; // <-- Importação adicionada
import { ResetPassword } from "./pages/ResetPassword";  // <-- Importação adicionada

// IMPORTANTE: não colocar <BrowserRouter> aqui dentro. O BrowserRouter deve existir em UM lugar só.

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<ReadLetters />} />


        {/* Rotas de Redefinição de Senha */}
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>}/>

        {/* Rota Protegida */}
        <Route
          path="/write" 
          element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}