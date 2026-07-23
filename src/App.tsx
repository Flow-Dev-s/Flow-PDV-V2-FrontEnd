import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Product, CartItem } from './types'
import { Header } from './components/Header'
import { BarcodeScanner } from './components/BarcodeScanner'
import { Cart } from './components/Cart'
import { Inventory } from './components/Inventory';
import { SaleHistory } from './components/SaleInventory';
import { Login } from './components/Login'
import { AuditReports } from './components/AuditReports';
import QRCode from 'react-qr-code';
import { gerarCopiaEColaPix } from './pix/PixUtils';
import { Customers } from './components/Customers';

function App() {
  const [activeTab, setActiveTab] = useState<"vender" | "estoque" | "historico" | "relatorios" | "clientes">("vender")
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [currentUser, setCurrentUser] = useState<{ name: string, role: string, username: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [showPixModal, setShowPixModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Erro:", error))
  }, [])

  const handleAddProduct = () => {
    if (!barcodeInput.trim()) return;
    
    const term = barcodeInput.trim().toLowerCase();
    if (!term) return;

    const product = products.find(p => 
      p.barcode === term || p.name.toLowerCase().includes(term)
    );

    if (product) {
      if (product.currentStock <= 0) {
        alert('Produto sem estoque!');
        return;
      }
    

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity < product.currentStock) {
          return prevCart.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        } else {
          alert('Estoque insuficiente para este produto!');
          return prevCart;
        }
      } else {
        if (product.currentStock > 0) {
          return [...prevCart, { product: product, quantity: 1 }];
        } else {
          alert('Produto sem estoque!');
          return prevCart;
        }
      }
    });
  }
    setBarcodeInput('');
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddProduct();
    }
  }

  const handleRemoveItem = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  }

  const handleClearCart = async () => {
    if (cart.length === 0) return;
    
    if (!window.confirm('Deseja realmente cancelar esta venda em andamento?')) return;
    try {
      await fetch('http://localhost:8080/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUser?.name,
          userUsername: currentUser?.username,
          userRole: currentUser?.role,
          action: `Cancelou uma venda em andamento no valor de R$ ${totalAmount.toFixed(2)}`
        })
      });
    } catch (err) {
      console.error("Erro ao salvar auditoria de cancelamento:", err);
    }

    setCart([]);
    setBarcodeInput('');
    
  };

  const confirmAndSaveSale = async () => {
    try {
      const salePayload = {
        totalAmount: totalAmount || 0,
        paymentMethod: paymentMethod || 'PIX',
        operatorName: currentUser?.name || 'Sistema',
        operatorRole: currentUser?.role || 'OPERADOR',
        customer: selectedCustomer ? { id: selectedCustomer.id } : null,
        items: cart.map((item: any) => ({
          product: { id: item.product?.id || item.id }, 
          quantity: item.quantity || 1,
          unitPrice: item.product?.sellingPrice || item.sellingPrice || 0
        }))
      };

      console.log("📦 PACOTE INDO PARA O JAVA:", salePayload);

      await axios.post('http://localhost:8080/api/sales', salePayload);
      
      alert("Venda realizada com sucesso!");

      window.print();
      
      setCart([]);
      setSelectedCustomer(null);
      setShowPixModal(false);

      
    } catch (error: any) {
      console.error("Erro ao salvar:", error.response?.data);
      alert("Erro: " + error.response?.data);
    }
  };

  const handleFinalizeClick = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'PIX') {

      setShowPixModal(true);
    } else {
      
      confirmAndSaveSale();
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

if (!currentUser) {
    return <Login onLogin={setCurrentUser} setActiveTab={setActiveTab} />
  }

  return (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
    
    <Header 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      user={currentUser} 
      onLogout={async () => {

    try {
          await fetch('http://localhost:8080/api/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: currentUser?.name,
              userUsername: currentUser?.username,
              userRole: currentUser?.role,
              action: 'Fez logoff do sistema'
            })
          });
        } catch (err) {
          console.error("Erro ao salvar auditoria de logout:", err);
        }
  setCurrentUser(null)}} />
    
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
      {activeTab === 'vender' && (
        <>
          <BarcodeScanner 
            barcodeInput={barcodeInput}
            setBarcodeInput={setBarcodeInput}
            onAddProduct={handleAddProduct}
            onKeyDown={handleKeyDown}
          />
          <Cart 
            cart={cart}
            totalItems={totalItems}
            totalAmount={totalAmount}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleFinalizeClick}
            onPaymentMethod={paymentMethod}
            onSetPaymentMethod={setPaymentMethod}
            selectedCustomer={selectedCustomer} 
            setSelectedCustomer={setSelectedCustomer}
            
          />
        </>
      )}
      
      {activeTab === 'estoque' && (
        <Inventory products={products} />
      )}
      
      {activeTab === 'historico' && <SaleHistory
      currentUser={currentUser}
      
      />}
      {activeTab === 'relatorios' && <AuditReports />}
      {activeTab === 'clientes' && <Customers 
      currentUser={currentUser}
      />}
    </main>

    {/* MODAL DE PAGAMENTO VIA PIX */}
      {showPixModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 animate-in zoom-in-95">
            
            {/* Ícone e Título */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-4">
              💠
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Pagamento via PIX</h2>
            <p className="text-slate-500 text-center mb-6">
              Escaneie o QR Code abaixo com o aplicativo do seu banco para pagar.
            </p>

            {/* QR Code (Gerado automaticamente via API gratuita) */}
            <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6 flex justify-center items-center">
              
              <QRCode 
                value={gerarCopiaEColaPix("+5583987143154", "ALBIERE DE LIMA RODRIGUES", "RIO TINTO", totalAmount || 0)} 
                size={192} 
                level="M" 
                className="rounded-lg"
              />

            </div>

            {/* Valor em Destaque */}
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total a Pagar</p>
              <p className="text-5xl font-bold text-emerald-500">
                R$ {(totalAmount || 0).toFixed(2)}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={confirmAndSaveSale}
                className="w-full py-4 rounded-xl font-bold text-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>✓</span> Confirmar Recebimento
              </button>
              
              <button 
                onClick={() => setShowPixModal(false)}
                className="w-full py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancelar e Voltar
              </button>
            </div>

          </div>
        </div>
      )}

  {/* CUPOM NÃO-FISCAL (ESCONDIDO, SÓ APARECE NA IMPRESSÃO) */}
      <div id="cupom-impresso" className="hidden print:block p-2 text-sm">
        <div className="text-center mb-4 border-b border-dashed border-black pb-2">
          <h2 className="font-bold text-lg">MEU PDV - ASSISTÊNCIA</h2>
          <p>CNPJ: 00.000.000/0001-00</p>
          <p>Rua Exemplo, 123 - Centro</p>
          <p>--------------------------------</p>
          <p className="font-bold">CUPOM NÃO FISCAL</p>
        </div>

        <div className="mb-2 border-b border-dashed border-black pb-2">
          <p>Data: {new Date().toLocaleString()}</p>
          <p>Op: {currentUser?.name || 'Caixa 01'}</p>
          <p>Cliente: {selectedCustomer ? selectedCustomer.name : 'Consumidor Final'}</p>
        </div>

        <table className="w-full text-left mb-2">
          <thead>
            <tr className="border-b border-dashed border-black">
              <th>Qtd</th>
              <th>Item</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="align-top py-1">{item.quantity}x</td>
                <td className="align-top py-1 pr-1">{item.product?.name || item.name}</td>
                <td className="align-top py-1 text-right">
                  R$ {(item.quantity * (item.product?.sellingPrice || item.sellingPrice)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-black pt-2 mb-4">
          <div className="flex justify-between font-bold text-base">
            <span>TOTAL:</span>
            <span>R$ {(totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pagamento:</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        <div className="text-center font-bold text-xs mt-6">
          <p>OBRIGADO PELA PREFERÊNCIA!</p>
          <p>Volte Sempre</p>
        </div>
      </div>
  </div>
)
}

export default App