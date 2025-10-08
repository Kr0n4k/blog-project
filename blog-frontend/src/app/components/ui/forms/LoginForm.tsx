"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../requests/mutations/auth";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onClose?: () => void;
  onRegisterClick?: () => void;
}

interface LoginResponse {
  login: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
    };
  };
}

export default function LoginForm({ onSuccess, onSwitchToRegister, onClose, onRegisterClick }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [login] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const { data } = await login({
        variables: {
          data: {
            login: formData.email,
            password: formData.password
          }
        }
      });
      
      if (data?.login) {
        console.log("Login successful:", data.login);
        // Cookie устанавливается сервером; localStorage не используется
        // Успешный вход - закрываем модалку и обновляем страницу
        if (onSuccess) {
          onSuccess();
        } else if (onClose) {
          onClose();
        }
        
        // Даем время на обновление состояния аутентификации
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError("Ошибка входа: неверный ответ от сервера");
      }
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Ошибка входа. Проверьте email и пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-hi-tech rounded-lg p-8 w-full max-w-md animate-fadeIn">
      {/* Заголовок с хай-тек стилем */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-hi-tech-pulse hi-tech-glow"></div>
          <h2 className="text-2xl font-bold text-hi-tech font-mono tracking-wider">LOGIN</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-2xl font-light transition-all duration-300 hover:scale-110 hover:rotate-90 font-mono"
            title="CLOSE LOGIN FORM"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Сообщение об ошибке */}
      {error && (
        <div className="card-hi-tech border border-red-400 bg-red-400/10 text-red-400 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-hi-tech-pulse"></div>
            <span className="font-mono text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-3 font-mono tracking-wider">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="YOUR@EMAIL.COM"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blue-400 mb-3 font-mono tracking-wider">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ENTER PASSWORD"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn-hi-tech w-full py-4 px-6 rounded-lg font-mono text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AUTHENTICATING...
            </span>
          ) : "LOGIN"}
        </button>
        
        <div className="text-center text-sm text-white/60 font-mono">
          <span>NO ACCOUNT? </span>
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-green-400 hover:text-green-300 hover:underline focus:outline-none font-mono transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            REGISTER
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-white/40 font-mono">
        <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 hover:scale-105">
          FORGOT PASSWORD?
        </a>
      </div>
    </div>
  );
}