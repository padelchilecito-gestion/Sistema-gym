import React, { useState } from 'react';
import { Client, MembershipStatus } from '../types';
import { Search, Plus, MoreHorizontal, User, Mail, Phone, Edit, Trash2, DollarSign, X, Key } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  registerPayment: (client: Client, amount: number, description: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, addClient, updateClient, deleteClient, registerPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Estados
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('Pago Mensualidad');
  const [formData, setFormData] = useState<Partial<Client>>({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'basic' });

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // ... (Mantener handlers de create, update, payment, delete igual que antes) ...
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

  // NUEVO: Handler para cambiar contraseña
  const handleChangePassword = (client: Client) => {
    const newPass = prompt(`Ingresa nueva contraseña para ${client.name}:`);
    if (newPass) {
        updateClient(client.id, { password: newPass });
        alert('Contraseña actualizada');
    }
    setActiveMenuId(null);
  };

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
                <tr><th className="px-6 py-4">Cliente</th><th className="px-6 py-4 hidden md:table-cell">Contacto</th><th className="px-6 py-4">Saldo</th><th className="px-6 py-4 text-right"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{client.name}</td>
                        <td className="px-6 py-4 hidden md:table-cell text-slate-500">{client.email}</td>
                        <td className={`px-6 py-4 font-bold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>${client.balance}</td>
                        <td className="px-6 py-4 text-right relative">
                            <button onClick={(e) => {e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id)}} className="text-slate-400 p-2"><MoreHorizontal size={20}/></button>
                            {activeMenuId === client.id && (
                                <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden">
                                    <button onClick={() => {setSelectedClient(client); setFormData(client); setIsEditModalOpen(true)}} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-2"><Edit size={16}/> Editar</button>
                                    <button onClick={() => handleChangePassword(client)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-2"><Key size={16}/> Cambiar Clave</button>
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
      
      {/* Modales Create, Edit, Payment (Reutilizar código previo, solo agregando lógica de visualización básica aquí para resumir) */}
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
