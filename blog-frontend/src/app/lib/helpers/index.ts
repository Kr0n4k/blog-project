import { debounce, throttle, getErrorMessage, isNetworkError } from '../../shared/utils';

// Form validation helpers
export const validateField = (value: any, rules: any): string | null => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'Это поле обязательно для заполнения';
  }
  
  if (rules.minLength && value && value.length < rules.minLength) {
    return `Минимум ${rules.minLength} символов`;
  }
  
  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `Максимум ${rules.maxLength} символов`;
  }
  
  if (rules.pattern && value && !rules.pattern.test(value)) {
    return rules.message || 'Неверный формат';
  }
  
  if (rules.custom && value) {
    return rules.custom(value);
  }
  
  return null;
};

export const validateForm = (data: Record<string, any>, rules: Record<string, any>) => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const fieldValue = data[field];
    const error = validateField(fieldValue, fieldRules);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Error handling helpers
export const handleApiError = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Ошибка сети. Проверьте подключение к интернету.';
  }
  
  const message = getErrorMessage(error);
  
  // Handle specific GraphQL errors
  if (message.includes('Unauthorized')) {
    return 'Необходимо войти в систему';
  }
  
  if (message.includes('Forbidden')) {
    return 'Недостаточно прав для выполнения операции';
  }
  
  if (message.includes('Not Found')) {
    return 'Запрашиваемый ресурс не найден';
  }
  
  return message;
};

// Performance helpers
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
) => debounce(func, delay);

export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 100
) => throttle(func, delay);

// URL helpers
export const createSearchParams = (params: Record<string, any>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  return searchParams;
};

export const parseSearchParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// Local storage helpers with error handling
export const safeStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

// Class name helpers
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const conditionalClass = (condition: boolean, className: string): string => {
  return condition ? className : '';
};

// Event helpers
export const preventDefault = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

export const stopPropagation = (e: React.SyntheticEvent) => {
  e.stopPropagation();
};

// Async helpers
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Type guards
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isObject = (value: any): value is object => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

// Format helpers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
