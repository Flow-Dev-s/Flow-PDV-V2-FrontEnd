import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'


export function InventoryFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    lowStock: false,
    minPrice: '',
    maxPrice: ''
  });

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 font-semibold text-slate-700">
        <span className="flex items-center gap-2"><Filter size={18} /> Filtros</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filters.lowStock} onChange={(e) => updateFilters({...filters, lowStock: e.target.checked})} />
            Estoque Baixo
          </label>

          <div className="flex items-center gap-2">
            <span>Preço:</span>
            <input type="number" placeholder="R$ Min" className="w-24 p-2 border rounded-lg" value={filters.minPrice} onChange={(e) => updateFilters({...filters, minPrice: e.target.value})} />
            <span>até</span>
            <input type="number" placeholder="R$ Max" className="w-24 p-2 border rounded-lg" value={filters.maxPrice} onChange={(e) => updateFilters({...filters, maxPrice: e.target.value})} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryFilters;