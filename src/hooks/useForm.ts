import { useState, useCallback } from 'react';

export interface UseFormOptions<TValues, TErrors> {
  initialValues: TValues;
  validate: (values: TValues) => TErrors;
  onSubmit: (values: TValues) => Promise<void> | void;
  getAllTouched?: () => Record<keyof TValues, boolean>;
}

export function useForm<TValues, TErrors extends Record<string, string | undefined>>({
  initialValues,
  validate,
  onSubmit,
  getAllTouched,
}: UseFormOptions<TValues, TErrors>) {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<TErrors>({} as TErrors);
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      ...validate(values),
    }));
  }, [validate, values]);

  const handleSubmit = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (getAllTouched) {
      setTouched(getAllTouched());
    }

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  }, [validate, values, onSubmit, getAllTouched]);

  const setFieldValue = useCallback((name: keyof TValues, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: keyof TErrors, error: string | undefined) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name: keyof TValues, isTouched: boolean = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as TErrors);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
  };
}
