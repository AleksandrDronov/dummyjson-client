import logoSrc from '../assets/logo.png';

export function FormHeader() {
  return (
    <>
      <div className="logo-wrapper">
        <img src={logoSrc} alt="logo" className="logo" />
      </div>

      <h1 className="card-title">Добро пожаловать!</h1>
      <p className="card-subtitle">Пожалуйста, авторизуйтесь</p>
    </>
  );
}
