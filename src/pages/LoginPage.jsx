import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      console.error('Login error detail:', err);
      if (!err.response) {
        setError(`Cannot connect to server at ${import.meta.env.VITE_API_URL}. Is the backend running?`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Secure access to your health portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === 'patient' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === 'doctor' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'
              }`}
            >
              Doctor
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/20 active:scale-[0.98]"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={async () => {
              try {
                const res = await fetch('https://health.yunus.eu.org/health');
                const data = await res.json();
                alert(`Direct Health Check: ${JSON.stringify(data)}`);
              } catch (e) {
                alert(`Direct Health Check Failed: ${e.message}`);
                console.error(e);
              }
            }}
            className="w-full mt-2 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Diagnostic: Test Backend Connection
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Don't have an account? <span className="text-primary-600 font-semibold cursor-pointer">Register now</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
