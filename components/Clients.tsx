import React, { useState } from 'react';
import { Client, MembershipStatus } from '../types';
import { Search, Plus, MoreHorizontal, User, Mail, Phone, Edit, Trash2, DollarSign, X, Save } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, addClient, updateClient, deleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Estados para formularios
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Client>>({
    status: MembershipStatus.ACTIVE,
    balance: 0,
    plan: 'Standard' // Valor por defecto interno, no visible
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS ---

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const clientToAdd: Client = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        joinDate: new Date().toISOString().split('T')[0],
        status: formData.status as MembershipStatus,
        balance: Number(formData.balance) || 0,
        plan: 'Standard', // Forzamos un plan por defecto
        points: 0,
        level: 'Bronze',
        streak: 0,
        lastVisit: new Date().toISOString(),
        birthDate: formData.birthDate || new Date().toISOString().split('T')[0],
        emergencyContact: formData.emergencyContact || ''
      };
      addClient(clientToAdd);
      setIsModalOpen(false);
      setFormData({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'Standard' });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && formData.name) {
      updateClient(selectedClient.id, formData);
      setIsEditModalOpen(false);
      setSelectedClient(null);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && paymentAmount) {
      // Pagar significa SUMAR al saldo (reducir deuda negativa o aumentar crédito positivo)
      const newBalance = selectedClient.balance + parseFloat(paymentAmount);
      updateClient(selectedClient.id, { balance: newBalance });
      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setSelectedClient(null);
    }
  };

  const openEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData(client); // Cargar datos existentes
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const openPayment = (client: Client) => {
    setSelectedClient(client);
    setIsPaymentModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    setActiveMenuId(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen" onClick={() => setActiveMenuId(null)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar cliente por nombre o email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); setFormData({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'Standard' }); }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Cliente</th>
                <th className="px-6 py-4 font-semibold text-slate-700 hidden md:table-cell">Contacto</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Saldo</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{client.name}</p>
                        <p className="text-slate-500 text-xs">Cumple: {client.birthDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} /> {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${client.status === MembershipStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                        client.status === MembershipStatus.INACTIVE ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* LÓGICA CORREGIDA: Negativo es Rojo (Deuda), Positivo es Verde (Favor) */}
                    <span className={client.balance < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                      ${client.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }}
                      className="text-slate-400 hover:text-slate-600 p-2"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Menú Desplegable */}
                    {activeMenuId === client.id && (
                      <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button onClick={() => openEdit(client)} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                          <Edit size={16} /> Editar Datos
                        </button>
                        <button onClick={() => openPayment(client)} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-emerald-600 flex items-center gap-2 font-medium">
                          <DollarSign size={16} /> Registrar Pago
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button onClick={() => handleDelete(client.id)} className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2">
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-800">{isEditModalOpen ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
               <button onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg"
                  value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input type="tel" className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              {/* NUEVOS CAMPOS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Nacimiento</label>
                  <input required type="date" className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.birthDate || ''} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contacto Emergencia</label>
                  <input type="tel" placeholder="Opcional" className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.emergencyContact || ''} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
                </div>
              </div>

              {/* SALDO INICIAL SOLO AL CREAR */}
              {!isEditModalOpen && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Saldo Inicial (Positivo=Favor, Negativo=Deuda)</label>
                  <input type="number" className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.balance} onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})} />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  {isEditModalOpen ? 'Guardar Cambios' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
             <h3 className="text-xl font-bold text-slate-800 mb-2">Registrar Pago</h3>
             <p className="text-sm text-slate-500 mb-4">Ingresa el monto que el cliente está pagando presencialmente. Se sumará a su saldo.</p>
             
             <div className="mb-4 p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-400 uppercase">Saldo Actual</p>
                <p className={`text-xl font-bold ${selectedClient!.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${selectedClient?.balance}
                </p>
             </div>

             <form onSubmit={handlePayment}>
                <div className="relative mb-6">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input autoFocus type="number" step="0.01" required placeholder="0.00"
                    className="w-full pl-10 p-3 text-lg font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                </div>
                <div className="flex gap-3">
                   <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancelar</button>
                   <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200">Confirmar Pago</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
