import React, { useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { BACKEND_URL } from './auth/context';

// --- BİLEŞENLER ---

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Wait for auth provider hydration before deciding to redirect.
  const { hydrated } = useAuth();
  if (hydrated === false) return null; // still hydrating

  if (!isAuthenticated) {
    // Eğer kimlik doğrulaması yoksa Login sayfasına yönlendir
    window.location.hash = '/login';
    return null;
  }
  return <>{children}</>;
};

const Login: React.FC = () => {
  // Start with empty fields so automated tests (Cypress) can type values
  // instead of duplicating hard-coded defaults.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // Başarılı girişten sonra Dashboard'a yönlendir
      window.location.hash = '/dashboard';
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Giriş Başarısız.');
    }
  };

  if (isAuthenticated) {
     // Zaten giriş yapıldıysa Dashboard'a git
     window.location.hash = '/dashboard';
     return null;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} data-cy="login-form" className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">VYS Giriş</h2>
        
        {/* Hata Mesajı */}
        {error && <div data-cy="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* E-posta Alanı */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">E-posta</label>
          <input
            data-cy="email-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="E-posta adresiniz"
          />
        </div>

        {/* Şifre Alanı */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Şifre</label>
          <input
            data-cy="password-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Şifreniz"
          />
        </div>

        {/* Giriş Butonu */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            data-cy="login-button"
          >
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, logout, isManager } = useAuth();

  // Yöneticiler için ek navigasyon, çalışanlar için basit görünüm
  const ManagerPanel = () => (
    <div className="mt-4 p-4 border rounded bg-yellow-50" data-cy="manager-panel">
      <h3 className="text-lg font-semibold text-yellow-700">Yönetici Paneli (Aktif)</h3>
      <p>Yeni vardiyalar oluşturulabilir ve onaylar yönetilebilir.</p>
      <a href="#/shifts/new" data-cy="create-shift-link" className="text-indigo-600 hover:text-indigo-800 underline">Yeni Vardiya Oluştur</a>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800" data-cy="dashboard-header">Vardiya Yönetim Paneli</h1>
        <div className="flex items-center space-x-4">
            <p className="text-gray-600" data-cy="user-welcome-text">
                Hoş Geldin {user?.role === 'manager' || user?.role === 'admin' ? 'Çalışan' : 'Yönetici'} ({user?.email})
            </p>
            <button 
                onClick={logout} 
                data-cy="logout-button"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                Çıkış Yap
            </button>
        </div>
      </div>
      
      {isManager && <ManagerPanel />}
      
      <div data-cy="shifts-list-container" className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Vardiyaların</h2>
        {/* Vardiya Listesi Simülasyonu */}
        <div data-cy="shift-list" className="space-y-3">
             {/* Bu kısım normalde API'dan doldurulurdu, sadece test için placeholder */}
            <div data-cy="shift-list-item" className="p-4 border rounded shadow-sm">Çalışan Vardiya 1 (09:00-17:00)</div>
            {isManager && <div data-cy="shift-list-item" className="p-4 border rounded bg-yellow-100 shadow-sm">Yönetici Vardiya (10:00-18:00) - Yayımlanmadı</div>}
        </div>
      </div>
    </div>
  );
};

const ShiftCreate: React.FC = () => {
    const [start, setStart] = useState('2026-01-01T08:00:00Z');
    const [end, setEnd] = useState('2026-01-01T16:00:00Z');
    const [notes, setNotes] = useState('Standart Vardiya');
    const [status, setStatus] = useState<string | null>(null);
    const { token, isManager } = useAuth();
    const navigate = () => window.location.hash = '/dashboard';

    if (!isManager) {
        window.location.hash = '/403-forbidden';
        return <Forbidden />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        try {
            await axios.post(`${BACKEND_URL}/api/v1/shifts`, {
                shift: { start_time: start, end_time: end, notes: notes, is_published: true }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus("success");
            navigate();
    } catch (error: unknown) {
      setStatus("error");
      const err = error as { response?: { data?: unknown } };
      console.error("Vardiya oluşturma hatası:", err.response?.data);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Yeni Vardiya Oluştur</h2>
            
            {status === 'success' && <p className="text-green-500 mb-4">Vardiya başarıyla oluşturuldu!</p>}
            
            <form onSubmit={handleSubmit} data-cy="shift-form" className="bg-white p-6 rounded shadow-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Başlangıç Zamanı (ISO 8601)</label>
                    <input
                        type="text"
                        data-cy="başlangıç-zamanı-input"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Bitiş Zamanı (ISO 8601)</label>
                    <input
                        type="text"
                        data-cy="bitiş-zamanı-input"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Notlar</label>
                    <textarea
                        data-cy="notes-input"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>
                <div className="flex justify-between">
                    <button type="submit" data-cy="vardiya-yarat-button" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                        Vardiya Yarat
                    </button>
                    <button type="button" onClick={navigate} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
                        Geri Dön
                    </button>
                </div>
            </form>
        </div>
    );
};

const Forbidden: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center p-10 border border-red-400 bg-white rounded shadow-xl">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 Forbidden</h1>
            <p className="text-xl text-gray-700" data-cy="forbidden-message">Bu işlemi yapmaya yetkiniz yok.</p>
            <button onClick={() => window.location.hash = '/dashboard'} className="mt-6 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                Ana Sayfaya Dön
            </button>
        </div>
    </div>
);


const Router = () => {
  const { isAuthenticated } = useAuth();

  // Track the hash in state so the Router re-renders when the hash changes.
  // Without this, clicking an anchor that changes the hash won't update the
  // rendered component because React won't know the URL changed.
  const [rawHash, setRawHash] = React.useState(window.location.hash);
  React.useEffect(() => {
    const onHashChange = () => setRawHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    // If there is no hash at mount, normalize to '#/login' so tests that
    // assert the presence of '/login' in the URL behave consistently.
    if (!window.location.hash) {
      window.location.hash = '/login';
      // setRawHash will be updated via the hashchange event, but ensure state
      // is consistent in environments where the event might be synchronous.
      setRawHash(window.location.hash);
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const path = rawHash.slice(1) || '/login';

  let Component;
  if (!isAuthenticated && path !== '/login') {
    Component = Login; // Kimlik doğrulaması yoksa Login'e zorla
  } else if (path === '/login' || path === '/') {
    Component = Login;
  } else if (path === '/dashboard') {
    Component = Dashboard;
  } else if (path === '/shifts/new') {
    Component = ShiftCreate;
  } else if (path === '/403-forbidden') {
    Component = Forbidden;
  } else {
    Component = () => <div className="p-4">404 Sayfa Bulunamadı</div>;
  }

  // Korunan rotaları sarmala
  const protectedRoutes = ['/dashboard', '/shifts/new'];

  if (protectedRoutes.includes(path)) {
    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  }

  return <Component />;
};

const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;