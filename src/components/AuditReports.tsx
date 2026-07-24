import { useState, useMemo, useEffect } from 'react'
import { ClipboardList, Filter, Search, User, Loader2,
         Activity, CalendarDays, Users
 } from 'lucide-react'

import {getApiUrl} from '../config.ts'

export function AuditReports() {
  const [timeFilter, setTimeFilter] = useState('Hoje');
  const [userFilter, setUserFilter] = useState('Todos os usuários');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/audit`);
        if (!response.ok) throw new Error('Falha ao buscar auditoria');
        
        const data = await response.json();
        const formattedLogs = data.map((log: any) => ({
          id: log.id,
          user: log.userName,
          username: log.userUsername,
          role: log.userRole,
          action: log.action,
          date: log.createdAt
        }));
        
        setAuditLogs(formattedLogs);
      } catch (err) {
        console.error("Erro ao carregar o histórico de auditoria:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (log.user || '').toLowerCase().includes(searchLower) ||
        (log.action || '').toLowerCase().includes(searchLower) ||
        (log.username || '').toLowerCase().includes(searchLower);
      let matchesUser = true;
      if (userFilter === 'Administrador') matchesUser = log.role === 'ADM';
      if (userFilter === 'Operadores') matchesUser = log.role === 'OPERADOR';

      let matchesTime = true;
      if (log.date) {
        const logDate = new Date(log.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - logDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === 'Hoje') {
          matchesTime = diffDays <= 1;
        } else if (timeFilter === '7 dias') {
          matchesTime = diffDays <= 7;
        } else if (timeFilter === '30 dias') {
          matchesTime = diffDays <= 30;
        }
      }

      return matchesSearch && matchesUser && matchesTime;
    });
  }, [auditLogs, timeFilter, userFilter, searchTerm]);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Total de Eventos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total de Eventos</p>
            <p className="text-3xl font-bold text-slate-800">{auditLogs.length}</p>
          </div>
        </div>

        {/* Card 2: Eventos Hoje */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Eventos Hoje</p>
            <p className="text-3xl font-bold text-slate-800">
              {auditLogs.filter(log => new Date(log.date).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>

        {/* Card 3: Usuários Ativos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Usuários Ativos</p>
            <p className="text-3xl font-bold text-slate-800">3</p>
          </div>
        </div>

        {/* Card 4: Exibindo (Filtro) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Filter size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Exibindo</p>
            <p className="text-3xl font-bold text-slate-800">{filteredLogs.length}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Auditoria */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Histórico de Auditoria</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filtros de Tempo */}
            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
              {['Todos', 'Hoje', '7 dias', '30 dias'].map(f => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === f ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <Filter className="text-slate-400" size={20} />

            {/* Select de Usuários */}
            <select 
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 bg-white"
            >
              <option>Todos os usuários</option>
              <option>Administrador</option>
              <option>Operadores</option>
            </select>

            {/* Barra de Busca */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por usuário ou ação..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Cargo</th>
              <th className="px-6 py-4">Ação</th>
              <th className="px-6 py-4">Data e Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            
            {/* Estado de Carregamento */}
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    Carregando registros...
                  </div>
                </td>
              </tr>
            )}

            {/* Lista Mapeada */}
            {!isLoading && filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <User size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{log.user}</p>
                      <p className="text-xs text-slate-500">{log.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    log.role === 'ADM' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {log.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold uppercase">Fez</span>
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ClipboardList size={14} />
                    {formatDateTime(log.date)}
                  </div>
                </td>
              </tr>
            ))}

            {/* Aviso de lista vazia após carregar */}
            {!isLoading && filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Nenhum registro encontrado com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}