import { useState, useEffect} from 'react';
import axios from 'axios'
import { History, Trash2, Search, X, Receipt, User, CreditCard, DollarSign, Package, Eye, Pencil } from 'lucide-react'
import type { Sale } from '../types.ts'
import { getApiUrl } from '../config';

interface SalesHistoryProps {
  currentUser: { name: string, role: string, username: string } | null;
}

export function SaleHistory({ currentUser }: SalesHistoryProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [editCart, setEditCart] = useState<any[]>([]);
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [modalSearchInput, setModalSearchInput] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [viewingSale, setViewingSale] = useState<any | null>(null);

  useEffect(() => {
    axios.get(`${getApiUrl()}/api/sales`)
      .then(response => setSales(response.data))
      .catch(error => console.error("Erro ao buscar histórico:", error))
  }, [])

  const fetchProductsList = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/products`);
      if (!response.ok) throw new Error('Falha ao buscar produtos');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar lista de produtos para edição:", err);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

const handleCancelCompletedSale = async () => {
    const confirmMessage = `ATENÇÃO: Deseja realmente CANCELAR a Venda #${editingSale.id}?\n\nOs produtos retornarão ao estoque e essa ação ficará registrada na auditoria.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/sales/${editingSale.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetch(`${getApiUrl()}/api/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: currentUser?.name || 'Sistema',
            userUsername: currentUser?.username || 'Admin',
            userRole: currentUser?.role || 'ADM',
            action: `Cancelou permanentemente a venda #${editingSale.id} no valor de R$ ${editingSale.totalAmount.toFixed(2)}`
          })
        });

        alert("Venda cancelada e produtos devolvidos ao estoque!");
        setEditingSale(null); 
        fetchProductsList();
      } else {
        alert("Erro ao cancelar a venda no servidor.");
      }
    } catch (err) {
      console.error("Erro na requisição de cancelamento:", err);
    }
  };

  const openEditModal = (sale: any) => {
    setEditingSale(sale);
    setEditCart([...sale.items]);
    setEditPaymentMethod(sale.paymentMethod || 'PIX');
  };

  const handleModalAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const term = modalSearchInput.trim().toLowerCase();
    if (!term) return;

    const product = products.find(p => p.barcode === term || p.name.toLowerCase().includes(term));
    
    if (product) {
      const existingItem = editCart.find(item => item.product.id === product.id);
      if (existingItem) {

        setEditCart(editCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      } else {
        setEditCart([...editCart, {
          product: product,
          quantity: 1,
          unitPrice: product.sellingPrice
        }]);
      }
      setModalSearchInput('');
    } else {
      alert('Produto não encontrado!');
    }
  };

  const editTotal = editCart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

