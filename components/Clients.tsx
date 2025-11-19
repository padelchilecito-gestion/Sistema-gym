import React, { useState } from 'react';
import { Client, MembershipStatus } from '../types';
import { Search, Plus, MoreHorizontal, User, Mail, Phone } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  addClient: (client: Client) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, addClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    status: MembershipStatus.ACTIVE,
    balance: 0,
    plan: 'Standard'
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      const clientToAdd: Client = {
        id: crypto.randomUUID(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone || '',
        joinDate: new Date().toISOString().split('T')[0],
        status: newClient.status as MembershipStatus,
        balance: Number(newClient.balance) || 0,
        plan: newClient.plan || 'Standard',
        points: 0,
        level: 'Bronze',
        streak: 0,
        lastVisit: new Date().toISOString(),
        birthDate: new Date().toISOString().split('T')[0]
      };
      addClient(clientToAdd);
      setIsModalOpen(false);
      setNewClient({ status: MembershipStatus.ACTIVE, balance: 0, plan: 'Standard' });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Cliente</th>
                <th className="px-6 py-4 font-semibold text-slate-700 hidden md:table-cell">Contacto</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Plan</th>
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
                        <p className="text-slate-500 text-xs">Desde {client.joinDate}</p>
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
                  <td className="px-6 py-4 text-slate-700 font-medium">{client.plan}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${client.status === MembershipStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                        client.status === MembershipStatus.INACTIVE ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={client.balance > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                      ${client.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No se encontraron clientes.
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Registrar Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newClient.name || ''}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newClient.email || ''}
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newClient.phone || ''}
                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newClient.plan}
                    onChange={e => setNewClient({...newClient, plan: e.target.value})}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Estándar">Estándar</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Saldo Inicial</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newClient.balance}
                    onChange={e => setNewClient({...newClient, balance: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};