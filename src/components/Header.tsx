import axios from 'axios';
import { ShoppingCart, Package, Clock, LogOut, UserCircle, ClipboardList, Users } from 'lucide-react'
import { useState } from 'react';
import type { Sale } from '../types.ts'

interface HeaderProps {
  activeTab: 'vender' | 'estoque' | 'historico' | 'relatorios' | 'clientes';
  onTabChange: (tab: 'vender' | 'estoque' | 'historico' | 'relatorios' | 'clientes') => void;
  user: { name: string, role: string };
  onLogout: () => void;
}

export function Header({ activeTab, onTabChange, user, onLogout }: HeaderProps) {
  const [_, setProducts] = useState<any[]>([]);
  const [__, setSales] = useState<Sale[]>([]);
  const [___, setCustomers] = useState<any[]>([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro do servidor ao buscar produtos:", response.statusText);
      }
    } catch (err) {
      console.error("Erro de conexão ao buscar produtos. O Java está rodando?", err);
    }
  };

  const fetchSalesHistory = async () => {
    axios.get('http://localhost:8080/api/sales')
      .then(response => setSales(response.data))
      .catch(error => console.error("Erro ao buscar histórico:", error))
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex h-full">
          <div onClick={() => onTabChange('vender')} className={`${activeTab === 'vender' ? 'flex items-center gap-2 px-6 font-semibold cursor-pointer bg-indigo-50/50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2 px-6 font-medium cursor-pointer'}`}>
            <ShoppingCart size={20} /> Vender
          </div>
          <div onClick={() => {onTabChange('estoque'); fetchProducts();}} className={`${activeTab === 'estoque' ? 'flex items-center gap-2 px-6 font-semibold cursor-pointer bg-indigo-50/50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2 px-6 font-medium cursor-pointer'}`}>
            <Package size={20} /> Estoque
          </div>
          <div onClick={() => {onTabChange('historico'); fetchSalesHistory();}} className={`${activeTab === 'historico' ? 'flex items-center gap-2 px-6 font-semibold cursor-pointer bg-indigo-50/50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2 px-6 font-medium cursor-pointer'}`}>
            <Clock size={20} /> Histórico
          </div>
          <div onClick={() => {onTabChange('clientes'); fetchCustomers();}} className={`${activeTab === 'clientes' ? 'flex items-center gap-2 px-6 font-semibold cursor-pointer bg-indigo-50/50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2 px-6 font-medium cursor-pointer'}`}>
            <Users size={20} /> Clientes
          </div>
          {user.role === 'ADM' && (
        <button 
            onClick={() => onTabChange('relatorios')}
            className={`px-8 py-5 font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'relatorios' ? 'flex items-center gap-2 px-6 font-semibold cursor-pointer bg-indigo-50/50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2 px-6 font-medium cursor-pointer'}`}>
            <ClipboardList size={20} /> Relatórios
        </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <UserCircle className="text-slate-400" size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 leading-none">{user.name}</span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>
    </header>
  )
}