const handleSaveSaleEdit = async () => {
    if (editCart.length === 0) {
      alert("A venda não pode ficar sem itens!");
      return;
    }

    try {
      const updatedSale = {
        ...editingSale,
        items: editCart,
        paymentMethod: editPaymentMethod,
        totalAmount: editTotal
    
      };
      
      const response = await fetch(`${getApiUrl()}/api/sales/${editingSale.id}?adminName=${currentUser?.name}&adminUsername=${currentUser?.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSale)
      });

      if (response.ok) {
        alert("Venda atualizada com sucesso!");
        setEditingSale(null);
      } else {
        alert("Erro ao atualizar a venda.");
      }
    } catch (err) {
      console.error("Erro na requisição PUT:", err);
    }
  };

  const handleRemoveModalItem = (productId: number) => {
    setEditCart(editCart.filter(item => item.product.id !== productId));
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2">
        <History className="text-indigo-600" />
        <h2 className="font-bold text-lg text-slate-800">Histórico de Vendas</h2>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm">
          <tr>
            <th className="px-6 py-4">ID Venda</th>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4">Forma Pagamento</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sales.map(sale => (
            <tr key={sale.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-mono text-slate-600">#{sale.id}</td>
              <td className="px-6 py-4 text-slate-600">{sale.createdAt.replace('(', ' ').replace(')', '')}</td>
              <td className="px-6 py-4">
                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 uppercase">
                  {sale.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">R$ {sale.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4">
  <div className="flex items-center justify-center gap-2">
    
    {/* Botão de Ver Detalhes (Todos podem ver) */}
    <button 
      onClick={() => setViewingSale(sale)}
      title="Ver Detalhes"
      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all flex items-center justify-center"
    >
      <Eye size={18} />
    </button>

    {/* Botão de Editar (APENAS ADM) */}
    {currentUser?.role === 'ADM' && (
      <button 
        onClick={() => openEditModal(sale)}
        title="Editar Venda (Apenas ADM)"
        className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-xl transition-all flex items-center justify-center"
      >
        <Pencil size={18} />
      </button>
    )}

  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* MODAL DE EDIÇÃO DE VENDA (MINI PDV) */}
      {editingSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            
            {/* Cabeçalho do Modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Editando Venda #{editingSale.id}</h2>
                <p className="text-sm text-slate-500">Faça as alterações necessárias no carrinho abaixo.</p>
              </div>
              <div className="flex items-center gap-8">
              <button 
                  onClick={handleCancelCompletedSale}
                  title="Cancelar/Excluir esta venda permanentemente"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all border border-red-100 shadow-sm"
                >
                  <span className="text-base"><Trash2 size={18} /></span> Cancelar Venda
                </button>
              <button 
                onClick={() => setEditingSale(null)}
                className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors font-bold"
              >
                ✕
              </button>
              </div>
            </div>

            {/* Corpo Dividido */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              
              {/* Esquerda: Busca e Carrinho */}
              <div className="flex-1 flex flex-col p-6 border-r border-slate-100">
                {/* Barra de Pesquisa do Mini PDV */}
                <form onSubmit={handleModalAddProduct} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={modalSearchInput}
                      onChange={(e) => setModalSearchInput(e.target.value)}
                      placeholder="Pesquise por nome ou código de barras e aperte Enter..."
                      className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 outline-none focus:border-purple-500 transition-colors"
                    />
                    <span className="absolute left-4 top-3.5 text-slate-400"><Search size={18} /></span>
                  </div>
                </form>

                {/* Lista de Itens do Carrinho */}
                <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200">
                        <th className="p-3 font-medium">Produto</th>
                        <th className="p-3 font-medium text-center">Qtd</th>
                        <th className="p-3 font-medium text-right">Subtotal</th>
                        <th className="p-3 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editCart.map((item, index) => (
                        <tr key={index} className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-medium text-slate-700">{item.product.name}</td>
                          <td className="p-3 text-center">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-bold">
                              {item.quantity}x
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold text-slate-700">
                            R$ {(item.quantity * item.unitPrice).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => handleRemoveModalItem(item.product.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Remover Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Direita: Resumo e Salvar */}
              <div className="w-full md:w-80 p-6 bg-slate-50 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Select de Pagamento */}
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Forma de Pagamento
                    </label>
                    <select
                      value={editPaymentMethod}
                      onChange={(e) => setEditPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-medium outline-none focus:border-purple-500 transition-colors cursor-pointer"
                    >
                      <option value="PIX">💠 PIX</option>
                      <option value="DINHEIRO">💵 Dinheiro</option>
                      <option value="CREDITO">💳 Crédito</option>
                      <option value="DEBITO">💳 Débito</option>
                    </select>
                  </div>

                  {/* Total Recalculado */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Novo Total</p>
                    <p className="text-4xl font-bold text-emerald-500">R$ {editTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button 
                    onClick={handleSaveSaleEdit}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                  <button 
                    onClick={() => setEditingSale(null)}
                    className="w-full py-3 rounded-xl font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL DE VER DETALHES (SOMENTE LEITURA) */}
      {viewingSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            
            {/* Cabeçalho */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Detalhes da Venda #{viewingSale.id}</h2>
                  <p className="text-sm text-slate-500">Realizada em: {viewingSale.createdAt}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingSale(null)}
                className="text-slate-400 hover:bg-slate-200 hover:text-slate-700 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Informações da Venda */}
            <div className="p-6 bg-white flex flex-col gap-6">
              
              {/* Cards de Resumo */}
              <div className="grid grid-cols-3 gap-4">
                
                {/* Card Operador */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <User size={16} />
                    <p className="text-xs font-bold uppercase tracking-wider">Operador</p>
                  </div>
                  <p className="font-semibold text-slate-700">{viewingSale.operatorName || 'Não registrado'}</p>
                  <p className="text-xs text-slate-400">{viewingSale.operatorRole}</p>
                </div>

                {/* Card Pagamento */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <CreditCard size={16} />
                    <p className="text-xs font-bold uppercase tracking-wider">Pagamento</p>
                  </div>
                  <p className="font-semibold text-slate-700">{viewingSale.paymentMethod || 'Não registrado'}</p>
                </div>

                {/* Card Total */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                    <DollarSign size={16} />
                    <p className="text-xs font-bold uppercase tracking-wider">Total</p>
                  </div>
                  <p className="font-bold text-emerald-500 text-lg">R$ {(viewingSale.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Tabela de Itens Comprados */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                  <Package size={18} className="text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Itens da Venda
                  </h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto pr-2">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="py-2 font-medium">Produto</th>
                        <th className="py-2 font-medium text-center">Qtd</th>
                        <th className="py-2 font-medium text-right">V. Unitário</th>
                        <th className="py-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {viewingSale.items?.map((item: any, index: number) => (
                        <tr key={index} className="text-slate-600">
                          <td className="py-3">{item.product?.name || 'Produto Excluído'}</td>
                          <td className="py-3 text-center">{item.quantity}x</td>
                          <td className="py-3 text-right">R$ {(item.unitPrice || 0).toFixed(2)}</td>
                          <td className="py-3 text-right font-medium text-slate-700">
                            R$ {(item.quantity * (item.unitPrice || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setViewingSale(null)}
                className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Fechar Detalhes
              </button>
            </div>

          </div>
        </div>
      )}
      
    </section>



  )
}