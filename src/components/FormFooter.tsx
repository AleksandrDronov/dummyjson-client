export function FormFooter() {
  return (
    <>
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
    </>
  );
}
