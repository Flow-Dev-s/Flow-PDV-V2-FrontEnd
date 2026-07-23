import { ShoppingCart, Trash2, User, ChevronDown, X,
  Banknote, CreditCard,
  QrCode,
  BookOpen, 
} from 'lucide-react'
import type { CartItem } from '../types'
import { useState, useEffect } from 'react';
import { getApiUrl } from '../config';

interface CartProps {
  cart: CartItem[];
  totalItems: number;
  totalAmount: number;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onPaymentMethod: string;
  onSetPaymentMethod: (method: string) => void;
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
}

export function Cart({ cart, totalItems, totalAmount, onRemoveItem, onClearCart, onCheckout, onPaymentMethod, onSetPaymentMethod, selectedCustomer, setSelectedCustomer }: CartProps) {
  const isCartEmpty = cart.length === 0;
  const [customers, setCustomers] = useState<any[]>([]);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const fetchCustomersList = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/customers`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error("Erro ao carregar clientes no PDV:", err);
      }
    };

  useEffect(() => {
    fetchCustomersList();
  }, []);

  useEffect(() => {
    if (!selectedCustomer && onPaymentMethod === 'CONTA') {
      onSetPaymentMethod('DINHEIRO');
    }
  }, [selectedCustomer, onPaymentMethod]);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-[500px] overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <ShoppingCart size={22} className="text-indigo-500" /> Cupom Fiscal
        </h2>
        <span className="bg-slate-200 text-slate-700 text-sm font-bold px-3 py-1 rounded-full">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        {isCartEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="bg-slate-50 p-6 rounded-full">
              <ShoppingCart size={64} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-xl text-slate-500">O carrinho está vazio</p>
              <p className="text-slate-400 mt-1">Passe um produto no leitor para iniciar a venda</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {cart.map((item, index) => (
              <li key={item.product.id} className="group flex justify-between items-center border border-transparent hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm p-4 rounded-xl transition-all">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-500 text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{item.product.name}</p>
                    <p className="text-sm text-slate-500 font-medium">Cód: {item.product.barcode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">{item.quantity}x R$ {item.product.sellingPrice.toFixed(2)}</p>
                    <p className="font-black text-slate-800 text-xl">R$ {(item.quantity * item.product.sellingPrice).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remover item"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-6 pb-4 px-6 border-t border-slate-100">
          <div className="flex justify-between items-center mb-7">
            <span className="text-xl font-bold text-slate-600 uppercase tracking-wider">Total a Pagar</span>
            <span className="text-4xl font-bold text-emerald-500 tracking-tight">R$ {totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Cancelar */}
            <button 
              onClick={onClearCart} 
              disabled={cart.length === 0}
              className="px-6 py-3.5 rounded-xl font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span className="text-lg">✕</span> Cancelar
            </button>

           {/* IDENTIFICAÇÃO DO CLIENTE (COM DROPDOWN INTELIGENTE) */}
          <div className="mb-6 relative">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cliente da Venda</p>
            
            {selectedCustomer ? (
              // ESTADO 1: CLIENTE TRAVADO (SELECIONADO)
              <div className="flex items-center justify-between w-full rounded-xl border-2 border-emerald-500 bg-emerald-50 px-4 py-2.5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <User size={18} />
                  <span>{selectedCustomer.name}</span>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 p-1 rounded-md transition-colors"
                  title="Remover e trocar cliente"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              // ESTADO 2: MODO SELEÇÃO / BUSCA
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                
                <input 
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    const clienteEncontrado = customers.find(c => c.id === Number(e.target.value));
                    setSelectedCustomer(clienteEncontrado || null);
  }}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  // O setTimeout permite que o clique na lista funcione antes de fechar
                  onBlur={() => setTimeout(() => setIsCustomerDropdownOpen(false), 200)} 
                  placeholder="Selecione ou busque..."
                  className="pl-10 pr-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all cursor-text bg-white"
                />
                
                {/* Setinha para baixo */}
                <button 
                  onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 outline-none"
                >
                  <ChevronDown size={18} className={`transition-transform ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* CAIXA SUSPENSA (DROPDOWN) COM A LISTA DE CLIENTES */}
                {isCustomerDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in slide-in-from-top-2">
                    {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).length > 0 ? (
                      customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map(customer => (
                        <div 
                          key={customer.id}
                          onClick={async () => {
                            await setSelectedCustomer(customer);
                            
                            setCustomerSearch(''); // Limpa a busca
                            setIsCustomerDropdownOpen(false); // Fecha a lista
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <p className="font-medium text-slate-700">{customer.name}</p>
                          <p className="text-xs text-slate-400">{customer.phone || customer.document || 'Sem telefone'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">
                        Nenhum cliente encontrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

            {/* FORMA DE PAGAMENTO (EM SELECT COM ÍCONE DINÂMICO LUCIDE) */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Forma de Pagamento
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                {onPaymentMethod === 'PIX' && <QrCode size={20} />}
                {onPaymentMethod === 'DINHEIRO' && <Banknote size={20} />}
                {onPaymentMethod === 'CARTAO' && <CreditCard size={20} />}
                {onPaymentMethod === 'CONTA' && <BookOpen size={20} className="text-amber-500" />}
              </div>

              <select 
                value={onPaymentMethod}
                onChange={(e) => onSetPaymentMethod(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="PIX">PIX</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="CARTAO">Cartão</option>
                
                <option value="CONTA" disabled={!selectedCustomer}>
                  Conta {selectedCustomer ? '(Fiado)' : '- Selecione um cliente'}
                </option>
              </select>
              
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
         
          </div>
          
            {/* Botão Finalizar */}
            <button 
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="flex-[2] px-6 py-3.5 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <span>✓</span> Finalizar Venda (F2)
            </button>
          </div>
        </div>

        
    </section>



  )
}