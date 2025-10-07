import { useState, useCallback, useRef } from 'react';
import { validateForm } from '../lib/helpers';

interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, any>>;
  onSubmit?: (data: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
) {
  const { initialValues, validationRules, onSubmit } = options;
  
  const [formState, setFormState] = useState<FormState<T>>({
    data: { ...initialValues },
    errors: {},
    isSubmitting: false,
    isDirty: false,
  });

  const initialValuesRef = useRef(initialValues);

  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
      isDirty: true,
      errors: {
        ...prev.errors,
        [field]: undefined, // Clear error when user starts typing
      },
    }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setFormState(prev => ({
      ...prev,
      errors,
    }));
  }, []);

  const validate = useCallback(() => {
    if (!validationRules) return true;

    const { isValid, errors } = validateForm(formState.data, validationRules);
    
    if (!isValid) {
      setErrors(errors);
    }

    return isValid;
  }, [formState.data, validationRules, setErrors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validate()) {
      return;
    }

    if (!onSubmit) {
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(formState.data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.data, validate, onSubmit]);

  const reset = useCallback(() => {
    setFormState({
      data: { ...initialValuesRef.current },
      errors: {},
      isSubmitting: false,
      isDirty: false,
    });
  }, []);

  const resetToInitial = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      data: { ...initialValuesRef.current },
      isDirty: false,
    }));
  }, []);

  return {
    ...formState,
    setValue,
    setError,
    setErrors,
    validate,
    handleSubmit,
    reset,
    resetToInitial,
  };
}
