import { useState, useMemo } from 'react'
import { 
  Package, 
  AlertTriangle, 
  ScanLine,  
  TrendingUp, 
  PlusCircle, 
  Filter, 
  Tag,
  Pencil, Trash2,
  PackagePlus, X, Save, Barcode, DollarSign, Layers,
  Edit, Shapes
} from 'lucide-react'
import type { Product } from '../types'


interface InventoryProps {
  products: Product[];
}


export function Inventory({ products }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'lista' | 'mais-vendidos' | 'estoque-baixo'>('lista');
  const [activeCategory, setActiveCategory] = useState('Geral (Todas)');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    costPrice: '',
    sellingPrice: '',
    currentStock: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };


  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: newProduct.name,
        barcode: newProduct.barcode,
        costPrice: parseFloat(newProduct.costPrice.replace(',', '.')) || 0,
        sellingPrice: parseFloat(newProduct.sellingPrice.replace(',', '.')) || 0,
        currentStock: parseInt(newProduct.currentStock) || 0
      };

      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");

        setNewProduct({ 
          name: '', 
          barcode: '', 
          costPrice: '', 
          sellingPrice: '', 
          currentStock: '' 
        });
 
        setIsAddModalOpen(false);
        
        fetchProducts(); 
        
      } else {
        alert("Erro ao cadastrar produto no servidor. Verifique o console do Java.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao tentar conectar com a API. O Java está rodando?");
    }
  };


  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("Produto excluído com sucesso!");
      } else {
        alert("Erro ao excluir. O produto pode estar vinculado a uma venda anterior.");
      }
    } catch (err) {
      console.error("Erro ao tentar excluir o produto:", err);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (response.ok) {
        setEditingProduct(null);
        alert("Produto atualizado com sucesso!"); 
      } else {
        alert("Erro ao atualizar produto.");
      }
    } catch (err) {
      console.error("Erro na requisição PUT:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    'Geral (Todas)', 'Cabos', 'Carregadores', 'Monitores', 
    'Caixas de Som', 'Colecionáveis', 'Térmicos'
  ];

  const totalProducts = products?.length || 0;
  const stockValue = products?.reduce((acc, p) => acc + (p.sellingPrice * p.currentStock), 0) || 0;
  const lowStockCount = products?.filter(p => p.currentStock < 5).length || 0;

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      
      if (response.ok) {
        const data = await response.json();
        products = data;
      } else {
        console.error("Erro do servidor ao buscar produtos:", response.statusText);
      }
    } catch (err) {
      console.error("Erro de conexão ao buscar produtos. O Java está rodando?", err);
    }
  };


  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm);
      const matchesCategory = activeCategory === 'Geral (Todas)' || p.category === activeCategory;
      const matchesLowStock = activeTab === 'estoque-baixo' ? p.currentStock < 5 : true;

      return matchesSearch && matchesCategory && matchesLowStock;
    });

    if (activeTab === 'mais-vendidos') {
      result = result.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
    }

    return result;
  }, [products, searchTerm, activeCategory, activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 1. Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Produtos</p>
            <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Valor em Estoque</p>
            <p className="text-2xl font-bold text-slate-800">
              R$ {stockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Estoque Baixo</p>
            <p className="text-2xl font-bold text-slate-800">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* 2. Área de Pesquisa */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <ScanLine size={20} />
          <h2>Pesquisar Produto</h2>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Digite ou bipe o código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 placeholder:text-slate-400"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
            <ScanLine size={18} />
            Pesquisar
          </button>
        </div>
      </div>

      {/* 3. Botões de Ação */}
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => setActiveTab('lista')}
          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'lista' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package size={18} /> Lista de Estoque
        </button>

        <button 
          onClick={() => setActiveTab('mais-vendidos')}
          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'mais-vendidos' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp size={18} /> Mais Vendidos
        </button>

        {/* Estoque Baixo */}
        <button 
          onClick={() => setActiveTab('estoque-baixo')}
          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'estoque-baixo' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
          }`}
        >
          <AlertTriangle size={18} className={activeTab === 'estoque-baixo' ? 'text-white' : 'text-orange-500'} /> 
          Estoque Baixo
        </button>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          <span>Adicionar Produto</span>
        </button>
      </div>

      {/* 4. Tabela de Produtos com Filtros de Categoria */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Cabeçalho da Tabela e Tags */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-800">Todos os Produtos</h3>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
              <Filter size={16} /> Categoria:
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat !== 'Geral (Todas)' && <Tag size={14} />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela em si */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Custo</th>
                <th className="px-6 py-4 text-center">Estoque</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{p.category || 'N/A'}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-sm">{p.barcode}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">R$ {p.sellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500">R$ {(p.custPrice || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${p.currentStock < 5 ? 'text-orange-600' : 'text-slate-700'}`}>
                      {p.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.currentStock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.currentStock > 0 ? 'Ativo' : 'Esgotado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botão de Editar */}
                      <button 
                        onClick={() => setEditingProduct(p)}
                        title="Editar Produto"
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Botão de Excluir */}
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        title="Excluir Produto"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    Nenhum produto encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      

      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            
            {/* Cabeçalho */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Edit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Editar Produto</h2>
                  <p className="text-sm text-slate-500">Atualize as informações do item.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:bg-slate-200 hover:text-slate-700 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSaveChanges}>
              <div className="p-6 space-y-4">
                
                {/* Nome do Produto */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Tag size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="pl-10 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Código de Barras e Categoria (Grid) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Barcode size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={editingProduct.barcode}
                        onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Shapes size={18} />
                      </div>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all appearance-none"
                      >
                        {categories.filter(c => c !== 'Geral (Todas)').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preços e Estoque (Grid) */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Custo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Custo (R$)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <DollarSign size={18} />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.custPrice}
                        onChange={(e) => setEditingProduct({...editingProduct, custPrice: parseFloat(e.target.value)})}
                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  {/* Venda (Destaque em verde) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Venda (R$)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                        <DollarSign size={18} />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.sellingPrice}
                        onChange={(e) => setEditingProduct({...editingProduct, sellingPrice: parseFloat(e.target.value)})}
                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  {/* Estoque */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Layers size={18} />
                      </div>
                      <input
                        type="number"
                        required
                        value={editingProduct.currentStock}
                        onChange={(e) => setEditingProduct({...editingProduct, currentStock: parseInt(e.target.value)})}
                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Rodapé com Botões */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* MODAL DE ADICIONAR PRODUTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            
            {/* Cabeçalho */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <PackagePlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Cadastrar Produto</h2>
                  <p className="text-sm text-slate-500">Adicione um novo item ao estoque.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors"
                title="Fechar"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleAddProduct}>
              <div className="p-6 space-y-4">
                
                {/* Nome do Produto */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Tag size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Ex: Cabo Tipo C - Turbo 20W"
                    />
                  </div>
                </div>

                {/* Código de Barras */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Barcode size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="barcode"
                      value={newProduct.barcode}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Escaneie ou digite o código"
                    />
                  </div>
                </div>

                {/* Preços e Estoque (Grid) */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Preço de Custo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço de Custo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <DollarSign size={18} />
                      </div>
                      <input 
                        type="number" 
                        step="0.01"
                        name="costPrice"
                        value={newProduct.costPrice}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Preço de Venda */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço de Venda *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                        <DollarSign size={18} />
                      </div>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        name="sellingPrice"
                        value={newProduct.sellingPrice}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-xl border border-emerald-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Estoque Inicial */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Inicial</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Layers size={18} />
                      </div>
                      <input 
                        type="number" 
                        name="currentStock"
                        value={newProduct.currentStock}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Qtd."
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Rodapé com Botões */}
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
                  <span>Salvar Produto</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}




