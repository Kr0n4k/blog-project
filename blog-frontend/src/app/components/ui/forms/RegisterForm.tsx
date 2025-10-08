"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../requests/mutations/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onLoginClick?: () => void;
  onClose?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin, onLoginClick, onClose }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [register] = useMutation(REGISTER_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(""); // Очищаем ошибку при изменении поля
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    // Проверка минимальной длины пароля
    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const { data } = await register({
        variables: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password
          }
        }
      });
      
      console.log("User registered:", data.createUser);
      
      // Успешная регистрация
      if (onSuccess) {
        onSuccess();
      } else {
        alert("Регистрация прошла успешно! Теперь вы можете войти.");
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Ошибка регистрации. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-hi-tech rounded-lg p-8 w-full max-w-md animate-fadeIn">
      {/* Заголовок с хай-тек стилем */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-hi-tech-pulse hi-tech-glow"></div>
            <h2 className="text-2xl font-bold text-hi-tech font-mono tracking-wider">REGISTRATION</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-red-400 hover:text-red-300 text-2xl font-light transition-all duration-300 hover:scale-110 hover:rotate-90 font-mono"
              title="CLOSE REGISTRATION FORM"
            >
              ×
            </button>
          )}
        </div>
        <div className="w-24 h-1 bg-blue-400 mx-auto hi-tech-glow"></div>
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
        {/* Имя и Фамилия */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-green-400 mb-3 font-mono tracking-wider">
              FIRST NAME
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full input-hi-tech rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="JOHN"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-green-400 mb-3 font-mono tracking-wider">
              LAST NAME
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full input-hi-tech rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="DOE"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Имя пользователя */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-blue-400 mb-3 font-mono tracking-wider">
            USERNAME
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="USERNAME"
            required
            disabled={isLoading}
          />
        </div>
        
        {/* Email */}
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
        
        {/* Пароль */}
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
            placeholder="CREATE PASSWORD"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        {/* Подтверждение пароля */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-red-400 mb-3 font-mono tracking-wider">
            CONFIRM PASSWORD
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="REPEAT PASSWORD"
            required
            disabled={isLoading}
          />
        </div>
        
        {/* Кнопка регистрации */}
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
              REGISTERING...
            </span>
          ) : "REGISTER"}
        </button>
        
        {/* Ссылка на логин */}
        <div className="text-center text-sm text-white/60 font-mono">
          <span>ALREADY HAVE ACCOUNT? </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="text-green-400 hover:text-green-300 hover:underline focus:outline-none font-mono transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}