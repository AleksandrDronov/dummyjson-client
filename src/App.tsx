import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { ProductsPage } from './pages/ProductsPage';

function AppContent() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = Boolean(user);

  if (isLoading) {
    return <div className="app-loading">Загрузка...</div>;
  }

  return isAuthenticated ? <ProductsPage /> : <LoginForm />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
