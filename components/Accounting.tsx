import React, { useState } from 'react';
import { Transaction, TransactionType, Client } from '../types';
import { Plus, TrendingUp, TrendingDown, Filter, DollarSign } from 'lucide-react';

interface AccountingProps {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  clients: Client[];
}

export const Accounting: React.FC<AccountingProps> = ({ transactions, addTransaction, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({
    type: TransactionType.INCOME,
    date: new Date().toISOString().split('T')[0],
    category: 'Mensualidad'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTrans.description && newTrans.amount) {
      addTransaction({
        id: crypto.randomUUID(),
        description: newTrans.description,
        amount: Number(newTrans.amount),
        date: newTrans.date || new Date().toISOString().split('T')[0],
        type: newTrans.type as TransactionType,
        category: newTrans.category || 'Varios',
        clientId: newTrans.clientId
      });
      setIsModalOpen(false);
      setNewTrans({ type: TransactionType.INCOME, date: new Date().toISOString().split('T')[0], category: 'Mensualidad' });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Libro Diario</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-lg"
        >
          <Plus size={18} />
          Registrar Movimiento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-2 text-slate-500 text-sm">
             <Filter size={16} />
             <span>Todos los movimientos</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Descripción</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Categoría</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Tipo</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice().reverse().map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{t.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     {t.type === TransactionType.INCOME ? (
                       <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                         <TrendingUp size={14} /> Ingreso
                       </span>
                     ) : (
                       <span className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider">
                         <TrendingDown size={14} /> Gasto
                       </span>
                     )}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Add Transaction Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Registrar Transacción</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setNewTrans({...newTrans, type: TransactionType.INCOME})}
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all
                    ${newTrans.type === TransactionType.INCOME ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <TrendingUp size={24} />
                  <span className="font-semibold">Ingreso</span>
                </div>
                <div 
                  onClick={() => setNewTrans({...newTrans, type: TransactionType.EXPENSE})}
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all
                    ${newTrans.type === TransactionType.EXPENSE ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <TrendingDown size={24} />
                  <span className="font-semibold">Gasto</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <DollarSign size={18} />
                  </div>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    step="0.01"
                    className="w-full pl-10 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-lg"
                    value={newTrans.amount || ''}
                    onChange={e => setNewTrans({...newTrans, amount: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newTrans.description || ''}
                  onChange={e => setNewTrans({...newTrans, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTrans.date}
                    onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTrans.category}
                    onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                  >
                    {newTrans.type === TransactionType.INCOME ? (
                      <>
                        <option value="Mensualidad">Mensualidad</option>
                        <option value="Productos">Venta Productos</option>
                        <option value="Servicios">Servicios Personalizados</option>
                      </>
                    ) : (
                      <>
                        <option value="Alquiler">Alquiler</option>
                        <option value="Servicios">Servicios (Luz/Agua)</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Salarios">Salarios</option>
                        <option value="Equipo">Equipo</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {newTrans.type === TransactionType.INCOME && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente (Opcional)</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTrans.clientId || ''}
                    onChange={e => setNewTrans({...newTrans, clientId: e.target.value})}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};