import { useState } from 'react'
import { Lock, User, LogIn } from 'lucide-react'


interface LoginProps {
  onLogin: (userData: { name: string; role: string, username: string }) => void;
  setActiveTab: (tab: "vender" | "estoque" | "historico") => void;
}

export function Login({ onLogin, setActiveTab }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    let userLogged = null;

    if (username === 'admin' && password === 'admin123') {
      onLogin({ name: 'Albiere (Admin)', role: 'ADM', username: 'admin' });
      userLogged = { name: 'Albiere (Admin)', role: 'ADM', username: 'admin' };
    } else if (username === 'op1' && password === '123') {
      onLogin({ name: 'Operadora 1', role: 'OPERADOR', username: 'op1' });
      userLogged = { name: 'Operadora 1', role: 'OPERADOR', username: 'op1' };
    } else if (username === 'op2' && password === '123') {
      onLogin({ name: 'Operadora 2', role: 'OPERADOR', username: 'op2' });
      userLogged = { name: 'Operadora 2', role: 'OPERADOR' };
    } else {
      setError('Usuário ou senha incorretos.');
    }

    try {
      fetch('http://localhost:8080/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: userLogged?.name,
          userUsername: username,
          userRole: userLogged?.role,
          action: 'Fez login no sistema'
        })
      });
    } catch (err) {
      console.error("Erro ao salvar auditoria de login:", err);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Flow PDV</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button onClick={() => setActiveTab('vender')} 
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <LogIn size={20} /> Entrar no Sistema
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Contas de teste:<br/>
          admin / admin123<br/>
          op1 / 123 | op2 / 123
        </div>
      </div>
    </div>
  )
}