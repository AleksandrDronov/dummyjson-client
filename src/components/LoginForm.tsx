import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useState } from 'react';
import type { AuthCredentials } from '../types/auth';
import { TextInputField } from './TextInputField';
import { PasswordField } from './PasswordField';
import { CheckboxField } from './CheckboxField';
import { ApiErrorMessage } from './ApiErrorMessage';
import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { createLoginValidator } from '../utils/loginValidation';
import { getErrorMessage } from '../utils/apiError';

interface FieldErrors extends Record<string, string | undefined> {
  username?: string;
  password?: string;
  apiError?: string;
}

const initialValues: AuthCredentials = {
  username: '',
  password: '',
  rememberMe: false,
};

const validate = createLoginValidator();

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useForm<AuthCredentials, FieldErrors>({
    initialValues,
    validate,
    onSubmit: async (values) => {
      try {
        await login(values);
      } catch (error) {
        const message = getErrorMessage(error);
        setFieldError('apiError', message);
      }
    },
    getAllTouched: () => ({ username: true, password: true, rememberMe: false }),
  });

  const handleClearUsername = () => {
    setFieldValue('username', '');
    setFieldError('username', undefined);
    setFieldTouched('username', false);
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <FormHeader />

        <TextInputField
          name="username"
          label="Логин"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          onClear={handleClearUsername}
          disabled={isLoading}
          error={errors.username}
          touched={touched.username}
          hasPrependIcon
          hasAppendIcon
        />

        <PasswordField
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          setShowPassword={setShowPassword}
          disabled={isLoading}
          error={errors.password}
          touched={touched.password}
          showPassword={showPassword}
        />

        <CheckboxField
          name="rememberMe"
          value={values.rememberMe}
          onChange={handleChange}
          disabled={isLoading}
          label="Запомнить меня"
        />

        <ApiErrorMessage message={errors.apiError} />

        <button type="submit" className="button primary" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <FormFooter />
      </form>
    </div>
  );
}
