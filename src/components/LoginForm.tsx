import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthCredentials } from '../types/auth';
import { ApiError } from '../api/httpClient';
import logoSrc from '../assets/logo.png';
import { UsernameField } from './UsernameField';
import { PasswordField } from './PasswordField';
import { CheckboxField } from './CheckboxField';

interface FieldErrors {
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
  const [values, setValues] = useState<AuthCredentials>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{
    username: boolean;
    password: boolean;
  }>({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const validate = (current: AuthCredentials): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!current.username.trim()) {
      nextErrors.username = 'Введите логин';
    }
    if (!current.password.trim()) {
      nextErrors.password = 'Введите пароль';
    }
    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      ...validate(values),
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ username: true, password: true });

    if (validationErrors.username || validationErrors.password) {
      return;
    }

    try {
      setErrors({});
      await login(values);
    } catch (error) {
      if (error instanceof ApiError) {
        const body = error.body as { message?: string; error?: string } | undefined;
        const message = body?.message ?? body?.error ?? 'Не удалось выполнить вход';
        setErrors({ apiError: message });
      } else {
        setErrors({ apiError: 'Произошла неизвестная ошибка' });
      }
    }
  };

  const handleClearUsername = () => {
    setValues((prev) => ({ ...prev, username: '' }));
    setErrors((prev) => ({ ...prev, username: undefined }));
    setTouched((prev) => ({ ...prev, username: false }));
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <div className="logo-wrapper">
          <img src={logoSrc} alt="logo" className="logo" />
        </div>

        <h1 className="card-title">Добро пожаловать!</h1>
        <p className="card-subtitle">Пожалуйста, авторизируйтесь</p>

        <UsernameField
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          onClear={handleClearUsername}
          disabled={isLoading}
          error={errors.username}
          touched={touched.username}
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
