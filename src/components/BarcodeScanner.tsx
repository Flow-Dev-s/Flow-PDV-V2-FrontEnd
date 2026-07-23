import { Barcode, Scan } from 'lucide-react'

interface BarcodeScannerProps {
  barcodeInput: string;
  setBarcodeInput: (value: string) => void;
  onAddProduct: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function BarcodeScanner({ barcodeInput, setBarcodeInput, onAddProduct, onKeyDown }: BarcodeScannerProps) {
  return (
    
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col gap-4">
      <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
        <Barcode size={24} className="text-indigo-500" /> 
        Leitor de Código de Barras
      </label>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Scan size={24} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Bipe o produto ou digite o código e aperte Enter..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all text-slate-800 placeholder:text-slate-400"
            autoFocus
          />
        </div>
        <button 
          onClick={onAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-8 py-4 rounded-xl flex items-center gap-2 font-bold text-lg shadow-sm"
        >
          Adicionar
        </button>
      </div>
    </section>
  )
}