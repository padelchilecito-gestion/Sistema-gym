import React, { useState } from 'react';
import { Client } from '../types';
import { MessageCircle, Mail, AlertCircle, Check, Smartphone, ExternalLink } from 'lucide-react';

interface NotificationsProps {
  clients: Client[];
}

type MessageTemplate = 'reminder' | 'urgent' | 'promo';

export const Notifications: React.FC<NotificationsProps> = ({ clients }) => {
  const [template, setTemplate] = useState<MessageTemplate>('reminder');

  // Filter only clients with debt (positive balance)
  const debtors = clients.filter(client => client.balance > 0);
  const totalDebt = debtors.reduce((acc, curr) => acc + curr.balance, 0);

  const getMessage = (client: Client, type: MessageTemplate) => {
    const amount = `$${client.balance.toFixed(2)}`;
    
    switch (type) {
      case 'reminder':
        return `Hola ${client.name}, esperamos que estés disfrutando de GymFlow. Te recordamos que tienes un saldo pendiente de ${amount}. ¿Podrías pasar a regularizarlo? ¡Gracias!`;
      case 'urgent':
        return `Hola ${client.name}. Notamos que tu cuenta presenta un saldo vencido de ${amount}. Por favor realiza el pago lo antes posible para evitar la suspensión del servicio.`;
      case 'promo':
        return `Hola ${client.name}! Tenemos una promo especial para saldar tu deuda de ${amount}. Si pagas hoy te bonificamos el recargo. Te esperamos en recepción!`;
      default:
        return '';
    }
  };

  const handleWhatsApp = (client: Client) => {
    const message = getMessage(client, template);
    // Strip non-numeric characters for the phone link
    const cleanPhone = client.phone.replace(/\D/g, ''); 
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (client: Client) => {
    const message = getMessage(client, template);
    const subject = template === 'urgent' ? 'Aviso de Pago Vencido - GymFlow' : 'Recordatorio de Saldo - GymFlow';
    const url = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            Centro de Cobranzas
          </h2>
          <p className="text-slate-500">Gestiona los pagos pendientes y notifica a tus clientes.</p>
        </div>
        
        <div className="bg-red-50 border border-red-100 px-6 py-3 rounded-xl text-right">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Deuda Total Acumulada</p>
          <p className="text-3xl font-bold text-red-700">${totalDebt.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Configuration Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Plantilla de Mensaje:</span>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setTemplate('reminder')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'reminder' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Recordatorio
              </button>
              <button
                onClick={() => setTemplate('urgent')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'urgent' ? 'bg-red-100 text-red-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Urgente
              </button>
              <button
                onClick={() => setTemplate('promo')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${template === 'promo' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Promoción
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-500 italic">
            * Los mensajes se envían a través de tu WhatsApp Web/App personal.
          </div>
        </div>

        {/* Debtors List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Cliente</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Contacto</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Deuda</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Plan</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Enviar Notificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {debtors.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-400">ID: {client.id.slice(0,6)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                       <span className="text-slate-600 flex items-center gap-1"><Smartphone size={12}/> {client.phone}</span>
                       <span className="text-slate-600 flex items-center gap-1"><Mail size={12}/> {client.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold">
                      ${client.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{client.plan}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleWhatsApp(client)}
                        className="flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm font-medium"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle size={16} />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleEmail(client)}
                        className="flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        title="Enviar Email"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {debtors.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">¡Todo al día!</h3>
            <p className="text-slate-500">No tienes clientes con deudas pendientes.</p>
          </div>
        )}
      </div>
      
      {/* Message Preview */}
      {debtors.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
            <ExternalLink size={20} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 text-sm mb-1">Vista previa del mensaje seleccionado:</h4>
            <p className="text-indigo-800 text-sm italic">
              "{getMessage({ name: 'Juan Pérez', balance: 100 } as Client, template)}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};