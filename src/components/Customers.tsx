import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Mail, MapPin, X, Save, CreditCard, Search, Eye, Pencil, Edit, User,
    Wallet, History, AlertCircle, QrCode, Banknote, CheckCircle,
    FileText,
 } from 'lucide-react';

import QRCode from 'react-qr-code';
import { gerarCopiaEColaPix } from '../pix/PixUtils';
<<<<<<< HEAD
import { getApiUrl } from '../config';
=======

>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
interface CustomersProps {
  currentUser: { name: string, role: string } | null;
}

export function Customers({currentUser} : CustomersProps) {

  const [customers, setCustomers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customerSales, setCustomerSales] = useState<any[]>([]);
  const [isDebtPaymentModalOpen, setIsDebtPaymentModalOpen] = useState(false);
  const [debtPaymentAmount, setDebtPaymentAmount] = useState<number>(0);
  const [debtPaymentMethod, setDebtPaymentMethod] = useState('PIX');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<any | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    document: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {

<<<<<<< HEAD
      const response = await fetch(`${getApiUrl()}/api/customers`);
=======
      const response = await fetch('http://localhost:8080/api/customers');
>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleProcessDebtPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const amountToPay = parseFloat(debtPaymentAmount.toString().replace(',', '.'));
    
    if (isNaN(amountToPay) || amountToPay <= 0) {
      alert("Por favor, informe um valor válido maior que zero.");
      setIsProcessingPayment(false);
      return;
    }

    if (amountToPay > viewingCustomer.debtAmount) {
      alert("O valor informado é maior do que a dívida atual do cliente!");
      setIsProcessingPayment(false);
      return;
    }

    const updatedCustomer = {
      ...viewingCustomer,
      debtAmount: viewingCustomer.debtAmount - amountToPay
    };

    try {
<<<<<<< HEAD
      const response = await fetch(`${getApiUrl()}/api/customers/${viewingCustomer.id}`, {
=======
      const response = await fetch(`http://localhost:8080/api/customers/${viewingCustomer.id}`, {
>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      });

      if (response.ok) {
        alert(`Pagamento de R$ ${amountToPay.toFixed(2)} registrado com sucesso!`);
      
        setViewingCustomer(updatedCustomer); 
        fetchCustomers(); 
        setIsDebtPaymentModalOpen(false);
        
      } else {
        alert("Erro ao registrar o pagamento.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setIsProcessingPayment(false);
    }
  };


  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'document') {
      const apenasNumeros = value.replace(/\D/g, '');
      setEditingCustomer((prev: any) => ({ ...prev, [name]: apenasNumeros }));
      return;
    }
    setEditingCustomer((prev: any) => ({ ...prev, [name]: value }));
  };

  // Salva as alterações no banco (Java)
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
<<<<<<< HEAD
      const response = await fetch(`${getApiUrl()}/api/customers/${editingCustomer.id}`, {
=======
      const response = await fetch(`http://localhost:8080/api/customers/${editingCustomer.id}`, {
>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer)
      });

      if (response.ok) {
        alert("Cliente atualizado com sucesso!");
        setEditingCustomer(null);
        fetchCustomers(); // Recarrega a tabela
      } else {
        alert("Erro ao atualizar o cliente.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setIsSaving(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone' || name === 'document') {

      const apenasNumeros = value.replace(/\D/g, '');
      setNewCustomer(prev => ({ ...prev, [name]: apenasNumeros }));
      return; 
    }

    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDetails = async (customer: any) => {
    setViewingCustomer(customer);
    setCustomerSales([]);
    try {
<<<<<<< HEAD
      const response = await fetch(`${getApiUrl()}/api/sales/customer?name=${encodeURIComponent(customer.name)}`);
=======
      const response = await fetch(`http://localhost:8080/api/sales/customer?name=${encodeURIComponent(customer.name)}`);
>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
      if (response.ok) {
        const data = await response.json();
        setCustomerSales(data);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico de vendas:", err);
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await fetch(`${getApiUrl()}/api/customers`, {
=======
      const response = await fetch('http://localhost:8080/api/customers', {
>>>>>>> 62b8baff2cf4a74c24db37a97a8492d6a6f474a5
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        alert("Cliente cadastrado com sucesso!");
        setNewCustomer({ name: '', phone: '', email: '', document: '', address: '' });
        setIsAddModalOpen(false);
        fetchCustomers();
      } else {
        alert("Erro ao cadastrar cliente.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in">
      
      {/* Cabeçalho da Tela */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Clientes
          </h1>
          <p className="text-slate-500 mt-1">Gerencie sua base de clientes e histórico.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-slate-700"
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <th className="p-4 font-medium uppercase tracking-wider">Nome do Cliente</th>
              <th className="p-4 font-medium uppercase tracking-wider">Contato</th>
              <th className="p-4 font-medium uppercase tracking-wider">Documento</th>
              <th className="p-4 font-medium uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, idx) => (
                <tr key={customer.id || idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                  <td className="p-4 text-slate-600">
                    <div className="flex flex-col">
                      <span>{customer.phone}</span>
                      <span className="text-xs text-slate-400">{customer.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{customer.document || '---'}</td>
                  <td className="p-4 flex justify-center gap-2">
                    {/* Botão Ver Detalhes (Todos) */}
                    <button 
                      onClick={() => handleOpenDetails(customer)}
                      title="Ver Detalhes"
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all flex items-center justify-center"
                    >
                      <Eye size={18} />
                    </button>
                    
                    {/* Botão Editar (Apenas ADM) */}
                    {currentUser?.role === 'ADM' && (
                      <button 
                        onClick={() => setEditingCustomer(customer)}
                        title="Editar Cliente (Apenas ADM)"
                        className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE ADICIONAR CLIENTE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Cadastrar Cliente</h2>
                  <p className="text-sm text-slate-500">Adicione as informações de contato.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:bg-slate-200 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer}>
              <div className="p-6 space-y-4">
                
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Users size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={newCustomer.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                </div>

                {/* Grid: Telefone e Documento */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="phone"
                        value={newCustomer.phone}
                        maxLength={11}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <CreditCard size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="document"
                        value={newCustomer.document}
                        maxLength={14}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Apenas números"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={newCustomer.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="address"
                      value={newCustomer.address}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Rua, Número, Bairro, Cidade"
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Débito Atual (R$)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                        <Wallet size={18} />
                      </div>
                      <input 
                        type="number" step="0.01" name="debtAmount"
                        value={editingCustomer?.debtAmount || 0.0} onChange={handleEditInputChange}
                        className="pl-10 w-full rounded-xl border border-red-200 px-4 py-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      />
                    </div>
                  </div>

              </div>

              {/* Rodapé */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Save size={18} />
                  <span>Salvar Cliente</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* MODAL DE VER DETALHES E HISTÓRICO */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{viewingCustomer.name}</h2>
                  <p className="text-sm text-slate-500">Cadastrado no sistema</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCustomer(null)}
                className="text-slate-400 hover:bg-slate-200 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* CARD DE DÉBITO (SISTEMA DE CRÉDITO) */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                  (viewingCustomer?.debtAmount || 0) > 0 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-emerald-50 border-emerald-100'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    (viewingCustomer?.debtAmount || 0) > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-wider ${
                      (viewingCustomer?.debtAmount || 0) > 0 ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      Valor em Aberto (Fiado)
                    </p>
                    <p className={`text-2xl font-bold ${
                      (viewingCustomer?.debtAmount || 0) > 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      R$ {(viewingCustomer?.debtAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* BOTÃO DE PAGAR DÍVIDA SÓ APARECE SE ELE DEVER */}
                {(viewingCustomer?.debtAmount || 0) > 0 && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-lg text-sm font-medium">
                      <AlertCircle size={14} />
                      <span>Com Pendências</span>
                    </div>
                    <button 
                      onClick={() => {
                        setDebtPaymentAmount(viewingCustomer.debtAmount);
                        setDebtPaymentMethod('PIX');
                        setIsDebtPaymentModalOpen(true);
                      }}
                      className="mt-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Receber Pagamento
                    </button>
                  </div>
                )}
              </div>

              {/* DADOS CADASTRAIS */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Dados Cadastrais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Telefone</p>
                    <p className="font-medium text-slate-700">{viewingCustomer.phone || 'Não informado'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Documento</p>
                    <p className="font-medium text-slate-700">{viewingCustomer.document || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* HISTÓRICO DE COMPRAS */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                  <History size={18} className="text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Histórico de Compras</h3>
                </div>
                
                {customerSales.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50">
                        <tr className="text-slate-500">
                          <th className="p-3 font-medium">Data</th>
                          <th className="p-3 font-medium">Pagamento</th>
                          <th className="p-3 font-medium text-right">Total</th>
                          <th className="p-3 font-medium text-center">Detalhes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerSales.map((sale: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-slate-700">{sale.createdAt}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                sale.paymentMethod === 'FIADO' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {sale.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3 text-right font-medium text-slate-800">
                              R$ {(sale.totalAmount || 0).toFixed(2)}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => setSelectedSaleDetails(sale)}
                                title="Ver itens da venda"
                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all inline-flex items-center justify-center"
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500">
                    Nenhuma compra registrada para este cliente.
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setViewingCustomer(null)}
                className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL DE EDITAR CLIENTE */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  <Edit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Editar Cliente</h2>
                  <p className="text-sm text-slate-500">Atualize os dados cadastrais.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:bg-slate-200 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveChanges}>
              <div className="p-6 space-y-4">
                
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Users size={18} />
                    </div>
                    <input 
                      type="text" name="name" required
                      value={editingCustomer?.name || ''} onChange={handleEditInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Grid: Telefone e Documento */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                      <input 
                        type="text" name="phone" maxLength={11}
                        value={editingCustomer?.phone || ''} onChange={handleEditInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><CreditCard size={18} /></div>
                      <input 
                        type="text" name="document" maxLength={14}
                        value={editingCustomer?.document || ''} onChange={handleEditInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email e Endereço */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                      <input 
                        type="email" name="email"
                        value={editingCustomer?.email || ''} onChange={handleEditInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                      <input 
                        type="text" name="address"
                        value={editingCustomer?.address || ''} onChange={handleEditInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* DÉBITO DO CLIENTE */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Débito Atual (R$)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                      <Wallet size={18} />
                    </div>
                    <input 
                      type="number" step="0.01" name="debtAmount"
                      value={editingCustomer?.debtAmount || 0} onChange={handleEditInputChange}
                      className="pl-10 w-full rounded-xl border border-red-200 px-4 py-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>

              {/* Rodapé */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button 
                  type="button" onClick={() => setEditingCustomer(null)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    {/* MODAL DE PAGAR DÍVIDA (SOBREPOSTO) */}
      {isDebtPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <Banknote size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Receber Pagamento</h2>
                  <p className="text-sm text-slate-500">{viewingCustomer.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDebtPaymentModalOpen(false)}
                className="text-slate-400 hover:bg-slate-200 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProcessDebtPayment} className="p-6 space-y-5">
              
              {/* Valor a Pagar */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Valor do Pagamento (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={Number(debtPaymentAmount)}
                  onChange={(e) => setDebtPaymentAmount(Number(e.target.value))}
                  className="w-full text-center text-3xl font-bold text-slate-800 bg-slate-50 rounded-xl border border-slate-200 px-4 py-4 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                <p className="text-center text-sm text-slate-500 mt-2">
                  Dívida total: <span className="font-bold text-red-500">R$ {viewingCustomer.debtAmount.toFixed(2)}</span>
                </p>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDebtPaymentMethod('PIX')}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      debtPaymentMethod === 'PIX' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <QrCode size={24} />
                    <span className="font-bold">PIX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtPaymentMethod('DINHEIRO')}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      debtPaymentMethod === 'DINHEIRO' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <Banknote size={24} />
                    <span className="font-bold">Dinheiro</span>
                  </button>
                </div>
              </div>

              {/* Área do PIX (Simulação) */}
              {debtPaymentMethod === 'PIX' && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-center flex-col gap-2">
                  <div className="w-32 h-32 bg-white rounded-lg border-2 border-emerald-200 flex items-center justify-center text-emerald-500">
                    <QRCode 
                value={gerarCopiaEColaPix("+5583987143154", "ALBIERE DE LIMA RODRIGUES", "RIO TINTO", debtPaymentAmount || 0)} 
                size={192} 
                level="M" 
                className="rounded-lg"
              />
                  </div>
                  <p className="text-xs font-bold text-emerald-600 text-center uppercase tracking-wider">
                    Aguardando Pagamento...
                  </p>
                </div>
              )}

              {/* Botão Confirmar */}
              <button 
                type="submit"
                disabled={isProcessingPayment}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {isProcessingPayment ? 'Processando...' : 'Confirmar Recebimento'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DE UMA VENDA ESPECÍFICA (SOBREPOSTO COM ÍCONES LUCIDE) */}
      {selectedSaleDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[85vh]">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Detalhes da Venda</h2>
                  <p className="text-xs text-slate-500">Realizada em: {selectedSaleDetails.createdAt}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSaleDetails(null)}
                className="text-slate-400 hover:bg-slate-200 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Informações gerais da venda com ícones Lucide */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Pagamento</span>
                    <span className="font-bold text-slate-700">{selectedSaleDetails.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Operador(a)</span>
                    <span className="font-bold text-slate-700">{selectedSaleDetails.operatorName || 'Caixa'}</span>
                  </div>
                </div>
              </div>

              {/* Lista de Itens Comprados */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Produtos Comprados</h4>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs">
                      <tr>
                        <th className="p-2.5">Produto</th>
                        <th className="p-2.5 text-center">Qtd</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedSaleDetails.items && selectedSaleDetails.items.length > 0 ? (
                        selectedSaleDetails.items.map((item: any, i: number) => (
                          <tr key={i} className="text-slate-700">
                            <td className="p-2.5 font-medium">{item.product?.name || 'Produto'}</td>
                            <td className="p-2.5 text-center">{item.quantity}x</td>
                            <td className="p-2.5 text-right font-medium">
                              R$ {((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-slate-400 text-xs">
                            Itens não detalhados nesta venda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Geral */}
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900">Valor Total da Venda</span>
                <span className="text-xl font-bold text-blue-700">
                  R$ {(selectedSaleDetails.totalAmount || 0).toFixed(2)}
                </span>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedSaleDetails(null)}
                className="px-5 py-2.5 rounded-xl font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}