import React, { useState } from 'react';
import { Client, GymSettings } from '../types';
import { MessageCircle, Mail, AlertCircle, Smartphone } from 'lucide-react';

interface NotificationsProps {
  clients: Client[];
  settings: GymSettings; // Recibe configuración
}

type MessageTemplate = 'reminder' | 'urgent' | 'promo';

export const Notifications: React.FC<NotificationsProps> = ({ clients, settings }) => {
  const [template, setTemplate] = useState<MessageTemplate>('reminder');

  const debtors = clients.filter(client => client.balance < 0);
  const totalDebt = debtors.reduce((acc, curr) => acc + Math.abs(curr.balance), 0);

  const getMessage = (client: Client, type: MessageTemplate) => {
    const amount = `$${Math.abs(client.balance).toFixed(2)}`;
    const gymName = settings.name; // NOMBRE DINÁMICO
    
    switch (type) {
      case 'reminder':
        return `Hola ${client.name}, esperamos que estés disfrutando de ${gymName}. Te recordamos que tienes un saldo pendiente de ${amount}. ¿Podrías regularizarlo? ¡Gracias!`;
      case 'urgent':
        return `Estimado/a ${client.name}, le informamos desde ${gymName} que su cuenta presenta un saldo vencido de ${amount}. Por favor, realice el pago para evitar la suspensión del servicio.`;
      case 'promo':
        return `¡Hola ${client.name}! ${gymName} tiene una promo especial para saldar tu deuda de ${amount}. Si pagas hoy, te bonificamos un 5% del recargo. ¡Te esperamos!`;
      default: return '';
    }
  };

  const handleWhatsApp = (client: Client) => {
    const message = getMessage(client, template);
    const cleanPhone = client.phone.replace(/\D/g, ''); 
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (client: Client) => {
    const message = getMessage(client, template);
    const gymName = settings.name;
    const subject = template === 'urgent' ? `Aviso de Pago Vencido - ${gymName}` : `Recordatorio de Saldo - ${gymName}`;
    const url = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-red-500" /> Centro de Cobranzas
          </h2>
          <p className="text-slate-500">Gestiona deudas para {settings.name}</p>
        </div>
        
        <div className="bg-red-50 border border-red-100 px-6 py-3 rounded-xl text-right">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Deuda Total</p>
          <p className="text-3xl font-bold text-red-700">${totalDebt.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4 items-center">
            <span className="text-sm font-medium text-slate-700">Plantilla:</span>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button onClick={() => setTemplate('reminder')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'reminder' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Recordatorio</button>
              <button onClick={() => setTemplate('urgent')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'urgent' ? 'bg-red-100 text-red-700' : 'text-slate-600 hover:bg-slate-50'}`}>Urgente</button>
              <button onClick={() => setTemplate('promo')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'promo' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>Promoción</button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100">
              <tr><th className="px-6 py-4 font-semibold text-slate-700">Cliente</th><th className="px-6 py-4 font-semibold text-slate-700">Contacto</th><th className="px-6 py-4 font-semibold text-slate-700">Deuda</th><th className="px-6 py-4 font-semibold text-slate-700 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {debtors.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><div className="font-medium text-slate-900">{client.name}</div></td>
                  <td className="px-6 py-4"><div className="flex flex-col space-y-1"><span className="text-slate-600 flex items-center gap-1"><Smartphone size={12}/> {client.phone}</span><span className="text-slate-600 flex items-center gap-1"><Mail size={12}/> {client.email}</span></div></td>
                  <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold">${Math.abs(client.balance).toFixed(2)}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleWhatsApp(client)} className="flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm font-medium"><MessageCircle size={16} /> WhatsApp</button>
                      <button onClick={() => handleEmail(client)} className="flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"><Mail size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
