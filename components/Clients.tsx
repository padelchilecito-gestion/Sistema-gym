import React, { useState } from 'react';
import { Client, MembershipStatus, Routine } from '../types';
import { Search, Plus, MoreHorizontal, User, Mail, Phone, Edit, Trash2, DollarSign, X, Key, Dumbbell, CheckCircle, Repeat, AlertCircle } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  routines: Routine[]; // NUEVO
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  registerPayment: (client: Client, amount: number, description: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, routines, addClient, updateClient, deleteClient, registerPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false); // NUEVO MODAL
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Estado de formularios
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('Pago Mensualidad');
  const [formData, setFormData] = useState<Partial<Client>>({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'basic' });
  
  // Estado para cambiar rutina en el modal
  const [selectedNewRoutineId, setSelectedNewRoutineId] = useState('');

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
        addClient({ ...formData, id: crypto.randomUUID() } as Client);
        setIsModalOpen(false);
        setFormData({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'basic' });
    }
  };
  const handleUpdate = (e: React.FormEvent) => { e.preventDefault(); if(selectedClient) { updateClient(selectedClient.id, formData); setIsEditModalOpen(false); }};
  const handlePayment = (e: React.FormEvent) => { e.preventDefault(); if(selectedClient) { registerPayment(selectedClient, Number(paymentAmount), paymentDescription); setIsPaymentModalOpen(false); }};
  const handleDelete = (id: string) => { deleteClient(id); setActiveMenuId(null); };
  const handleChangePassword = (client: Client) => {
    const newPass = prompt(`Ingresa nueva contraseña para ${client.name}:`);
    if (newPass) { updateClient(client.id, { password: newPass }); alert('Contraseña actualizada'); }
    setActiveMenuId(null);
  };

  // NUEVO: Asignar o Cambiar Rutina desde el Modal
  const handleAssignRoutine = () => {
    if (selectedClient) {
        if (selectedNewRoutineId === '') {
            // Desasignar
            updateClient(selectedClient.id, { assignedRoutineId: undefined, routineStartDate: undefined });
        } else {
            // Asignar nueva
            updateClient(selectedClient.id, { assignedRoutineId: selectedNewRoutineId, routineStartDate: new Date().toISOString() });
        }
        setIsRoutineModalOpen(false);
    }
  };

  // Helper
  const getPlanName = (planCode: string) => { const names: any = { basic: 'Básica', intermediate: 'Intermedia', full: 'Full' }; return names[planCode] || planCode; };
  const getRoutineName = (id?: string) => { 
      if(!id) return null;
      return routines.find(r => r.id === id)?.name || 'Rutina eliminada';
  };

  const openRoutineModal = (client: Client) => {
      setSelectedClient(client);
      setSelectedNewRoutineId(client.assignedRoutineId || '');
      setIsRoutineModalOpen(true);
      setActiveMenuId(null);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen" onClick={() => setActiveMenuId(null)}>
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 p-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={(e) => {e.stopPropagation(); setIsModalOpen(true); setFormData({status: MembershipStatus.ACTIVE, balance:0, plan:'basic'})}} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"><Plus size={20}/> Nuevo</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4 hidden md:table-cell">Contacto</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Rutina</th> {/* NUEVA COLUMNA */}
                    <th className="px-6 py-4">Saldo</th>
                    <th className="px-6 py-4 text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{client.name}</td>
                        <td className="px-6 py-4 hidden md:table-cell text-slate-500">{client.email}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{getPlanName(client.plan)}</span></td>
                        
                        {/* INFO RUTINA */}
                        <td className="px-6 py-4">
                            {client.assignedRoutineId ? (
                                <span className="text-indigo-600 font-medium text-xs flex items-center gap-1"><Dumbbell size={12}/> {getRoutineName(client.assignedRoutineId)}</span>
                            ) : (
                                <span className="text-slate-400 text-xs italic">Sin asignar</span>
                            )}
                        </td>

                        <td className={`px-6 py-4 font-bold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>${client.balance}</td>
                        <td className="px-6 py-4 text-right relative">
                            <button onClick={(e) => {e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id)}} className="text-slate-400 p-2"><MoreHorizontal size={20}/></button>
                            {activeMenuId === client.id && (
                                <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden">
                                    <button onClick={() => {setSelectedClient(client); setFormData(client); setIsEditModalOpen(true)}} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-2 text-slate-700"><Edit size={16}/> Editar</button>
                                    <button onClick={() => openRoutineModal(client)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-2 text-indigo-600"><Dumbbell size={16}/> Ver/Cambiar Rutina</button>
                                    <button onClick={() => handleChangePassword(client)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-2 text-slate-700"><Key size={16}/> Cambiar Clave</button>
                                    <button onClick={() => {setSelectedClient(client); setIsPaymentModalOpen(true)}} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-emerald-600 flex gap-2"><DollarSign size={16}/> Pagar</button>
                                    <div className="border-t my-1"></div>
                                    <button onClick={() => handleDelete(client.id)} className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex gap-2"><Trash2 size={16}/> Eliminar</button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* MODAL DETALLE Y CAMBIO DE RUTINA */}
      {isRoutineModalOpen && selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
              <div className="bg-white p-0 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Rutina de {selectedClient.name}</h3>
                      <button onClick={()=>setIsRoutineModalOpen(false)}><X size={20} className="text-slate-400"/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Vista Actual */}
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                          <p className="text-xs text-indigo-400 uppercase font-bold mb-1">Asignación Actual</p>
                          {selectedClient.assignedRoutineId ? (
                              <div>
                                  <p className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                                      <CheckCircle size={18}/> {getRoutineName(selectedClient.assignedRoutineId)}
                                  </p>
                                  {/* Lista rápida de ejercicios */}
                                  <div className="mt-3 pl-2 border-l-2 border-indigo-200">
                                      <p className="text-xs text-indigo-500 mb-1">Ejercicios:</p>
                                      <ul className="text-xs text-slate-600 space-y-1 max-h-32 overflow-y-auto">
                                          {routines.find(r => r.id === selectedClient.assignedRoutineId)?.exercises?.map((ex, i) => (
                                              <li key={i}>• {ex.name} ({ex.sets}x{ex.reps})</li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          ) : (
                              <p className="text-slate-500 italic flex items-center gap-2"><AlertCircle size={16}/> No tiene rutina asignada.</p>
                          )}
                      </div>

                      {/* Selector de Cambio */}
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Cambiar o Asignar Nueva:</label>
                          <select 
                              className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={selectedNewRoutineId}
                              onChange={(e) => setSelectedNewRoutineId(e.target.value)}
                          >
                              <option value="">-- Sin Rutina (Quitar) --</option>
                              {routines.map(r => (
                                  <option key={r.id} value={r.id}>{r.name} ({r.difficulty})</option>
                              ))}
                          </select>
                      </div>

                      <button onClick={handleAssignRoutine} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex justify-center gap-2">
                          <Repeat size={18}/> Actualizar Asignación
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Otros Modales (Edit/Create/Payment) - Reutilizados simplificados */}
      {(isModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
              <div className="bg-white p-6 rounded-xl w-full max-w-lg">
                  <h2 className="text-xl font-bold mb-4">{isEditModalOpen ? 'Editar' : 'Nuevo'}</h2>
                  <form onSubmit={isEditModalOpen ? handleUpdate : handleCreate} className="space-y-4">
                      <input required placeholder="Nombre" className="w-full p-2 border rounded" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/>
                      <input required placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/>
                      <div className="flex justify-end gap-2 pt-4">
                          <button type="button" onClick={()=>{setIsModalOpen(false); setIsEditModalOpen(false)}} className="px-4 py-2 text-slate-500">Cancelar</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
              <div className="bg-white p-6 rounded-xl w-full max-w-sm">
                  <h2 className="text-xl font-bold mb-4">Pago</h2>
                  <form onSubmit={handlePayment} className="space-y-4">
                      <input autoFocus type="number" placeholder="Monto" className="w-full p-2 border rounded" value={paymentAmount} onChange={e=>setPaymentAmount(e.target.value)}/>
                      <div className="flex justify-end gap-2 pt-4">
                          <button type="button" onClick={()=>setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-500">Cancelar</button>
                          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Cobrar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
