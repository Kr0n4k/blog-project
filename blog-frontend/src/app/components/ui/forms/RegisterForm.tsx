"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../requests/mutations/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
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
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              Имя
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ваше имя"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Фамилия
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ваша фамилия"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-2">
            Имя пользователя
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="username"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Придумайте пароль"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Подтвердите пароль
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Повторите пароль"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
        
        <div className="text-center text-sm text-muted">
          <span>Уже есть аккаунт? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline focus:outline-none"
            disabled={isLoading}
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}