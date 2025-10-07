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
    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-md animate-fadeIn mobile-form">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 gradient-text">Вход в аккаунт</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-all duration-300 hover:scale-110 hover:rotate-90 touch-button"
          >
            ×
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fadeIn">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="input w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="input w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Введите пароль"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-3 px-4 rounded-lg font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Вход...
            </span>
          ) : "Войти"}
        </button>
        
        <div className="text-center text-sm text-gray-600">
          <span>Нет аккаунта? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none font-medium transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 hover:scale-105">
          Забыли пароль?
        </a>
      </div>
    </div>
  );
}