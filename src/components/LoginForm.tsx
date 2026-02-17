import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import type { AuthCredentials } from '../types/auth';
import { ApiError } from '../api/httpClient';
import logoSrc from '../assets/logo.png';
import { TextInputField } from './TextInputField';
import { PasswordField } from './PasswordField';
import { CheckboxField } from './CheckboxField';
import { createLoginValidator } from '../utils/loginValidation';

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

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validate = createLoginValidator();

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
        if (error instanceof ApiError) {
          const body = error.body as { message?: string; error?: string } | undefined;
          const message = body?.message ?? body?.error ?? 'Не удалось выполнить вход';
          setFieldError('apiError', message);
        } else {
          setFieldError('apiError', 'Произошла неизвестная ошибка');
        }
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
        <div className="logo-wrapper">
          <img src={logoSrc} alt="logo" className="logo" />
        </div>

        <h1 className="card-title">Добро пожаловать!</h1>
        <p className="card-subtitle">Пожалуйста, авторизируйтесь</p>

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

        {errors.apiError && <div className="form-error">{errors.apiError}</div>}

        <button type="submit" className="button primary" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <p className="auth-hint">
          Можно использовать тестовые данные из DummyJSON, например
          <br />
          <code>emilys / emilyspass</code> (логин / пароль)
        </p>

        <div className="register-link">
          <span>Нет аккаунта? </span>
          <a href="#" className="register-link__a">
            Создать
          </a>
        </div>
      </form>
    </div>
  );
}
