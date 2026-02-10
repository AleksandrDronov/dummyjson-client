import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { EyeIcon } from "./icons/EyeIcon";
import { EyeOffIcon } from "./icons/EyeOffIcon";
import { UserIcon } from "./icons/UserIcon";
import type { AuthCredentials } from "../types/auth";
import { ApiError } from "../api/httpClient";
import logoSrc from "../assets/logo.png";
import { LockIcon } from "./icons/LockIcon";
import { ClearIcon } from "./icons/ClearIcon";
 

interface FieldErrors {
  username?: string;
  password?: string;
  apiError?: string;
}

const initialValues: AuthCredentials = {
  username: "",
  password: "",
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
      nextErrors.username = "Введите логин";
    }
    if (!current.password.trim()) {
      nextErrors.password = "Введите пароль";
    }
    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        const body = error.body as
          | { message?: string; error?: string }
          | undefined;
        const message =
          body?.message ?? body?.error ?? "Не удалось выполнить вход";
        setErrors({ apiError: message });
      } else {
        setErrors({ apiError: "Произошла неизвестная ошибка" });
      }
    }
  };

   const handleClearUsername = () => {
    setValues((prev) => ({ ...prev, username: "" }));
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

        <div className="field-group">
          <label htmlFor="username">Логин</label>
          <div className="input-icon-wrapper">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={
                touched.username && errors.username ? "input error" : "input"
              }
              required
            />
            <span className="input-icon" aria-hidden="true">
              <UserIcon />
            </span>
            {values.username && !isLoading && (
              <button
                type="button"
                className="clear-input-btn"
                aria-label="Очистить логин"
                tabIndex={0}
                onClick={handleClearUsername}
              >
                <ClearIcon />
              </button>
            )}
          </div>
          <span className="field-error">
            {touched.username && errors.username}
          </span>
        </div>

        <div className="field-group">
          <label htmlFor="password">Пароль</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={
                (touched.password && errors.password
                  ? "input error"
                  : "input") + " password-input"
              }
              required
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((v) => !v)}
              className="password-toggle-btn"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
            <span className="input-icon" aria-hidden="true">
              <LockIcon />
            </span>
          </div>
          <span className="field-error">
            {touched.password && errors.password}
          </span>
        </div>

        <div className="field-row">
          <label className="checkbox-label custom-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={values.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
              className="checkbox-input"
            />
            <span className="checkbox-custom" aria-hidden="true"></span>
            <span className="checkbox-label-text">Запомнить меня</span>
          </label>
        </div>

        {errors.apiError && <div className="form-error">{errors.apiError}</div>}

        <button type="submit" className="button primary" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <p className="auth-hint">
          Можно использовать тестовые данные из DummyJSON, например
          <br />
          <code>emilys / emilyspass</code> (логин / пароль)
        </p>
        <div className="register-link">
          <span>Нет аккаунта? </span>
          <a href="#" className="register-link__a">Создать</a>
        </div>
      </form>
    </div>
  );
}
